'use strict';

var restify = require('restify');
var Q = require('q');

var REGISTRY_URL = 'https://index.docker.io/v1';

function RegistryClient(opts) {
    opts = opts || {};        
    this.url = opts.url || REGISTRY_URL;

    this.client = restify.createJsonClient({
        url: this.url,
        log: this.log
    });

    this.client.headers.authorization = 'Basic ' + opts.authToken;
}

RegistryClient.prototype.getStatus = function() {
  var deferred = Q.defer();

  this.client.get({
      path: '/v1/_ping'
  }, function (err, req, res, jsonResp) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(jsonResp);
      }
  });

  return deferred.promise;
};

RegistryClient.prototype.getTags = function(repo) {
  var deferred = Q.defer();
  this.client.get({
    path: '/v1/repositories/' + repo + '/tags'
  }, function (err, req, res, jsonResp) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(jsonResp);
      }
  });

  return deferred.promise;
};


module.exports = RegistryClient;