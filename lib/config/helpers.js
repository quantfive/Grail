'use strict';

/**
 * Action helpers
 * author: @patr
 */

// Router requirements
// import { history } from '../config/configure-store';

/* global Promise */

var REQUEST_TIMEOUT_MS = 10000; // 10 seconds

var parseJSON = function parseJSON(response) {
  return response.json();
};

var parseText = function parseText(response) {
  return response.text();
};

var checkStatus = function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  var error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
};

var errorMsg = function errorMsg(data) {
  if (data.errors) {
    var err = '';
    for (var key in data.errors) {
      if (data.errors.hasOwnProperty(key)) {
        if (err !== '') {
          err += ' and ';
        }
        err += data.errors[key];
      }
    }
    return err;
  }
};

/*
* Wraps any particular promise with a timeout to avoid long async requests
 */
var timedRequest = function timedRequest(ms, promise) {
  return new Promise(function (resolve, reject) {
    var timeoutHandler = setTimeout(function () {
      reject(new Error('Request Timed Out: ' + ms));
    }, ms);
    promise.then(function (response) {
      clearTimeout(timeoutHandler);
      resolve(response);
    }, function (error) {
      clearTimeout(timeoutHandler);
      reject(error);
    });
  });
};

var requestRedirect = function requestRedirect(url, options) {
  var opts = options;
  opts.redirect = 'follow';
  timedRequest(REQUEST_TIMEOUT_MS, fetch(url, opts).then(checkStatus));
};

var request = function request(url, options) {
  return timedRequest(REQUEST_TIMEOUT_MS, fetch(url, options).then(checkStatus).then(parseJSON));
};

var textRequest = function textRequest(url, options) {
  return timedRequest(REQUEST_TIMEOUT_MS, fetch(url, options).then(checkStatus).then(parseText));
};

var acceptedRequest = function acceptedRequest(url, options) {
  return timedRequest(REQUEST_TIMEOUT_MS, fetch(url, options).then(checkStatus));
};

module.exports = {
  acceptedRequest: acceptedRequest,
  parseJSON: parseJSON,
  parseText: parseText,
  checkStatus: checkStatus,
  errorMsg: errorMsg,
  request: request,
  textRequest: textRequest,
  requestRedirect: requestRedirect
};