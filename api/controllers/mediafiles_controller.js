/*
 * caminio-media
 *
 * @author <thorsten.zerha@tastenwerk.com>
 * @date 03/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license comercial
 *
 */

var fs      = require('fs');
var join    = require('path').join;
var mkdirp  = require('mkdirp');

/**
 *  @class MediafilesController
 *  @constructor
 */
module.exports = function( caminio, policies, middleware ){

  return {

    _before: {
      '*': policies.ensureLogin
    }

  };

};
