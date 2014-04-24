( function( App ){

  'use strict';

  App.MediaManagerComponent = Ember.Component.extend({

    breadcrumbs: Em.A(),

    updateBreadcrumbs: function(){
      if( this.get('curItem') )
        return collectBreadCrumbs.call(this, this.get('curItem') );
    }.observes('curItem'),

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
      },

      'goToRootLevel': function(){
        this.set('labels', App.User.store.find('label') );
        this.set('curSelectedItem', null);
        this.set('mediafiles', App.User.store.find('mediafile', { parent: 'null' }));
        this.set('webpages', App.User.store.find('webpage', { parent: 'null' }));
        this.set('breadcrumbs', Em.A());
      },

      'goToLevel': function( item ){
        this.set('labels', null );
        this.set('curItem', item);
        this.set('mediafiles', App.User.store.find('mediafile', { parent: item.get('id') }));
        this.set('webpages', App.User.store.find('webpage', { parent: item.get('id') }));
      }

    },

    didInsertElement: function(){

      var controller = this.get('controller');
      if( controller.get('item') )
        controller.set('mediafiles', App.User.store.find('mediafile', { parent: controller.get('item').id }));
      else
        controller.set('mediafiles', App.User.store.find('mediafile', { parent: 'null' }));

      $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },500);
          App.Mediafile.store.pushPayload('mediafile', data.result);
          controller.set('mediafiles', App.Mediafile.store.all('mediafile', { parent: controller.get('curSelectedItem.id') }));
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
        if( controller.get('curSelectedItem') )
          data.formData = { parent: controller.get('curSelectedItem.id'),
                            parentType: (controller.get('curSelectedItem') instanceof App.Webpage) ? 'Webpage' : 'Label' };
      });
    }

  });

  function collectBreadCrumbs( item ){
    this.set('labels', null );
    this.set('breadcrumbs', Em.A());
    this.set('curSelectedItem', item);
    this.set('mediafiles', App.User.store.find('mediafile', { parent: item.get('id') }));
    this.set('webpages', App.User.store.find('webpage', { parent: item.get('id') }) );
    addParent.call(this, item );
  }

  function addParent( item ){
    if( !item )
      return;
    this.get('breadcrumbs').pushObject(item);
    addParent.call(this, item.get('parent'));
  }


})( App );