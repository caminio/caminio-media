( function( App ){

  'use strict';

  App.MediafileEditorController = Ember.ObjectController.extend({

    domainThumbs: domainSettings.thumbs,

    actions: {
      closeModal: function(mediafile){
        var self = this;
        $('#modal')
          .modal('hide')
          .on('hidden.bs.modal', function(){
            self.get('curRoute').send('closeModal', mediafile);
          });
      },
      save: function(){
        var mediafile = this.get('content');
        var self = this;
        mediafile.save().then(function(){
          notify('info', Em.I18n.t('file.saved', { name: mediafile.get('name') }));
          self.send('closeModal');
        });
      },
      toggleTeaser: function( mediafile ){
        mediafile.set('isTeaser', !mediafile.get('isTeaser'));
        mediafile.save().then(function(){
          notify('info', Em.I18n.t('file.saved', { name: mediafile.get('name') }));
        });
      },
      toggleHidden: function( mediafile ){
        mediafile.set('isHidden', !mediafile.get('isHidden'));
        mediafile.save().then(function(){
          notify('info', Em.I18n.t('file.saved', { name: mediafile.get('name') }));
        });
      },
      remove: function(){
        var mediafile = this.get('content');
        var self = this;
        bootbox.confirm( Em.I18n.t('file.really_delete', {name: mediafile.get('name')}), function(result){
          if( !result )
            return;
          mediafile.deleteRecord();
          mediafile.save().then(function(){
            notify('info', Em.I18n.t('file.deleted', { name: mediafile.get('name') }));
            self.send('closeModal', mediafile);
          });
        });
      }
    }

  });

})( App );