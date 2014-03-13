/*
 * caminio-media
 *
 * @author quaqua <quaqua@tastenwerk.com>
 * @date 03/2014
 * @copyright TASTENWERK http://tastenwerk.com
 * @license MIT
 *
 */


var helper = require('../helper'),
    fixtures = helper.fixtures,
    expect = helper.chai.expect;

'use strict';

describe( 'Mediafile', function(){

  var caminio;
  var Mediafile;

  before( function(done){
    helper.initApp( this, function(){ 
      caminio = helper.caminio;
      Mediafile = caminio.models.Mediafile;
      done();
    });
  });

  describe( 'building a media file', function(){

    it('requires a name', function( done ){
      var mf = new Mediafile();
      mf.validate( function (err){
        console.log(err);
        expect(err).to.have.property('errors'); 
        expect(err.errors).to.have.property('name');
        done();
      });
    });

  });

});
