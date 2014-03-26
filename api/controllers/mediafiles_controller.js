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
var extname     = require('path').extname;
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
      '*': policies.ensureLogin,
      'update': [ cropImage ]
    },

    create: function( req, res ){
      var form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.maxFieldsSize = res.locals.currentDomain.diskUploadLimitM * 10^6;
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
        caminio.logger.error(err);
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

  function cropImage( req, res, next ){
    var easyimg = require('easyimage');

    if( req.body.mediafile.contentType.indexOf('image') < 0 )
      return next();

    if( !res.locals.domainSettings.thumbs ||
        res.locals.domainSettings.thumbs.length < 1 )
      return;

    var filename = join( res.locals.currentDomain.getContentPath(), 'public', 'files', req.body.mediafile.name );

    async.each( res.locals.domainSettings.thumbs, function( thumbSize, nextThumb ){

      if( !req.body.mediafile.preferences.thumbs[thumbSize] )
        return nextThumb();

      easyimg.resize({
         src: filename, 
         dst: filename.split('.')[0]+'_'+thumbSize+extname(filename),
         width: req.body.mediafile.preferences.thumbs[thumbSize].resizeW, 
         height: req.body.mediafile.preferences.thumbs[thumbSize].resizeH,
      }, function(err, image){
        var x = req.body.mediafile.preferences.thumbs[thumbSize].cropX;
        var y = req.body.mediafile.preferences.thumbs[thumbSize].cropY;
        var cropW = parseInt(thumbSize.split('x')[0]);
        var cropH = parseInt(thumbSize.split('x')[1]);
        var offsetCorrection = image.width - (x + cropW);
        if( offsetCorrection < 0 )
          x = x + offsetCorrection;

        offsetCorrection = image.height - (y + cropH);
        if( offsetCorrection < 0 )
          y = y + offsetCorrection;
        
        var options = {
          src: filename.split('.')[0]+'_'+thumbSize+extname(filename),
          dst: filename.split('.')[0]+'_'+thumbSize+extname(filename),
          cropwidth: cropW,
          cropheight: cropH,
          x: x,
          y: y,
          gravity: 'NorthWest'
        };
        easyimg.crop( options, function( err, image ){
           if (err) throw err;
           caminio.logger.info('thumb: ' + thumbSize + ' w'+parseInt(thumbSize.split('x')[0])+' h:'+parseInt(thumbSize.split('x')[1]) + ' ' + image.width + ' x ' + image.height);
           nextThumb();
        });
      });
    }, next);

  }

};
