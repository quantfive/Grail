
import React, { Component } from 'react';

// NPM Modules
import { css, StyleSheet } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import xhook from 'xhook';

// Components
import ResultsModal from '../modals/ResultsModal';

// Redux
import { ModalActions } from '../../redux/modals';

class SaveControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grailCurrentHref: window.location.href,
      grailRunning: false,
      grailPaused: sessionStorage.getItem('grail-paused') === 'true',
    };

    this.clickedElements = (JSON.parse(sessionStorage.getItem('grail-clicked-elements')) || {})[this.state.grailCurrentHref] || [];
    // TODO change this to a per page basis?
    this.ignoredElements = JSON.parse(sessionStorage.getItem('grail-ignored-elements')) || [];
    this.visitedPages = JSON.parse(sessionStorage.getItem('grail-visited-pages')) || [];
    this.activeRequests = [];
  }

  componentDidMount() {
    window.addEventListener('error', this.recordFrontendError, false);

    xhook.before(this.xhookBeforeAction);
    xhook.after(this.xhookAfterAction);
    xhook.enable();

    if (this.activeRequests.length === 0) {
      this.handleLoad();
    }
  }

  resetGrail = () => {
    xhook.disable();
    sessionStorage.setItem('grail-running', false);
    this.clickedElements = [];
    this.visitedPages = [];
    this.activeRequests = [];
    this.setState({grailRunning: false});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.activeRequests.length === 0) {
      this.handleLoad();
    }
  }

  handleLoad = () => {
    let running = sessionStorage.getItem('grail-running');

    if (running === 'true' && !this.state.grailRunning) {
      this.setState({
        grailRunning: true,
      }, this.clickAllElements);
    }
  }

  startClickAll = () => {
    sessionStorage.setItem('grail-running', true);
    sessionStorage.setItem('grail-origin', window.location.origin);

    xhook.enable();

    this.setState({
      grailRunning: true,
    }, this.clickAllElements);
  }

  // CLICK LOGIC
  clickAllElements = () => {
    // TODO create options so you can have multiple origins?
    if (window.location.origin === sessionStorage.getItem('grail-origin') && !this.visitedPages.includes(this.state.grailCurrentHref)) {

      this.addToStorage('grail-page-queue', this.state.grailCurrentHref);

      // TODO Time bound these so that we don't get caught be setInterval or requests that execute periodically
      if (this.activeRequests.length > 0) {
        setTimeout(this.clickAllElements, 100);
        return;
      }

      let elements = this.getClickableElements();
      let elementQueue = this.addToStorageByPage('grail-element-queue', this.state.grailCurrentHref, elements.map((e) => { return e.outerHTML; }));

      // TODO search for more elements in queue that are not currently visible?
      if (elements.length > 0) {
        if (this.state.grailPaused) {
          return;
        }
        this.clickElement(elements[0]);
        return;
      }

      this.markPage(this.state.grailCurrentHref);
    }

    let page = this.popFromStorage('grail-page-queue');
    if (!page) { // traversed all pages
      this.resetGrail();
      this.props.modalActions.openResultsModal(true);
    } else {
      if (this.state.grailPaused) {
        return;
      }
      window.location = page;
    }
  }

  getClickableElements = () => {
    // TODO simplify to to something like:
    // return [...document.querySelectorAll(':not([class^=grailTest])')].filter(this.clickable);
    let nodes = document.querySelectorAll(':not([class^=grailTest])');
    let filteredNodes = [];
    for (let i = 0; i < nodes.length; i++) {
      if (this.clickable(nodes[i])) {
        filteredNodes.push(nodes[i]);
      }
    }
    return filteredNodes;
  }

  clickable = (element) => {
    // TODO Is sufficient to know if it's "clickable"?
    return !this.hasBeenClicked(element) && (element.onclick || element.tagName === 'A');
  }

  hasBeenClicked = (element) => {
    return this.checkIgnored(element) || this.clickedElements.includes(element.outerHTML);
  }

  clickElement = (element) => {
    this.markClick(element);
    element.click();
    setTimeout(this.clickAllElements, 100);
  }

  checkIgnored = (element) => {
    return this.ignoredElements.includes(element.outerHTML);
  }

  markClick = (element) => {
    this.clickedElements = this.addToStorageByPage('grail-clicked-elements', this.state.grailCurrentHref, [element.outerHTML]);
  }

  markPage = (page) => {
    this.visitedPages = this.addToStorage('grail-visited-pages', page);
  }

  xhookBeforeAction = (request) => {
    this.activeRequests.push(request.url);
  }

  xhookAfterAction = (request, response) => {
    let index = this.activeRequests.indexOf(request.url);
    if (index !== -1) {
      this.activeRequests.splice(index, 1);
    }

    if (this.state.grailPaused) {
      return;
    }

    if (response.status >= 400 || response.status === 0 || response instanceof Error) {
      let error = response.statusText;

      if(!error) {
        error = response.toString();
      }
      this.recordBackendError(
        request.url,
        {
          method: request.method,
          body: request.body,
          headers: request.headers,
        },
        error
      );
    }
  }

  pause = () => {
    sessionStorage.setItem('grail-paused', true);
    this.setState({grailPaused: true});
  }

  resume = () => {
    sessionStorage.setItem('grail-paused', false);
    this.setState({
      grailPaused: false
    }, this.clickAllElements);
  }

  recordBackendError = (api, data, error) => {
    // TODO add current page where the error occured here and in results modal
    // TODO don't add duplicates
    this.addToStorageByPage(
      'grail-backend-errors',
      api,
      [{
        api: api,
        data: data,
        error: error,
        element: this.state.currentElementHtml,
        page: window.location.href,
      }],
    );
  }

  recordFrontendError = (e) => {
    // TODO don't save grail internal errors
    // TODO don't allow duplicates
    if (this.state.grailRunning) {
      this.addToStorageByPage(
        'grail-frontend-errors',
        window.location.pathname,
        [{
          stack: e.error.stack,
          message: e.message,
          filename: e.filename,
          lineno: e.lineno
        }],
      );
    }
  }

  // STORAGE FUNCTIONS

  addToStorageByPage = (key, page, values, storage=sessionStorage) => {
    let currentValue = storage.getItem(key);

    let items = {};
    if (currentValue) {
      items = JSON.parse(currentValue);
    }

    if (page in items) {
      items[page].push(...values);
    } else {
      items[page] = values;
    }
    storage.setItem(key, JSON.stringify(items));

    return items[page];
  }

  popFromStorage = (key, storage=sessionStorage) => {
    let items = JSON.parse(storage.getItem(key));

    if (items) {
      let value = items.pop();
      storage.setItem(key, JSON.stringify(items));
      return value;
    }
  }

  // Only adds unique values
  addToStorage = (key, value, storage=sessionStorage) => {
    let items = JSON.parse(storage.getItem(key)) || [];
    if (!items.includes(value)) {
      items.push(value);
      storage.setItem(key, JSON.stringify(items));
    }
    return items;
  }

  // IGNORE ELEMENTS

  /***
  * Creates listeners for click and hover
  * to detect user selection of elements.
  * @params event - Event object that holds click information
  */
  addToIgnore = (event) => {
    document.addEventListener('click', this.addSelectedElement, true);
    document.body.addEventListener('mouseover', this.highlightElement, false);
    document.body.addEventListener('mouseout', this.revertHighlight, false);
  }

  /***
  * Creates listeners for click and hover
  * to detect user selection of elements.
  * @params event - Event object that holds click information
  */
  removeFromIgnore = (event) => {
    document.addEventListener('click', this.removeSelectedElement, true);
    document.body.addEventListener('mouseover', this.highlightElement, false);
    document.body.addEventListener('mouseout', this.revertHighlight, false);
  }

  /***
  * Adds clicked element to ignore list in storage
  * @params event - Event object that holds click information
  */
  addSelectedElement = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.revertHighlight(event.target, true);
    this.ignoredElements = this.addToStorage('grail-ignored-elements', event.target.outerHTML, localStorage);
    this.removeListeners(this.addSelectedElement);
  }

  /***
  * Remove clicked element from ignore list in storage
  * @params event - Event object that holds click information
  */
  removeSelectedElement = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.revertHighlight(event.target, true);

    let ignoredElements = JSON.parse(localStorage.getItem('grail-ignored-elements'));
    let index = ignoredElements.indexOf(event.target.outerHTML);
    if (index !== -1) {
      ignoredElements.splice(index, 1);
    }
    localStorage.setItem('grail-ignored-elements', JSON.stringify(ignoredElements));
    this.ignoredElements = ignoredElements;
    this.removeListeners(this.removeSelectedElement);
  }

  /***
  * Removes the click and hover listeners
  * to restore original functionality
  */
  removeListeners = (selectFunc) => {
    document.removeEventListener('click', selectFunc, true);
    document.body.removeEventListener('mouseover', this.highlightElement, false);
    document.body.removeEventListener('mouseout', this.revertHighlight, false);
  }

  /***
  * Highlights an element by temporarily
  * creating a blue background
  * @params event - Event object that holds click information
  */
  highlightElement = (event) => {
    let element = event.target;
    this.setState({
      currentBackgroundColor: element.style.backgroundColor,
      currentStyles: element.getAttribute('style'),
    });
    element.style.backgroundColor = '#A8C5E5';

  }

  /***
  * Sets the background color of element
  * back to its original color
  * @params event - Event object that holds click information
  * @params specific - If specific, then event is target element
  */
  revertHighlight = (event, specific=false) => {
    let element = null;
    let styles = this.state.currentStyles;
    if (specific) {
      element = event;
    } else {
      element = event.fromElement;
    }

    element.style.backgroundColor = this.state.currentBackgroundColor;
    if (!styles) {
      element.removeAttribute('style');
    } else {
      element.setAttribute('style', styles);
    }
  }

  render() {
    let { modal } = this.props;
    return (
      <div id='controller' className={css(styles.grailTestController)}>
        {!this.state.grailRunning
          ? <button className={css(styles.grailTestButton)} onClick={this.startClickAll}>Click All</button>
          : <div>
              {this.state.grailPaused
                ? <button className={css(styles.grailTestButton)} onClick={this.resume}>Resume</button>
                : <button className={css(styles.grailTestButton)} onClick={this.pause}>Pause</button>
              }
            </div>
        }
        {modal.openResultsModal && <ResultsModal />}
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.addToIgnore}>Ignore Element</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.removeFromIgnore}>Remove Ignored Element</button>
      </div>
    );
  }
}

let styles = StyleSheet.create({
  grailTestController: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    padding: 15,
    background: '#000',
    color: '#fff',
    borderRadius: 5,
    cursor: 'default',
    zIndex: 9999999,
    opacity: 0.1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    ':hover': {
      opacity: 0.7
    }
  },
  grailTestButton: {
    cursor: 'pointer',
    color: '#000',
    background: '#fff',
    fontWeight: 'bold',
    borderRadius: 5,
    fontSize: 14,
    outline: 'none',
    border: '1px solid white',

    ':active': {
      color: 'gray',
    }
  },
  grailTestCheck: {
    marginLeft: 10,
  },
  grailTestCheck2: {
    marginLeft: 10,
  },
  exampleText: {
    color: 'black',
  },
  grailHover: {
    backgroundColor: 'black',
  }
})

const mapStateToProps = state => ({
  modal: state.modals,
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveControls)
