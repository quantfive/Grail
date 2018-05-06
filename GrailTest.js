/***
 * Main Library for Grail frontend testing
 * @piccoloman
 */

const EMPTY_CHROME_STYLES = {"animation-delay":"0s","animation-direction":"normal","animation-duration":"0s","animation-fill-mode":"none","animation-iteration-count":"1","animation-name":"none","animation-play-state":"running","animation-timing-function":"ease","background-attachment":"scroll","background-blend-mode":"normal","background-clip":"border-box","background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-origin":"padding-box","background-position":"0% 0%","background-repeat":"repeat","background-size":"auto","border-bottom-color":"rgb(0, 0, 0)","border-bottom-left-radius":"0px","border-bottom-right-radius":"0px","border-bottom-style":"none","border-bottom-width":"0px","border-collapse":"separate","border-image-outset":"0px","border-image-repeat":"stretch","border-image-slice":"100%","border-image-source":"none","border-image-width":"1","border-left-color":"rgb(0, 0, 0)","border-left-style":"none","border-left-width":"0px","border-right-color":"rgb(0, 0, 0)","border-right-style":"none","border-right-width":"0px","border-top-color":"rgb(0, 0, 0)","border-top-left-radius":"0px","border-top-right-radius":"0px","border-top-style":"none","border-top-width":"0px","bottom":"auto","box-shadow":"none","box-sizing":"content-box","break-after":"auto","break-before":"auto","break-inside":"auto","caption-side":"top","clear":"none","clip":"auto","color":"rgb(0, 0, 0)","content":"","cursor":"auto","direction":"ltr","display":"block","empty-cells":"show","float":"none","font-family":"\"Times New Roman\"","font-kerning":"auto","font-size":"15px","font-stretch":"100%","font-style":"normal","font-variant":"normal","font-variant-ligatures":"normal","font-variant-caps":"normal","font-variant-numeric":"normal","font-variant-east-asian":"normal","font-weight":"400","height":"0px","image-rendering":"auto","isolation":"auto","justify-items":"normal","justify-self":"auto","left":"auto","letter-spacing":"normal","line-height":"normal","list-style-image":"none","list-style-position":"outside","list-style-type":"disc","margin-bottom":"0px","margin-left":"0px","margin-right":"0px","margin-top":"0px","max-height":"none","max-width":"none","min-height":"0px","min-width":"0px","mix-blend-mode":"normal","object-fit":"fill","object-position":"50% 50%","offset-distance":"0px","offset-path":"none","offset-rotate":"auto 0deg","opacity":"1","orphans":"2","outline-color":"rgb(0, 0, 0)","outline-offset":"0px","outline-style":"none","outline-width":"0px","overflow-anchor":"auto","overflow-wrap":"normal","overflow-x":"visible","overflow-y":"visible","padding-bottom":"0px","padding-left":"0px","padding-right":"0px","padding-top":"0px","pointer-events":"auto","position":"static","resize":"none","right":"auto","scroll-behavior":"auto","speak":"normal","table-layout":"auto","tab-size":"8","text-align":"start","text-align-last":"auto","text-decoration":"none solid rgb(0, 0, 0)","text-decoration-line":"none","text-decoration-style":"solid","text-decoration-color":"rgb(0, 0, 0)","text-decoration-skip-ink":"auto","text-underline-position":"auto","text-indent":"0px","text-rendering":"auto","text-shadow":"none","text-size-adjust":"auto","text-overflow":"clip","text-transform":"none","top":"auto","touch-action":"auto","transition-delay":"0s","transition-duration":"0s","transition-property":"all","transition-timing-function":"ease","unicode-bidi":"normal","vertical-align":"baseline","visibility":"visible","white-space":"normal","widows":"2","width":"964px","will-change":"auto","word-break":"normal","word-spacing":"0px","word-wrap":"normal","z-index":"auto","zoom":"1","-webkit-appearance":"none","backface-visibility":"visible","-webkit-border-horizontal-spacing":"0px","-webkit-border-image":"none","-webkit-border-vertical-spacing":"0px","-webkit-box-align":"stretch","-webkit-box-decoration-break":"slice","-webkit-box-direction":"normal","-webkit-box-flex":"0","-webkit-box-flex-group":"1","-webkit-box-lines":"single","-webkit-box-ordinal-group":"1","-webkit-box-orient":"horizontal","-webkit-box-pack":"start","-webkit-box-reflect":"none","column-count":"auto","column-gap":"normal","column-rule-color":"rgb(0, 0, 0)","column-rule-style":"none","column-rule-width":"0px","column-span":"none","column-width":"auto","align-content":"normal","align-items":"normal","align-self":"auto","flex-basis":"auto","flex-grow":"0","flex-shrink":"1","flex-direction":"row","flex-wrap":"nowrap","justify-content":"normal","-webkit-font-smoothing":"auto","grid-auto-columns":"auto","grid-auto-flow":"row","grid-auto-rows":"auto","grid-column-end":"auto","grid-column-start":"auto","grid-template-areas":"none","grid-template-columns":"none","grid-template-rows":"none","grid-row-end":"auto","grid-row-start":"auto","grid-column-gap":"0px","grid-row-gap":"0px","-webkit-highlight":"none","hyphens":"manual","-webkit-hyphenate-character":"auto","-webkit-line-break":"auto","-webkit-line-clamp":"none","-webkit-locale":"auto","-webkit-margin-before-collapse":"collapse","-webkit-margin-after-collapse":"collapse","-webkit-mask-box-image":"none","-webkit-mask-box-image-outset":"0px","-webkit-mask-box-image-repeat":"stretch","-webkit-mask-box-image-slice":"0 fill","-webkit-mask-box-image-source":"none","-webkit-mask-box-image-width":"auto","-webkit-mask-clip":"border-box","-webkit-mask-composite":"source-over","-webkit-mask-image":"none","-webkit-mask-origin":"border-box","-webkit-mask-position":"0% 0%","-webkit-mask-repeat":"repeat","-webkit-mask-size":"auto","order":"0","perspective":"none","perspective-origin":"482px 0px","-webkit-print-color-adjust":"economy","-webkit-rtl-ordering":"logical","shape-outside":"none","shape-image-threshold":"0","shape-margin":"0px","-webkit-tap-highlight-color":"rgba(51, 181, 229, 0.4)","-webkit-text-combine":"none","-webkit-text-decorations-in-effect":"none","-webkit-text-emphasis-color":"rgb(0, 0, 0)","-webkit-text-emphasis-position":"over right","-webkit-text-emphasis-style":"none","-webkit-text-fill-color":"rgb(0, 0, 0)","-webkit-text-orientation":"vertical-right","-webkit-text-security":"none","-webkit-text-stroke-color":"rgb(0, 0, 0)","-webkit-text-stroke-width":"0px","transform":"none","transform-origin":"482px 0px","transform-style":"flat","-webkit-user-drag":"auto","-webkit-user-modify":"read-only","user-select":"auto","-webkit-writing-mode":"horizontal-tb","-webkit-app-region":"no-drag","buffered-rendering":"auto","clip-path":"none","clip-rule":"nonzero","mask":"none","filter":"none","flood-color":"rgb(0, 0, 0)","flood-opacity":"1","lighting-color":"rgb(255, 255, 255)","stop-color":"rgb(0, 0, 0)","stop-opacity":"1","color-interpolation":"sRGB","color-interpolation-filters":"linearRGB","color-rendering":"auto","fill":"rgb(0, 0, 0)","fill-opacity":"1","fill-rule":"nonzero","marker-end":"none","marker-mid":"none","marker-start":"none","mask-type":"luminance","shape-rendering":"auto","stroke":"none","stroke-dasharray":"none","stroke-dashoffset":"0px","stroke-linecap":"butt","stroke-linejoin":"miter","stroke-miterlimit":"4","stroke-opacity":"1","stroke-width":"1px","alignment-baseline":"auto","baseline-shift":"0px","dominant-baseline":"auto","text-anchor":"start","writing-mode":"horizontal-tb","vector-effect":"none","paint-order":"fill stroke markers","d":"none","cx":"0px","cy":"0px","x":"0px","y":"0px","r":"0px","rx":"auto","ry":"auto","caret-color":"rgb(0, 0, 0)","line-break":"auto"};

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

  injectControls () {
    var document = this.getDocument();

    // For webpack hot reloads
    if (document.querySelector('.grail-test-wrapper')) { // Already injected controls
      return;
    }
    var wrapper = document.createElement('div');
    wrapper.className = "grail-test-wrapper";
    // I think in the future we might want to use createShadowRoot but the api isn't standardized yet
    var htmlTemplate = `
      <style>
        .grail-test-wrapper {
        }
      </style>
    `;
    wrapper.innerHTML = htmlTemplate;
    document.body.insertBefore(wrapper, document.body.firstChild);
  }
}

function doc_ready(callback) {
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

doc_ready(function(){
    let test = new GrailTest();
    //setTimeout(test.runTests, LOAD_TIME);
    setTimeout(test.injectControls.bind(test), LOAD_TIME);
});

export default GrailTest;
