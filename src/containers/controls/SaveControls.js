/***
 * The save + check page controls
 */

import React, { Component } from 'react';

// NPM Modules
import { css, StyleSheet } from 'aphrodite';
// import Niffy from 'niffy';

// Config
import API from '../../config/api';
import Helpers from '../../config/helpers';
import EMPTY_CHROME_STYLES from '../../config/empty_chrome_styles';

class SaveControls extends Component {

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
  getAllElems () {
    let all = this.getDocumentHtml().getElementsByTagName("*");
    var elems = [];
    for(let i = 0; i < all.length; i++) {
      if(all[i].id !== '' && all[i].tagName.toLowerCase() !== 'script') {
        elems.push(all[i]);
      }
    }
    return elems;
  }

  getAllStyles() {
    let all = this.getAllElems();
    var elems = [];
    for(let i = 0; i < all.length; i++) {
      let style = {element_id: all[i].id, html: all[i].outerHTML.replace(all[i].innerHTML, ''), css_attributes:{}};
      // Computed CSS Properties
      let styles = this.getWindow().getComputedStyle(all[i]);
      for(let j = 0; j < styles.length; j++) {
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

  getCSSElements(element) {

  }

  getHTMLElements(collection, tempId) {
    if (collection.length == 0) {
      return null;
    }
    let index = 0;
    let elements = {};
    for (let child of collection) {
      let innerHtml = child.innerHTML;
      let outerHtml = child.outerHTML;
      let element = outerHtml.replace(innerHtml, '');

      if (!child.hasChildNodes()) {
        let dict = {}
        dict['html'] = element;
        dict['element_id'] = child.id ? child.id : tempId;
        // dict['bounding'] = child.getBoundingClientRect();
        dict['css_attributes'] = child.getBoundingClientRect();
        dict['children'] = null;
        elements[index] = dict;
        tempId = tempId + 1;
      } else {
        let dict = {}
        dict['html'] = element;
        dict['element_id'] = child.id ? child.id : tempId;
        // dict['bounding'] = child.getBoundingClientRect();
        dict['css_attributes'] = child.getBoundingClientRect();
        dict['children'] = this.getHTMLElements(child.children, tempId + 1);
        elements[index] = dict;
        tempId = tempId + 1;
      }
      index = index + 1;
    }
    return elements;
  }

  clickSave = (e) => {
    // temp
    var type = 1; // 0 for original, 1 for new, 2 for niffy
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);

    let page_state = '';
    let api = '';
    if (type === 0) {
      page_state = this.getPageState(); 
      page_state['active'] = true;
      api = API.SAVE_PAGE_STATE;
    } else if (type === 1) {
      api = API.SAVE_PAGE_STATE2;
      page_state = this.getAllElements();
      page_state['active'] = true;
    } else if (type === 2) {
      api = API.SAVE_PAGE_STATE3;
      page_state = this.getDocumentHtml().outerHTML;
    } else {
      alert("error");
    }

    return fetch(api, API.POST_CONFIG({page_state: page_state}))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(json => {
      console.log(json);
    });
  }

  clickCheck = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);
    
    let type = 1;
    let page_state = null;
    let api = '';

    if (type === 0) {
      page_state = this.getPageState();
      api = API.DIFF_PAGE_STATE;

    } else if (type === 1) {
      page_state = this.getAllElements();
      page_state['active'] = true;
      api = API.DIFF_PAGE_STATE2;
    } else {
      alert("error");
    }

    let config = API.POST_CONFIG({page_state: page_state});
    return fetch(api, config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(json => {
      console.log(json);
    });
  }

  clickOpenOld = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);

    let new_html = this.getDocumentHtml().outerHTML;
    let res = fetch(API.NIFFY, API.POST_CONFIG({page_state: new_html}))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(json => {
      console.log(json);
      // let niffy = new Niffy();
    });
  }

  render() {
    return (
      <div className={css(styles.grailTestController)}>
        <button className={css(styles.grailTestButton)} onClick={this.clickSave}>save</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)} onClick={this.clickCheck}>check</button>
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
    border: '1px solid white',
  },
  grailTestCheck: {
    marginLeft: 10,
  },
  grailTestCheck2: {
    marginLeft: 10,
  },
})

export default SaveControls;