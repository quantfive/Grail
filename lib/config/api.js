'use strict';

exports.__esModule = true;
/**
* Module define all API paths
* author: @patr -- patrick@quantfive.org
*/

var PRODUCTION_SITE = process.env.APP_ENV === 'production' ? 'grailhq.com' : 'grailhq.com'; //TODO: setup production site
var LOCALHOST = 'localhost:8002';

var BASE_URL = process.env.NODE_ENV === 'production' ? 'https://' + PRODUCTION_SITE + '/api/' : 'http://' + LOCALHOST + '/api/';
function setupRequestHeaders(noContentType) {
  var storage = window.localStorage;
  var token = storage['q5.grail.token'];

  var headers = {
    'Content-Type': 'application/json'
  };

  if (noContentType) {
    headers = {};
  }

  if (token) {
    headers['Authorization'] = 'Token ' + token;
  }

  return headers;
}

var API = {
  // Save Page State
  SAVE_PAGE_STATE: BASE_URL + 'page_states',

  // Diff Page State
  DIFF_PAGE_STATE: BASE_URL + 'diff_page_states',

  // HTTP Configurations
  GET_CONFIG: function GET_CONFIG() {
    var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var headers = void 0;
    headers = setupRequestHeaders(false);
    return {
      method: 'GET',
      headers: headers
    };
  },
  GET_CONFIG_WITH_BODY: function GET_CONFIG_WITH_BODY(data) {
    var headers = void 0;
    headers = setupRequestHeaders(false);
    return {
      method: 'GET',
      body: JSON.stringify(data),
      headers: headers
    };
  },
  POST_FILE_CONFIG: function POST_FILE_CONFIG(data) {
    // authorization token
    var headers = setupRequestHeaders(true);
    return {
      method: 'post',
      body: data,
      headers: headers
    };
  },
  POST_CONFIG: function POST_CONFIG(data) {
    // authorization token
    var headers = setupRequestHeaders();
    return {
      method: 'post',
      body: JSON.stringify(data),
      headers: headers
    };
  },
  PUT_CONFIG: function PUT_CONFIG(data) {
    // authorization token
    var headers = setupRequestHeaders();
    return {
      method: 'put',
      body: JSON.stringify(data),
      headers: headers
    };
  },
  DELETE_CONFIG: function DELETE_CONFIG(data) {
    // authorization token
    var headers = setupRequestHeaders();
    return {
      method: 'delete',
      body: JSON.stringify(data),
      headers: headers
    };
  }
};

exports.default = API;
module.exports = exports['default'];