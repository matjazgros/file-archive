/* globals $ */

import config from '../config/environment';

let makeRequest = function(params, session, cb) {
  let options = {
      dataType: 'json',
      contentType: 'application/json',
      url: config.apiUrl + '/' + params.url,
      type: params.type || 'GET',
      success: params.success || function() {},
      error: params.error || function() {},
      headers: {}
    };

    if (typeof cb === 'function') {
      options = cb(options);
    }

    if (options.type === 'POST') {
      options.data = JSON.stringify(params.data);
    } else {
      options.data = params.data;
    }

    return $.ajax(options);
};

export function send(params, session) {
  if (session) {
    session.authorize('authorizer:token', (header, value) => {
      return makeRequest(params, session, function(options) {
        options.headers[header] = value;
        return options;
      });
    });
  } else {
    return makeRequest(params, session);
  }
}
