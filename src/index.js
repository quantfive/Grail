/***
 * Main Library for Grail frontend testing
 * @piccoloman
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app/App';

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

  run = () => {
    let test = new GrailTest();
    //setTimeout(test.runTests, LOAD_TIME);
    setTimeout(test.injectControls.bind(test), LOAD_TIME);
  }

  injectControls () {
    var document = this.getDocument();

    // For webpack hot reloads
    if (document.querySelector('.grail-test-wrapper')) { // Already injected controls
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = "grail-test-wrapper";
    // I think in the future we might want to use createShadowRoot but the api isn't standardized yet
    // var htmlTemplate = `
    // <iframe src="./grail/build/index.html"></iframe>
    // `;
    // wrapper.innerHTML = htmlTemplate;
    document.body.insertBefore(wrapper, document.body.firstChild);
    ReactDOM.render(<App />, document.getElementsByClassName('grail-test-wrapper')[0]);
  }
}

export default GrailTest;
