/***
 * The save + check page controls
 */

import React, { Component } from 'react';

// NPM Modules
import { css, StyleSheet } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import Niffy from 'niffy';

// Components
import CheckModal from '../modals/CheckModal';

// Config
import API from '../../config/api';
import Helpers from '../../config/helpers';
import EMPTY_CHROME_STYLES from '../../config/empty_chrome_styles';

// Redux
import { GrailActions } from '../../redux/grail';
import { ModalActions } from '../../redux/modals';

let oldFetch = window.fetch;

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
      isRecording: false,
      firstClick: true,
      fetchMade: false,
      elements: [],
      currentElement: null,
      currentHref: '',
    }

    let resume = sessionStorage.getItem('resume');
    if (resume === 'true') {
      window.fetch = this.fetch;
    }
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


  addVisited = (href) => {
    let visited = sessionStorage.getItem('visited');
    if (!visited) {
      let visitedJson = JSON.stringify([href]);
      sessionStorage.setItem('visited', visitedJson);
    } else {
      let visitedPages = JSON.parse(visited);
      visitedPages.push(href);
      let visitedJson = JSON.stringify(visitedPages);
      sessionStorage.setItem('visited', visitedJson);
    }
  }

  getNewPage = () => {
    let newPages = sessionStorage.getItem('newPages');
    if (!newPages) {
      return null;
    } else {
      let pages = JSON.parse(newPages);
      let newPage = pages.pop();
      let elementJson = JSON.stringify(pages);

      sessionStorage.setItem('newPages', elementJson);

      if (newPage === null) {
        // Need to figure out why some new pages are being saved as null
        return this.getNewPage();
      }
      return newPage;
    }
  }

  getNewPageStates = () => {
    let page = this.getNewPage();
    if (!page) {
      return null;
    }
    sessionStorage.setItem('resume', true);
    window.location.href = page;

    // On page change, some code will be executed
    let x = null;
    let y = null;
  }

  /***
   * Gets all clickable elements on the page
   */
  getAllClickableElements = () => {
    let allElements = this.getDocument().querySelectorAll(':not([class^=grailTest])');
    let filteredElements = [];

    for (let i = 0; i < allElements.length; i++) {
      let element = allElements[i];
      if (element.onclick && !this.checkClicked(element)) {
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
    });

    this.clickAllElements()
  }

  replaceCommas = (outerHTML) => {
    outerHTML.replace(new RegExp(','))
  }

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
  */
  clickElement = (element) => {
    if (!this.checkClicked(element)) {
      element.click();
      this.saveClicked(element);
    }
  }

  /***
   * Clicks all clickable elements
   */
  clickAllElements = () => {
    let elements = this.getAllClickableElements();
    let element = elements.pop();
    window.fetch = this.fetch

    if (element !== null && element !== undefined) {
      let currentHref = window.location.href;
      this.setState({
        currentHref: currentHref,
      }, () => {
        this.state.currentElement = element;
        try {
          this.clickElement(element);
          // element.click();
          this.afterClick(false);
        } catch (e) {
          console.log(e);
        }
      });
      
    } else {
      this.startNewPage();
    }
  }

  /***
   * Actions to make after a click is made
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
      let visited = sessionStorage.getItem('visited');
      if (visited) {
        let visitedPages = JSON.parse(visited);
        let index = visitedPages.indexOf(currentElement.href);
        if (index !== -1) {
          visitedPages.pop(index);
          let visitedJson = JSON.stringify(visitedPages);
          sessionStorage.setItem('visited', visitedJson)
        }
      }

      let newPages = sessionStorage.getItem('newPages');
      let hasVisited = !this.hasVisited(currentElement);
      if (!newPages && hasVisited) {
        let elementJson = JSON.stringify([currentElement.href])
        sessionStorage.setItem('newPages', elementJson);
      } else if (hasVisited) {
        let pages = JSON.parse(newPages);
        pages.push(currentElement.href);
        let elementJson = JSON.stringify(pages);
        sessionStorage.setItem('newPages', elementJson);
      }

      window.history.back();
    }
  }

  startNewPage = () => {
    this.getNewPageStates();
  }

  hasVisited = (state) => {
    let href = state.href;
    let visited = sessionStorage.getItem('visited');
    let pages = sessionStorage.getItem('newPages');

    if (!visited) {
      return false;
    }

    let visitedPages = JSON.parse(visited);
    let hasVisited = visitedPages.includes(href); 
    if (!pages) {
      return hasVisited;
    } else {
      let newPages = JSON.parse(pages);
      return hasVisited || newPages.includes(href);
    }
  }

  handleLoad = () => {
    let resume = sessionStorage.getItem('resume');
    let visited = sessionStorage.getItem('visited');
    if (resume === 'true') {
      sessionStorage.setItem('resume', false)
      if (visited) {
        let visitedPages = JSON.parse(visited);
        visitedPages.push(window.location.href);
        let visitedJson = JSON.stringify(visitedPages);
        sessionStorage.setItem('visited', visitedJson);
      }
      this.clickAllElements();
    }
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
        console.log(error);
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

  componentDidMount() {
    document.addEventListener('mousemove', this.recordMouseEvents, false);
    document.addEventListener('click', this.recordMouseEvents, false);
    let { grail } = this.props;

    if (grail.activeFetchCalls.length === 0) {
      let elements = this.getAllClickableElements();
      this.setState({
        elements,
      }, this.handleLoad)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { grail, grailActions, modalActions } = this.props;
    if (grail.activeFetchCalls.length === 0 && prevProps.grail.activeFetchCalls.length > 0) {
      let page_state = this.takeSnapshot();
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

        let resume = sessionStorage.getItem('resume');
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
    return (
      <div id='controller' className={css(styles.grailTestController)}>
        <button className={css(styles.grailTestButton)} onClick={this.clickSave}>save</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.clickCheck}>check</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.startClickAll}>click all</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.recordToggle}>
          {this.state.isRecording
            ? 'Stop'
            : 'Record'
          } 
        </button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.getPlayBack}>playback</button>
        {modal.openCheckModal && <CheckModal />}
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