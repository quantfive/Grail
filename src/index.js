/***
 * Main Library for Grail frontend testing
 * @piccoloman
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app/App';
import { Provider } from 'react-redux';
import { configure, history } from './config/configure-store';

const store = configure();

const LOAD_TIME = 1000;

class GrailTest {
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

  doc_ready(callback) {
    if(typeof document !== 'undefined') { // Don't Run on Server Side Rendered React
      if (document.readyState !== 'loading') {
        callback();
      } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback);
      } else { // IE <= 8
        console.log("ie 8 and below is discouraged");
        document.attachEvent('onreadystatechange', function(){
          if (document.readyState === 'complete') callback();
        });
      }
    }
  }

  run = (history) => {
    let test = new GrailTest();
    //setTimeout(test.runTests, LOAD_TIME);
    setTimeout(test.injectControls.bind(test, history), LOAD_TIME);
  }

  injectControls (history=null) {
    var document = this.getDocument();

    // For webpack hot reloads
    if (document.querySelector('.grail-test-wrapper')) { // Already injected controls
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = "grail-test-wrapper";
    wrapper.id = 'wrapper';
    // I think in the future we might want to use createShadowRoot but the api isn't standardized yet
    // var htmlTemplate = `
    // <iframe src="./grail/build/index.html"></iframe>
    // `;
    // wrapper.innerHTML = htmlTemplate;
    document.body.insertBefore(wrapper, document.body.firstChild);
    ReactDOM.render(
      <Provider store={store}>
        <App id='app' history={history}/>
      </Provider>, 
      document.getElementsByClassName('grail-test-wrapper')[0]
    );

    if (process.env.NODE_ENV !== 'production') {
      window.store = store;
    }
  }
}

export default GrailTest;
