/***
 * The save + check page controls
 */

import React, { Component } from 'react';

// NPM Modules
import { css, StyleSheet } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Popup from 'reactjs-popup';
import xhook from 'xhook';

// Components
import CheckModal from '../modals/CheckModal';
import ResultsModal from '../modals/ResultsModal';

// Config
import API from '../../config/api';
import Helpers from '../../config/helpers';

// Redux
import { GrailActions } from '../../redux/grail';
import { ModalActions } from '../../redux/modals';

const SKIPTAGS = {
  script: true,
  head: true,
  meta: true,
  style: true,
  title: true,
}

class SaveControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: false,
      paused: false,
      isRecording: false,
      firstClick: true,
      fetchMade: false,
      elements: [],
      currentElement: null,
      currentHref: '',
      ignoreElements: '',
      currentElementHtml:'',
      currentBackgroundColor: '',
      currentStyles: null,
    }

    let resume = sessionStorage.getItem('grail_resume');
    if (resume === 'true') {
      //window.fetch = this.fetch;
    }

    this.addToIgnore = this.addToIgnore.bind(this);
  }

  addToStorage = (key, value, storage=sessionStorage) => {
    let items = storage.getItem(key);

    if (!items) {
      let valueJson = JSON.stringify([value]);
      storage.setItem(key, valueJson);
    } else {
      let parsedItems = this.retrieveFromStorage(key, storage);
      parsedItems.push(value);
      let valueJson = JSON.stringify(parsedItems);
      storage.setItem(key, valueJson);
    }
  }

  addToStorageByPage = (key, value, page, storage=sessionStorage) => {
    let currentValue = storage.getItem(key);

    let items = {};
    if (currentValue) {
      items = JSON.parse(currentValue);
    }

    if (page in items) {
      items[page].push(value);
    } else {
      items[page] = [value];
    }
    storage.setItem(key, JSON.stringify(items));
  }

  retrieveFromStorage = (key, storage=sessionStorage) => {
    let items = storage.getItem(key);
    let parsedItems = JSON.parse(items);
    return parsedItems;
  }

  popFromStorage = (key, index=false, storage=sessionStorage) => {
    let items = this.retrieveFromStorage(key, storage);
    let poppedValue = null;

    if (items && !index) {
      // Key exists in storage
      poppedValue = items.pop();
      storage.setItem(key, JSON.stringify(items));
    } else if (items && index) {
      // Key exists in storage and index given
      poppedValue = items.pop(index);
      storage.setItem(key, JSON.stringify(items));
    }
    return poppedValue;
  }

  addVisited = (href) => {
    this.addToStorage('grail_visited', href);
  }

  getNewPage = () => {
    return this.popFromStorage('grail_newPages');
  }

  getNewPageStates = () => {
    let page = this.getNewPage();
    if (!page) {
      return false;
    }
    sessionStorage.setItem('grail_resume', true);
    window.location.href = page;

    // On page change, some code will be executed
    let x = null;
    let y = null;
    return true;
  }

  /***
   * Gets all clickable elements on the page
   */
  getAllClickableElements = () => {
    let allElements = document.querySelectorAll(':not([class^=grailTest])');
    let filteredElements = [];

    for (let i = 0; i < allElements.length; i++) {
      let element = allElements[i];
      let elementClicked = this.checkClicked(element);
      if ((element.onclick || element.tagName === 'A') && !elementClicked) {
        filteredElements.push(element);
      }
    }
    return filteredElements;
  }

  /***
   * Starting the process of clicking all
   */
  startClickAll = () => {
    let elements = this.getAllClickableElements();

    debugger;
    xhook.enable()
    xhook.before(this.xmlBeforeHook);
    xhook.after(this.xmlAfterHook);
    //window.fetch = this.fetch;

    this.setState({
      elements,
      start: true,
    }, this.clickAllElements);
  }

  /***
  * Pauses click all
  */
  pause = () => {
    this.setState({paused: true});
  }

  /***
  * Resumes click all
  */
  resume = () => {
    this.setState({paused: false});
    this.clickAllElements();
  }

  /***
   * Checked if we've clicked on the element or not or if it is ignored
   * @params element -- an HTML element
   */
  checkClicked = (element) => {
    let clickedElements = sessionStorage.getItem('clicked');

    if (this.checkIgnored(element)) {
      return true;
    }

    if (clickedElements) {
      let clickedElementsSet = new Set(clickedElements.split(','));
      let outerHTML = element.outerHTML.replace(/,/g, '_COMMA_')
      return clickedElementsSet.has(outerHTML);
    } else {
      return false;
    }
  }

  /***
  * Check if element is in user's ignore list
  * @params element -- an HTML element
  */
  checkIgnored = (element) => {
    let ignoredElements = this.retrieveFromStorage('grail_ignoreElements', localStorage);

    if(!ignoredElements) {
      return false;
    }

    return ignoredElements.includes(element.outerHTML);
  }

  /***
   * Save that we've clicked on a specific element
   * save the full outer HTML
   * @params element -- an HTML element
   */
  saveClicked = (element) => {
    let clickedElements = sessionStorage.getItem('clicked');
    let outerHTML = element.outerHTML.replace(/,/g, '_COMMA_');

    if (!clickedElements) {
      // Init clicked elements
      sessionStorage.setItem('clicked', [outerHTML]);
    } else {
      let clickedElementsSet = new Set(clickedElements.split(','));
      clickedElementsSet.add(outerHTML);
      sessionStorage.setItem('clicked', Array.from(clickedElementsSet));
    }
  }

  /***
  * Checks if an element has been
  * clicked and clicks if it is new
  * @params element -- an HTML element
  */
  clickElement = (element) => {
    if (!this.checkClicked(element)) {
      this.setState({currentElementHtml: element.outerHTML});
      this.saveClicked(element);
      element.click();
    }
  }

  /***
   * Clicks all clickable elements
   */
  clickAllElements = () => {
    let elements = this.getAllClickableElements();
    // let elements = this.state.elements;
    let element = elements.pop();
    let start = this.state.start;
    //window.fetch = this.fetch;

    if (element !== null && element !== undefined && !this.state.paused && start) {
      let currentHref = window.location.href;
      this.setState({
        currentHref: currentHref,
        currentElement: element,
      }, () => {
        try {
          this.clickElement(element);
        } catch (e) {
          console.log(e);
        }
        this.afterClick(false);
      });

    } else if (!this.state.paused) {
      this.startNewPage();
    } else {
      return;
    }
  }

  /***
   * Actions to make after a click is made
   * @params boolean fetchDone -- indicates whether the fetch has finished or not
   */
  afterClick = (fetchDone) => {
    if (!this.state.fetchMade || fetchDone) {
      let { grailActions } = this.props;
      let newHref = window.location.href;
      this.addVisited(newHref);
      this.checkNewPage(newHref);
      // Need this timeout so window.history.back can load;
      let timeout = setTimeout(this.clickAllElements.bind(this), 200);
    }
  }

  /***
   * Checks if we're on a new page or not
   */
  checkNewPage = (newHref) => {
    let currentElement = this.state.currentElement;
    let currentHref = this.state.currentHref;

    if (currentHref !== newHref) {
      let visited = this.retrieveFromStorage('grail_visited');
      if (visited) {
        let index = visited.indexOf(currentElement.href);
        if (index !== -1) {
          this.popFromStorage('grail_visited', index);
        }
      }

      let hasVisited = !this.hasVisited(currentElement);
      if (hasVisited) {
        let href = currentElement.href;
        if (href === undefined || href === null) {
          href = window.location.href;
        }
        this.addToStorage('grail_newPages', href);
      }
      window.history.back();
    }
  }

  resetGrail = () => {
    xhook.disable();
    this.setState({start: false})
  }

  startNewPage = () => {
    let { modalActions } = this.props;
    let newPageState = this.getNewPageStates();
    if (!newPageState) {
      modalActions.openResultsModal(true);
      this.resetGrail();
      return;
    }
  }

  hasVisited = (state) => {
    let href = state.href;
    let visited = this.retrieveFromStorage('grail_visited');
    let pages = this.retrieveFromStorage('grail_newPages');

    if (!visited) {
      return false;
    }

    let hasVisited = visited.includes(href);
    if (!pages) {
      return hasVisited;
    } else {
      return hasVisited || pages.includes(href);
    }
  }

  handleLoad = () => {
    let resume = sessionStorage.getItem('grail_resume');

    if (resume === 'true') {
      sessionStorage.setItem('grail_resume', false)
      this.addToStorage('grail_visited', window.location.href);
      this.clickAllElements();
    }
  }

  saveError = (api, data, error) => {
    this.addToStorageByPage('grail_backend_errors', {
      api: api,
      data: data,
      error: error,
      element: this.state.currentElementHtml,
      page: window.location.href,
    },
    api
    );
  }

  /***
  * Starts fetch timer when a request is made
  * @params request - Unused request object
  */
  xmlBeforeHook = (request) => {
    if (this.state.start) {
      let { grailActions } = this.props;
      let api = request.url;
      grailActions.beforeFetch(api);
    }
  }

  /***
  * Checks for errors and if all fetches are finished
  * @params request - Request object
  * @params response - Response object
  */
  xmlAfterHook = (request, response) => {
    let { grailActions } = this.props;
    if (this.state.start) {
      let api = request.url;
      let body = request.body;
      let method = request.method;
      let data = {
        method: request.method,
        body: request.body,
        headers: request.headers,
      }

      let event = {
        endpoint: api,
        request_input: body ? body : null,
        request_type: method,
        request_output: response,
      }

      if (response.status >= 400 || response.status === 0 || response instanceof Error) {
        let error = response.statusText;

        if(!error) {
          error = Response.toString();
        }
        this.saveError(api, data, error);
      }

      setTimeout(() => {
        grailActions.fetchFinished(api);
      }, 200)
    }
  }

  /***
   * Records the frontend error and saves it to sessionStorage
   * @params error e -- the error object
   */
  recordFrontendError = (e) => {
    this.addToStorageByPage('grail-frontend-errors', {
      stack: e.error.stack,
      message: e.message,
      filename: e.filename,
      lineno: e.lineno
    },
    window.location.pathname
    );
  }

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
    this.addToStorage('grail_ignoreElements', event.target.outerHTML, localStorage);
    this.removeListeners(this.addSelectedElement);
  }

  /***
  * Remove clicked element from ignore list in storage
  * @params event - Event object that holds click information
  */
  removeSelectedElement = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let ignoredElements = this.retrieveFromStorage('grail_ignoreElements', localStorage);

    this.revertHighlight(event.target, true);
    let index = ignoredElements.indexOf(event.target.outerHTML);
    this.popFromStorage('grail_ignoreElements', index, localStorage);
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

  componentDidMount() {
    window.addEventListener('error', this.recordFrontendError, false);
    let { grail } = this.props;

    let resume = sessionStorage.getItem('grail_resume');
    if (grail.activeFetchCalls.length === 0 && resume === 'true') {
      let elements = this.getAllClickableElements();
      this.setState({
        elements,
      }, this.handleLoad)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { grail, grailActions, modalActions } = this.props;
    if (grail.activeFetchCalls.length === 0 && prevProps.grail.activeFetchCalls.length > 0) {
      if (grail.recording) {
        grailActions.addEventToList();
      } else {
        if (grail.playback.length > 0) {
          grailActions.checkHTML({
            cur_html: page_state.html,
            cur_css: page_state.css,
            page_state_id: grail.playback[0].id
          });
        }

        let resume = sessionStorage.getItem('grail_resume');
        if (resume === 'true') {
          let elements = this.getAllClickableElements();
          this.setState({
            elements,
          }, this.handleLoad)
        } else {
          this.afterClick(true);
        }
      }
    }

    if (grail.playback.length < prevProps.grail.playback.length && grail.playback.length !== 0) {
      let element = grail.playback[0];
      this.playback(element);
    }

    if (grail.playback.length === 0 && prevProps.grail.playback.length > 0) {
      grailActions.checkPlayback(grail.checkStates);
      modalActions.openCheckModal(true);
    }
  }

  render() {
    let { modal } = this.props;
    let start = this.state.start;
    let paused = this.state.paused;

    return (
      <div id='controller' className={css(styles.grailTestController)}>
        {!start
          ? <button className={css(styles.grailTestButton)} onClick={this.startClickAll}>Click All</button>
          : <div>
              {paused
                ? <button className={css(styles.grailTestButton)} onClick={this.resume}>Resume</button>
                : <button className={css(styles.grailTestButton)} onClick={this.pause}>Pause</button>
              }
            </div>
        }
        {modal.openCheckModal && <CheckModal />}
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
  grail: state.grail,
  modal: state.modals,
})

const mapDispatchToProps = (dispatch) => ({
  grailActions: bindActionCreators(GrailActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveControls)
