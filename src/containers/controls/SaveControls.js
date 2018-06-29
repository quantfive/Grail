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
  constructor() {
    super();
    this.state = {
      isRecording: false,
      firstClick: true,
      fetchMade: false,
      elements: this.getAllClickableElements(),
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

  clickAll = (page, recursive=false) => {
    // Might have issues with elements that redirect to a new page
    // TODO: Implement some sort of history to go back to previous page and continue clicking from there
    // a, b->c->d, e->f, g
    let children = page.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child.id !== 'wrapper') {
        try {
          child.click();
          if (recursive) {
            this.clickAll(child, true);
          }
        } catch(error) {
          console.log(error);
          console.log("element can't be clicked");
        }
      } else {
        console.log(child);
      }
    }
  }

  addChildrenStates = (state) => {
    let { grailActions } = this.props;
    let children = state.children;

    if (grailActions.isNewState().newPageState) {
      children = this.getDocumentHtml().children;
    }

    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      grailActions.saveState(child);
    }

    let timeout = setTimeout(() => { 
      this.clickAll2();
    }, 200);
  }

  afterClick = (state, currentHref, fetchDone, elements) => {
    if (!this.state.fetchMade || fetchDone) {
      let { grailActions } = this.props;
      let newHref = window.location.href;
      // grailActions.addClicked(state);
      this.addVisited(newHref, state);
      // this.addChildrenStates(state);
      this.checkNewPage(currentHref, newHref, state);
      this.clickAll3(elements);
    }
  }

  addVisited = (href, state) => {
    let visited = sessionStorage.getItem('visited');
    if (!visited) {
      sessionStorage.setItem('visited', [href]);
    } else {
      let visitedPages = visited.split(',');
      visitedPages.push(href);
      sessionStorage.setItem('visited', visitedPages);
    }
  }

  getNewPage = () => {
    let newPages = sessionStorage.getItem('newPages');
    if (!newPages) {
      return null;
    } else {
      let pages = newPages.split(',');
      let newPage = pages.pop();
      sessionStorage.setItem('newPages', pages);
      if (!newPage) {
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

    let x = null;
    let y = null;
  }

  getNextState = () => {
    let { grailActions } = this.props;
    let clickedStates = grailActions.getClicked().clickedStates;
    let state = null;

    state = grailActions.getAvailableStates().currentState;
    
    while (state && state.id === 'wrapper') {
      state = grailActions.getAvailableStates().currentState;
    }

    if ((state === null || state === undefined)) {
      state = this.getNewPageStates();
    } 

    return state;
  }

  clickAll2 = () => {
    let { grailActions } = this.props;
    window.fetch = this.fetch
    let state = this.getNextState();

    if (state && state.onclick) {
      let currentHref = window.location.href;
      grailActions.setHref(currentHref);
      try {
        state.click();
        let timeout = setTimeout(this.afterClick.bind(this, state, currentHref), 10);
      } catch (e) {
        alert(e);
        // let timeout = setTimeout(this.afterClick.bind(this, state, currentHref), 200);
      }
    } else {
      if (state) {
        this.addChildrenStates(state);
      }
    }
  }

  getAllClickableElements = () => {
    let allElements = this.getDocument().querySelectorAll(':not([class^=grailTest])');
    let filteredElements = [];

    for (let i = 0; i < allElements.length; i++) {
      let element = allElements[i];
      if (element.onclick && element.onclick !== undefined && element) {
        filteredElements.push(element);
      }
    }
    return filteredElements;
  }

  clickAll3 = () => {
    let elements = this.state.elements;
    let element = elements.pop()

    if (element !== null && element !== undefined) {
      let currentHref = window.location.href;
      try {
        element.click();
        this.afterClick2(element, currentHref);
      } catch (e) {
        alert(e);
      }
    } else {
      this.startNewPage();
    }
  }

  afterClick2 = (state, currentHref, fetchDone) => {
    if (!this.state.fetchMade || fetchDone) {
      let { grailActions } = this.props;
      let newHref = window.location.href;
      this.addVisited(newHref, state);
      this.checkNewPage2(currentHref, newHref, state);

      // Need this timeout so window.history.back can load;
      let timeout = setTimeout(this.clickAll3.bind(this), 100);
    }
  }

  checkNewPage2 = (currentHref, newHref, state) => {
    if (currentHref !== newHref) {
      let visited = sessionStorage.getItem('visited');
      if (visited) {
        let visitedPages = visited.split(',');
        let index = visitedPages.indexOf(state.href);
        if (index !== -1) {
          visitedPages.pop(index);
          sessionStorage.setItem('visited', visitedPages)
        }
      }

      let newPages = sessionStorage.getItem('newPages');
      let hasVisited = !this.hasVisited(state);
      if (!newPages && hasVisited) {
        sessionStorage.setItem('newPages', [state.href]);
      } else if (hasVisited) {
        let pages = newPages.split(',');
        pages.push(state.href);
        sessionStorage.setItem('newPages', pages);
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

    let visitedPages = visited.split(',');
    let hasVisited = visitedPages.includes(href); 
    if (!pages) {
      return hasVisited;
    } else {
      let newPages = pages.split(',');
      return hasVisited || newPages.includes(href);
    }
  }

  checkNewPage = (currHref, newHref, state) => {
    let { grailActions } = this.props;
    // let newState = grailActions.isNewState().newPageState;
    let newState = false;

    if (currHref !== newHref) {
      if (!newState) {
        let visited = sessionStorage.getItem('visited');
        if (visited) {
          let visitedPages = visited.split(',');
          let index = visitedPages.indexOf(state.href);
          if (index !== -1) {
            visitedPages.pop(index);
            sessionStorage.setItem('visited', visitedPages)
          }
        }

        let newPages = sessionStorage.getItem('newPages');
        let hasVisited = !this.hasVisited(state);
        if (!newPages && hasVisited) {
          sessionStorage.setItem('newPages', [state.href]);
        } else if (hasVisited) {
          let pages = newPages.split(',');
          pages.push(state.href);
          sessionStorage.setItem('newPages', pages);
        }

        window.history.back();
      } else {
        grailActions.toggleNewState(false);
      }
    }
  }

  handleLoad = () => {
    console.log('page has loaded');
    console.log(sessionStorage);
    let resume = sessionStorage.getItem('resume');
    let visited = sessionStorage.getItem('visited');
    if (resume === 'true') {
      sessionStorage.setItem('resume', false)
      if (visited) {
        let visitedPages = visited.split(',');
        visitedPages.push(window.location.href);
        sessionStorage.setItem('visited', visitedPages);
      }
      // debugger;
      // this.clickAll();
      // this.state.elements = this.getAllClickableElements();
      this.clickAll3();
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
      let clonse = null;
      let res = null;
      try {
        response = await oldFetch(api, data)
        clone = response.clone()
        res = await Helpers.parseJSON(clone)
        
      } catch (error) {

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

      // Why is there a timeout on this fetch finished?
      setTimeout(() => {
        grailActions.fetchFinished(api);
      }, 500)

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
    console.log('fetch');
    event.respondWith(
      new Response("Response body", { headers: { "Content-Type" : "text/plain" }})
    )
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.recordMouseEvents, false);
    document.addEventListener('click', this.recordMouseEvents, false);
    document.addEventListener('DOMContentLoaded', this.handleLoad, true);
    this.handleLoad();
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

        if (grail.currentState) {
          // this.afterClick(grail.currentState, grail.currentHref, true);
          this.afterClick2(grail.currentState, grail.currentHref, true);
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
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={() => this.clickAll3(this.getAllClickableElements())}>click all</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.checkReady}>complete</button>
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