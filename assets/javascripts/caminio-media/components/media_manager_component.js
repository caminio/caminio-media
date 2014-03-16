( function( App ){

  'use strict';

  App.MediaManagerComponent = Ember.Component.extend({

    actions: {

      'cancelClose': function(){
        this.get('curFile').rollback();
        this.set('curFile', null);
      },

      'insertImage': function(){
        this.get('parentView.controller').send('insertImage', this.get('curFile'));
        $('#media-library').modal('hide');
      },

      treeItemSelected: function( item ){
        console.log('setting item', item, App.User.store);
        this.set('mediafiles', App.User.store.find('mediafile', { parent: item.id }));
        this.set( 'curItem', item );
      }

    },

    didInsertElement: function(){

      var controller = this.get('controller');
      if( controller.get('curItem') )
        controller.set('mediafiles', App.User.store.find('mediafile', { parent: controller.get('curItem').id }));

      $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },500);
          App.Mediafile.store.pushPayload('mediafile', data.result);
          controller.set('mediafiles', App.Mediafile.store.all('mediafile', { parent: controller.get('curItem').id }));
        },
        progressall: function (e, data) {
          $('#progress').addClass('active');
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress .progress-bar').css(
            'width',
            progress + '%'
          )
          .attr('aria-valuenow', progress)
          .find('.perc-text').text(progress+'%');
        }
      }).on('fileuploadsubmit', function( e, data ){
        data.formData = { parent: controller.get('curItem').id,
                          parentType: (controller.get('curItem') instanceof App.Webpage) ? 'Webpage' : 'Label' };
      });
    }

  });



})( App );