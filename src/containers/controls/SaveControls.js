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
import EMPTY_CHROME_STYLES from '../../config/empty_chrome_styles';

// Redux
import { GrailActions } from '../../redux/grail';
import { ModalActions } from '../../redux/modals';

let oldFetch = window.fetch;
xhook.enable();
// let oldSend = window.XMLHttpRequest.prototype.send;
// window.XMLHttpRequest.oldSend = oldSend;

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
      isRecording: false,
      firstClick: true,
      fetchMade: false,
      elements: [],
      currentElement: null,
      currentHref: '',
      ignoreElements: '',
      currentElementHtml:'',
    }

    let resume = sessionStorage.getItem('grail_resume');
    if (resume === 'true') {
      window.fetch = this.fetch;
    }

    this.addToIgnore = this.addToIgnore.bind(this);
    this.editIgnore = this.editIgnore.bind(this);
  }

  getWindow() {
    return window;
  }

  getPageName() {
    return this.getWindow().location.href;
  }

  getDocument() {
    return this.getWindow().document;
  }

  getDocumentHtml() {
    return this.getDocument().documentElement;
  }

  getPageState() {
    return {
      page_name: this.getPageName(),
      page_width: this.getWindow().innerWidth,
      html_elements_attributes: this.getAllStyles(),
    };
  }

  // Filters: has id, not script
  getAllElems (filterById) {
    let all = this.getDocumentHtml().getElementsByTagName("*");
    var elems = [];
    for(let i = 0; i < all.length; i++) {
      if(!SKIPTAGS[all[i].tagName.toLowerCase()]) {
        if (filterById) {
          if (all[i].id !== '') {
            elems.push(all[i]);
          }
        } else {
          elems.push(all[i]);
        }
      }
    }
    return elems;
  }

  getAllStyles() {
    let all = this.getAllElems(true);
    var elems = [];
    for(let i = 0; i < all.length; i++) {
      let style = {element_id: all[i].id, html: all[i].outerHTML.replace(all[i].innerHTML, ''), css_attributes:{}};
      // Computed CSS Properties
      let styles = this.getWindow().getComputedStyle(all[i]);
      for (let j = 0; j < styles.length; j++) {
        let value = styles.getPropertyValue(styles[j]);
        // Don't include default styles to reduce size of styles
        if(EMPTY_CHROME_STYLES[styles[j]] !== value) {
          style['css_attributes'][styles[j]] = value;
        }
      }
      // Computed Postion of Element
      let boundingRect = all[i].getBoundingClientRect();
      for (let attrname in boundingRect) {
        if (!isNaN(boundingRect[attrname])) {
          style['css_attributes']['bounding_' + attrname] = boundingRect[attrname];
        }
      }
      // Text of Element
      if (all[i].childNodes.length > 0) {
        style['css_attributes']['text'] = all[i].childNodes[0].nodeValue;
      }
      elems.push(style);
    }
    return elems;
  }

  getAllElements() {
    var body = this.getDocumentHtml().getElementsByTagName("body");
    let elements = this.getHTMLElements(body, {id: 0});
    return {'body': elements};
  }

  getHTMLElements(collection, tempId) {
    if (collection.length == 0) {
      return null;
    }
    let elements = {};
    for (let child of collection) {
      if (child.id !== 'wrapper') {
        if (!child.id) {
          child.setAttribute('grail-order', tempId.id);
        } else {
          tempId.id = tempId.id - 1;
        }
        if (!child.hasChildNodes()) {
          tempId.id = tempId.id + 1;
        } else {
          tempId.id = tempId.id + 1;
          this.getHTMLElements(child.children, tempId);
        }
      }
    }
    return elements;
  }

  getAll() {
    let all = this.getAllElements();
    let body = this.getDocumentHtml().getElementsByTagName('body');
    let html = body[0].outerHTML;
    let res = {}
    let css = this.getCSS(body, 0, res);
    return { html: html, css:css };
  }

  getCSS(collection, tempId, result) {
    if (collection.length === 0) {
      return null;
    }

    for (let child of collection) {
      let css = {}
      let id = child.id ? child.id : child.getAttribute('grail-order')
      let rect = this.filter(child.getBoundingClientRect());

      // Computed CSS Properties
      let styles = this.getWindow().getComputedStyle(child);
      for(let j = 0; j < styles.length; j++) {
        let value = styles.getPropertyValue(styles[j]);
        // Don't include default styles to reduce size of styles
        if(EMPTY_CHROME_STYLES[styles[j]] !== value) {
          rect[styles[j]] = value;
        }
      }

      if (!child.hasChildNodes()) {
        result[id] = rect;
        tempId = tempId + 1;
      } else {
        result[id] = rect;
        result = {...result, ...this.getCSS(child.children, tempId + 1, result)};
        tempId = tempId + 1;
      }
    }
    return result
  }

  filter(rect) {
    let dict = {};
    dict['x'] = rect.x;
    dict['y'] = rect.y;
    return dict;
  }

  compare(json) {
    let html = json['html'];
    let css = json['css'];
    let new_state = this.getAll();
    console.log(new_state['html'] === html);
    console.log(new_state);
  }

  clickSave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);

    let api = API.SAVE_PAGE_STATE;
    let page_state = this.getAll();

    return fetch(api, API.POST_CONFIG({page_state: page_state}))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(json => {
      console.log(json);
    });
  }

  stringify = (value) => {
    let stringifiedValue = JSON.stringify(value);
    return stringifiedValue;
  }

  addToStorage = (key, value) => {
    let items = sessionStorage.getItem(key);

    if (!items) {
      let valueJson = this.stringify([value]);
      sessionStorage.setItem(key, valueJson);
    } else {
      let parsedItems = this.retrieveFromStorage(key);
      parsedItems.push(value);
      let valueJson = this.stringify(parsedItems);
      sessionStorage.setItem(key, valueJson);
    }
  }

  retrieveFromStorage = (key) => {
    let items = sessionStorage.getItem(key);
    let parsedItems = JSON.parse(items);
    return parsedItems;
  }

  popFromStorage = (key, index=false) => {
    let items = this.retrieveFromStorage(key);
    let poppedValue = null;

    if (items && !index) {
      // Key exists in storage
      poppedValue = items.pop();
      sessionStorage.setItem(key, this.stringify(items));
    } else if (items && index) {
      // Key exists in storage and index given
      poppedValue = items.pop(index);
      sessionStorage.setItem(key, this.stringify(items));
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
    let allElements = this.getDocument().querySelectorAll(':not([class^=grailTest])');
    let filteredElements = [];

    for (let i = 0; i < allElements.length; i++) {
      let element = allElements[i];
      let elementClicked = this.checkClicked(element);
      let elementIgnored = this.checkIgnored(element);
      if ((element.onclick || element.tagName === 'A') && !elementClicked && !elementIgnored) {
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
    this.setState({
      elements,
      start: true,
    }, this.clickAllElements);
  }

  /***
   * Checked if we've clicked on the element or not
   * @params element -- an HTML element
   */
  checkClicked = (element) => {
    let clickedElements = sessionStorage.getItem('clicked');

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
    // [Attr = value],[attr=value]
    let ignoredElements = this.retrieveFromStorage('grail_ignoreElements');

    if (!ignoredElements) {
      return false;
    }
    for (let i = 0; i < ignoredElements.length; i++) {
      let query = ignoredElements[i][0];
      let queriedElements = []
      try {
        queriedElements = this.getDocument().querySelectorAll(query);
      } catch (error) {
        // console.log(error);
        console.log('invalid query');
      }

      if (Array.from(queriedElements).includes(element)) {
        return true;
      }
    }
    return false;
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
    window.fetch = this.fetch;

    if (element !== null && element !== undefined) {
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

    } else {
      this.startNewPage();
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

  startNewPage = () => {
    let { modalActions } = this.props;
    let newPageState = this.getNewPageStates();
    if (!newPageState) {
      console.log("finished cycle");
      modalActions.openResultsModal(true);
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
    this.addToStorage('grail_backend_errors', {
      api: api, 
      data:data, 
      error: error, 
      element: this.state.currentElementHtml,
      page: window.location.href,
    });
  }

  takeSnapshot = () => {
    let { grailActions, grail } = this.props;
    window.scrollTo(0,0);

    let page_state = this.getAll();
    if (grail.recording) {
      grailActions.recordEvent({
        snapshot: page_state
      });
    }

    return page_state;
  }

  editIgnore = (event) => {
    this.setState({ignoreElements: event.target.value});
  }

  addToIgnore = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(this.state.ignoreElements);
    this.addToStorage('grail_ignoreElements', [this.state.ignoreElements]);
    this.setState({ignoreElements: ''});
  }

  getPlayBack = async () => {
    let { grail, grailActions } = this.props;
    window.fetch = this.fetch
    window.scrollTo(0,0);

    let api = API;
    this.takeSnapshot();
    let states = await grailActions.playback();

    let first = states.playback[0];
    this.playback(first);
  }

  /***
   * Plays back a specific state of the app
   */
  playback = (pageState) => {
    let { grailActions } = this.props;
    let id = pageState.action_params.id;
    let element;
    let cur_html = this.getAllElements();
    if (id) {
      element = document.getElementById(id);
    } else {
      let order = pageState.action_params.order;
      element = document.querySelectorAll(`[grail-order="${order}"]`)[0];
    }

    switch(pageState.action_name) {
      case 'click':
        element.click()
        this.snapshotTimeout = setTimeout(() => {
          let page_state = this.takeSnapshot();
          grailActions.checkHTML({
            cur_html: page_state.html,
            cur_css: page_state.css,
            page_state_id: pageState.id,
          });
        }, 500);
        break;
      default:
        console.log('no action');
    }
  }

  clickCheck = (e) => {
    let { grailActions, modalActions } = this.props;
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);

    let page_state = this.getAll();
    let api = API.DIFF_PAGE_STATE;
    let isGrail = true;

    grailActions.checkPage(api, page_state, isGrail);
    modalActions.openCheckModal(true);
  }

  checkReady = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);

    let res = fetch(API.CHECK_READY, API.POST_CONFIG({test: null}))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(json => {
      console.log(json);
      console.log(this.getDocument().readyState)
    });
  }

  recordToggle = () => {
    let { grail, grailActions } = this.props;
    window.fetch = this.fetch
    grailActions.toggleRecord();
    if (this.state.isRecording && grail.recordedSession.length > 0) {
      grailActions.saveEvent()
    } else if(!this.state.isRecording) {
      this.takeSnapshot()
    }
    this.setState({
      isRecording: !this.state.isRecording,
    })
  }

  fetch = async (api, data, isGrail=false) => {
    let { grailActions } = this.props;
    clearTimeout(this.snapshotTimeout);
    this.setState({
      fetchMade: true,
    })
    if (isGrail) {
      return oldFetch(api, data)
    } else {
      grailActions.beforeFetch(api);
      let response = null;
      let resClone = null;
      let res = null;
      try {
        response = await oldFetch(api, data)
        resClone = response.clone()
        res = await Helpers.parseJSON(resClone)

      } catch (error) {
        this.saveError(api, data, error.toString());
      }
      let event = {
        endpoint: api,
        request_input: data.body ? data.body : null,
        request_type: data.method,
        request_output: res ? res : null,
      }
      await grailActions.recordEvent(event);
      this.setState({
        fetchMade: false,
      })

      // The timeout for fetch being done is here so the element can render properly
      setTimeout(() => {
        grailActions.fetchFinished(api);
      }, 200)

      return response;
    }
  }

  xmlBeforeHook = (request) => {
    if (this.state.start) {
      let { grailActions } = this.props;
      let api = request.url;
      grailActions.beforeFetch(api);
    }
  }

  xmlAfterHook = (request, response) => {
    let { grailActions } = this.props;
    if (this.state.start) {
      let api = request.url;
      let body = request.body;
      let method = request.method;

      let event = {
        endpoint: api,
        request_input: body ? body : null,
        request_type: method,
        request_output: response,
      }

      setTimeout(() => {
        grailActions.fetchFinished(api);
      }, 200)
    }
  }

  send = (data, isGrail=false) => {
    let scThis = this;
    let { grailActions } = scThis.props;
    let api = 'xml';
    let type = null; // How to get request type?

    if (isGrail) {
      try {
        this.oldSend(data);
      } catch (error) {
        console.log('Using wrong this');
      }
    } else {
      grailActions.beforeFetch(api);
      try {
        this.oldsend(data)
      } catch (error) {
        api = this.responseUrl;
        this.saveError(api, data, error.toString());
      }
      let event = {
        endpoint: api,
        request_input: data ? data : null,
        request_type: type,
        request_output: null,
      }
      grailActions.recordEvent(event);
      this.setState({
        fetchMade: false,
      })

      // The timeout for fetch being done is here so the element can render properly
      setTimeout(() => {
        grailActions.fetchFinished(api);
      }, 200)

      return;
    }
  }

  recordMouseEvents = async (e) => {
    let { grailActions } = this.props;
    if (this.state.isRecording && !this.state.firstClick) {
      if (e.type === 'click') {
        let element = e.path[0]
        if (element instanceof SVGElement) {
          element = e.path[1]
        }

        let clickElement = element;
        for (let i = 0; i < e.path.length; i++) {
          if (e.path[i].onclick) {
            clickElement = e.path[i];
          }
        }

        let event = {
          page_name: window.location.href,
          action_name: 'click',
          action_params: {
            id: element.id !== "" ? element.id : null,
            order: element.attributes['grail-order'] ? element.attributes['grail-order'].value : null,
            outerHTML: element.outerHTML,
            clickHTML: clickElement.outerHTML,
          },
        }

        await grailActions.recordEvent(event)
        if (!this.state.fetchMade) {
          this.snapshotTimeout = setTimeout(async () => {
            this.takeSnapshot();
            grailActions.addEventToList();
          }, 500);
        }

        this.setState({
          fetchMade: false,
        })

        //console.log(`Click event occured at (x: ${e.clientX} y: ${e.clientY})`)
      } else if (e.type === 'mousemove') {
        //console.log(`Current Mouse Position: (x: ${e.clientX} y: ${e.clientY})`)
      }
    } else if (this.state.isRecording && this.state.firstClick) {
      this.setState({
        firstClick: false,
      })
    } else {
      this.setState({
        firstClick: true,
      })
    }
  }

  fetchListener = (event) => {
    event.respondWith(
      new Response("Response body", { headers: { "Content-Type" : "text/plain" }})
    )
  }

  /***
   * Records the frontend error and saves it to sessionStorage
   * @params error e -- the error object
   */
  recordFrontendError = (e) => {
    let currentErrors = sessionStorage.getItem('grail-frontend-errors');
    let currentError = {stack: e.error.stack, message: e.message, filename: e.filename, lineno: e.lineno};
    let currentHref = window.location.pathname
    let errors = {}
    if (currentErrors) {
      errors = JSON.parse(currentErrors);
      if (currentHref in errors) {
        errors[currentHref] = [...errors[currentHref], currentError];
      } else {
        errors[currentHref] = [currentError];
      }
    } else {
      errors[currentHref] = [currentError];
    }
    sessionStorage.setItem('grail-frontend-errors', JSON.stringify(errors))
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

    xhook.before(this.xmlBeforeHook);
    xhook.after(this.xmlAfterHook);
    window.fetch = this.fetch;
  }

  componentDidUpdate(prevProps, prevState) {
    let { grail, grailActions, modalActions } = this.props;
    if (grail.activeFetchCalls.length === 0 && prevProps.grail.activeFetchCalls.length > 0) {
      if (grail.recording) {
        let page_state = this.takeSnapshot();
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
    let ignoreElements = this.retrieveFromStorage('grail_ignoreElements');

    return (
      <div id='controller' className={css(styles.grailTestController)}>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.startClickAll}>Click All</button>
        {modal.openCheckModal && <CheckModal />}
        {modal.openResultsModal && <ResultsModal />}
        <Popup trigger={
          <button className={css(styles.grailTestButton, styles.grailTestCheck)}>Ignore Element</button>}
          modal
          closeOnDocumentClick
        >
        {close => (
        <div>
          <form onSubmit={this.addToIgnore}>
            <p className={css(styles.exampleText)}>
              Instructions: Submit each element that you want to ignore. Use a comma to separate element attributes
              and values.
            </p>
            <span className={css(styles.exampleText)}> Ex. Format: [attribute=value], [attribute=value], ... </span>
            <input type='text' onChange={this.editIgnore}/>
            <input type='submit'/>
            <p className={css(styles.exampleText)}>
              Current Ignored Elements:
            </p>
            <div className={css(styles.exampleText)}>
              {ignoreElements
              ? ignoreElements.toString()
              : null  }
            </div>
          </form>
          <button onClick={() => {close()}}>close</button>
        </div>
        )}
        </Popup>
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
  },
  grailTestCheck: {
    marginLeft: 10,
  },
  grailTestCheck2: {
    marginLeft: 10,
  },
  exampleText: {
    color: 'black',
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
