/***
 * The save + check page controls
 */

import React, { Component } from 'react';

// NPM Modules
import { css, StyleSheet } from 'aphrodite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import Niffy from 'niffy';

// Config
import API from '../../config/api';
import Helpers from '../../config/helpers';
import EMPTY_CHROME_STYLES from '../../config/empty_chrome_styles';

// Redux
import { GrailActions } from '../../redux/grail';
import { ModalActions } from '../../redux/modals';

var oldFetch = fetch;

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
    let elements = this.getHTMLElements(body, 0);
    return {'body': elements};
  }

  getHTMLElements(collection, tempId) {
    if (collection.length == 0) {
      return null;
    }
    // let index = 0;
    let elements = {};
    for (let child of collection) {
      if (!child.id) {
        child.setAttribute('order', tempId);
      }
      if (!child.hasChildNodes()) {
        tempId = tempId + 1;
      } else {
        this.getHTMLElements(child.children, tempId + 1);
        tempId = tempId + 1;
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
      let id = child.id ? child.id : child.getAttribute('order')
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

  clickCheck = (e) => {
    let { grailActions, modalActions } = this.props;
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);

    let page_state = this.getAll();
    let api = API.DIFF_PAGE_STATE;
  
    grailActions.checkPage(api, page_state);
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
    fetch = this.fetch

    this.setState({
      isRecording: !this.state.isRecording,
    })
  }

  fetch = async (api, data) => {
    let { grailActions } = this.props;

    clearTimeout(this.snapshotTimeout);
    grailActions.beforeFetch(api);
    let response = await oldFetch(api, data)
    let clone = response.clone()
    let res = await Helpers.parseJSON(clone)
    grailActions.fetchFinished(api);

    let event = {
      endpoint: api,
      request_input: data.body ? data.body : null,
      request_type: data.method,
      request_output: res ? res : null,
    }

    grailActions.recordEvent(event)

    return response;
  }

  recordMouseEvents = (e) => {
    let { grailActions } = this.props;
    if (this.state.isRecording && !this.state.firstClick) {
      if (e.type === 'click') {
        let event = {
          page_name: window.location.href,
          action_name: 'click',
          action_params: e,
        }

        this.snapshotTimeout = setTimeout(() => {
          // Craig, put the snapshot event & send to backend here
          this.snapshot();
        }, 500);

        grailActions.recordEvent(event)
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

  componentDidMount() {
    document.addEventListener('mousemove', this.recordMouseEvents, false);
    document.addEventListener('click', this.recordMouseEvents, false)
  }

  componentDidUpdate(prevProps, prevState) {
    let { grail } = this.props;

    if (grail.activeFetchCalls.length === 0 && prevProps.grail.activeFetchCalls.length > 0) {
      // Take a snapshot here
    }
  }

  render() {
    return (
      <div id='controller' className={css(styles.grailTestController)}>
        <button className={css(styles.grailTestButton)} onClick={this.clickSave}>save</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.clickCheck}>check</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.checkReady}> complete </button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.recordToggle}>
          {this.state.isRecording
            ? 'Stop'
            : 'Record'
          } 
        </button>
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
})

const mapDispatchToProps = (dispatch) => ({
  grailActions: bindActionCreators(GrailActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveControls)