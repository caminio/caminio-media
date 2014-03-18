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

      'treeItemSelected': function( label, select ){
        this.set('mediafiles', App.User.store.find('mediafile', { parent: label.id }));
        if( this.get('curSelectedItem.id') === label.get('id') && !select )
          return this.set('curSelectedItem',null);
        this.set('curSelectedItem', label);
      }

    },

    didInsertElement: function(){

      var controller = this.get('controller');
      if( controller.get('item') ){
        controller.set('mediafiles', App.User.store.find('mediafile', { parent: controller.get('item').id }));
      }

      $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },500);
          App.Mediafile.store.pushPayload('mediafile', data.result);
          controller.set('mediafiles', App.Mediafile.store.all('mediafile', { parent: controller.get('curSelectedItem').id }));
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
        data.formData = { parent: controller.get('curSelectedItem').id,
                          parentType: (controller.get('curSelectedItem') instanceof App.Webpage) ? 'Webpage' : 'Label' };
      });
    }

  });



})( App );