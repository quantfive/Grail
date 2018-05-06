/***
 * The save + check page controls
 */

import React, { Component } from 'react';

// NPM Modules
import { css, StyleSheet } from 'aphrodite';

// Config
import API from '../../config/api';
import Helpers from '../../config/helpers';

class SaveControls extends Component {

  clickSave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);
    let page_state = this.getPageState();
    page_state['active'] = true;

    return fetch(API.SAVE_PAGE_STATE, API.POST_CONFIG({page_state: page_state}))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(json => {
      console.log(json);
      debugger
    });
  }

  clickCheck = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.scrollTo(0,0);
    let page_state = this.getPageState();

    let config = API.POST_CONFIG({page_state: page_state});
    return fetch(API.DIFF_PAGE_STATE, config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(json => {
      console.log(json);
      debugger
    });
  }

  render() {
    return (
      <div className={css(styles.grailTestController)}>
        <button className={css(styles.grailTestButton)}>save</button>
        <button className={css(styles.grailTestButton, styles.grailTestCheck)}>check</button>
      </div>
    );
  }
}

let styles = StyleSheet.create({
  grailTestController: {
    // position: 'fixed',
    // bottom: 30,
    // right: 30,
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
})

export default SaveControls;