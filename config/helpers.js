/**
 * Action helpers
 * author: @patr
 */

// Router requirements
// import { history } from '../config/configure-store';

/* global Promise */

const REQUEST_TIMEOUT_MS = 10000; // 10 seconds

const parseJSON = response => response.json();

const parseText = response => response.text();

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
};

const errorMsg = data => {
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
const timedRequest = (ms, promise) =>
  new Promise((resolve, reject) => {
    const timeoutHandler = setTimeout(() => {
      reject(new Error(`Request Timed Out: ${ms}`));
    }, ms);
    promise.then(
      response => {
        clearTimeout(timeoutHandler);
        resolve(response);
      },
      error => {
        clearTimeout(timeoutHandler);
        reject(error);
      }
    );
  });

const requestRedirect = (url, options) => {
  let opts = options;
  opts.redirect = 'follow';
  timedRequest(
    REQUEST_TIMEOUT_MS,
    fetch(url, opts).then(checkStatus)
  );
}

const request = (url, options) =>
  timedRequest(
    REQUEST_TIMEOUT_MS,
    fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
  );

const textRequest = (url, options) =>
  timedRequest(
    REQUEST_TIMEOUT_MS,
    fetch(url, options)
      .then(checkStatus)
      .then(parseText)
  );

const acceptedRequest = (url, options) =>
  timedRequest(REQUEST_TIMEOUT_MS, fetch(url, options).then(checkStatus));

module.exports = {
  acceptedRequest,
  parseJSON,
  parseText,
  checkStatus,
  errorMsg,
  request,
  textRequest,
  requestRedirect,
};
