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
var inflection  = require('inflection');
var util        = require('util');
var camUtil     = require('caminio/util');
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
      'update': [ getMediaFile, renameFileIfRequired, cropImage ]
    },

    'create_embedded': [
      getDocById,
      checkDocMediafiles,
      function( req, res ){
        var procFiles = [];
        var onlyOne = false;
        var form = createForm( req, res.locals.currentDomain );
        form
          .on('fileBegin', function(name, file){
            file.path = join( form.uploadDir, file.name );
          })
          .on('file', function(field,file){
            procFiles.push( file );
          })
          .on('field', function(name, value){
            switch( name ){
              case 'only_one':
                onlyOne = true;
                break;
            }
          })
          .on('end', function(){
            async.each( procFiles, createEmbeddedMediafile, function(){
              res.json({ mediafiles: req.mediafiles });
            });
          })
          .on('error', function(err){
            console.error(err);
            caminio.logger.error(err);
            res.send( 500, util.inspect(err) );
          }).parse(req, function(err, fields, files){});

        function createEmbeddedMediafile( file, next ){
          req.err = req.err || [];
          var mediafile = { name: file.name, 
                             size: file.size,
                             createdBy: res.locals.currentUser,
                             updatedBy: res.locals.currentUser,
                             path: basename(file.path),
                             contentType: file.type };

          if( onlyOne )
            req.doc.mediafiles.forEach(function(doc){
              doc.remove();
            });

          req.doc.mediafiles.push(mediafile);

          req.doc.save(function( err ){
            if( err ){ 
              console.error(err);
              req.err.push( err ); 
              return next(); 
            }
            req.mediafiles.push( mediafile );
            next();
          });
        }
      }],

    create: function( req, res ){
      var procFiles = [];
      var parent;
      var form = createForm( req, res.locals.currentDomain );
      form
        .on('field', function(name, value){
          switch( name ){
            case 'parent':
              parent = value;
              if( parent )
                form.uploadDir = join(form.uploadDir, parent);
              break;
          }
        })
        .on('fileBegin', function(name, file){
          if( !fs.existsSync( form.uploadDir ) )
            mkdirp.sync( form.uploadDir );
          file.name = camUtil.normalizeFilename( file.name );
          file.path = join( form.uploadDir, file.name );
          console.log('writing to ', file.path);
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
          console.error(err);
          caminio.logger.error(err);
          res.send( 500, util.inspect(err) );
        }).parse(req, function(err, fields, files){});

      function createMediafile( file, next ){
        if( typeof(parent) === 'string' && parent === 'null' )
          parent = null;
        req.err = req.err || [];
        Mediafile.create({ name: file.name, 
                           size: file.size,
                           parent: parent,
                           camDomain: res.locals.currentDomain,
                           createdBy: res.locals.currentUser,
                           updatedBy: res.locals.currentUser,
                           path: basename(file.path),
                           contentType: file.type }, function( err, mediafile ){
                            if( err ){ 
                              console.error(err);
                              req.err.push( err ); 
                              return next(); 
                            }
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

    var filename = join( res.locals.currentDomain.getContentPath(), 'public', 'files', req.mediafile.relPath );

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

  function createForm( req, domain ){
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.maxFieldsSize = domain.diskUploadLimitM * 10^6;
    req.mediafiles = [];
    req.errors = [];
    
    form.uploadDir = join( domain.getContentPath(), 'public', 'files' );

    if( !fs.existsSync( form.uploadDir ) )
      mkdirp.sync( form.uploadDir );

    return form;
  }

  function getDocById( req, res, next ){
    caminio.models[inflection.classify(req.param('doc_type'))].findOne({ _id: req.param('doc_id') }).exec(function(err, doc){
      if( err ){ return res.json(500, { error: 'document_retrieval', details: err}); }
      if( !doc ){ return res.json(404, { error: 'not found', details: 'The requested document was not found on this server'}); }
      req.doc = doc;
      next();
    });
  }

  function checkDocMediafiles( req, res, next ){
    if( !('mediafiles' in req.doc) )
      return res.json(400, { error: 'document attributes error', details: 'the document does not provide a "mediafiles" attribute'});
    next();
  }

  function getMediaFile( req, res, next ){
    Mediafile
      .findOne({ _id: req.param('id') })
      .exec(function( err, mediafile ){
        if( err ){ return res.json(500, { error: 'server error', details: err }); }
        req.mediafile = mediafile;
        next();
      });
  }

  function renameFileIfRequired( req, res, next ){
    var publicPath = join(res.locals.currentDomain.getContentPath(), 'public', 'files', req.mediafile.relPath);
    if( req.mediafile.name === req.body.mediafile.name ||
        !fs.existsSync( publicPath ) )
      return next();
    req.body.mediafile.name = camUtil.normalizeFilename( req.body.mediafile.name );
    fs.renameSync( publicPath,
                   join(res.locals.currentDomain.getContentPath(), 'public', 'files', req.body.mediafile.relPath ) )
    next();
  }

};