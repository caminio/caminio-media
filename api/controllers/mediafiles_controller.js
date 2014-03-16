/*
 * caminio-media
 *
 * @author <thorsten.zerha@tastenwerk.com>
 * @date 03/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license comercial
 *
 */

var fs          = require('fs');
var join        = require('path').join;
var basename    = require('path').basename;
var mkdirp      = require('mkdirp');
var formidable  = require('formidable');
var util        = require('util');
var async       = require('async');

/**
 *  @class MediafilesController
 *  @constructor
 */
module.exports = function( caminio, policies, middleware ){

  var Mediafile = caminio.models.Mediafile;

  return {

    _before: {
      '*': policies.ensureLogin
    },

    create: function( req, res ){
      var form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.maxFieldsSize = res.locals.currentDomain.preferences.uploadLimit;
      var procFiles = [];
      req.mediafiles = [];
      req.errors = [];
      var parent;
      
      form.uploadDir = join( res.locals.currentDomain.getContentPath(), 'public', 'files' );
      if( !fs.existsSync( form.uploadDir ) )
        mkdirp.sync( form.uploadDir );

      form
      .on('fileBegin', function(name, file){
        file.path = join( form.uploadDir, file.name );
      })
      .on('field', function(name, value){
        switch( name ){
          case 'parent':
            parent = value;
            break;
        }
      })
      .on('file', function(field,file){
        procFiles.push( file );
      })
      .on('end', function(){
        async.each( procFiles, createMediafile, function(){
          res.json({ mediafiles: req.mediafiles });
        });
      })
      .on('error', function(err){
        res.send( 500, util.inspect(err) );
      }).parse(req, function(err, fields, files){});

      function createMediafile( file, next ){
        Mediafile.create({ name: file.name, 
                           size: file.size,
                           parent: parent,
                           camDomain: res.locals.currentDomain,
                           createdBy: res.locals.currentUser,
                           updatedBy: res.locals.currentUser,
                           path: basename(file.path),
                           contentType: file.type }, function( err, mediafile ){
                            if( err ){ req.err.push( err ); return next(); }
                            req.mediafiles.push( mediafile );
                            next();
                          });
      }

    }

  };

};
