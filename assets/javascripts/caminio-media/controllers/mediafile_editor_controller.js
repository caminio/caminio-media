( function( App ){

  'use strict';

  App.MediafileEditorController = Ember.ObjectController.extend({

    domainThumbs: domainSettings.thumbs,

    actions: {
      closeModal: function(){
        var self = this;
        $('#modal')
          .modal('hide')
          .on('hidden.bs.modal', function(){
            self.get('curRoute').send('closeModal');
          });
      },
      save: function(){
        var mediafile = this.get('content');
        mediafile.save().then(function(){
          notify('info', Em.I18n.t('file.saved', { name: mediafile.get('name') }));
        });
      }
    }

  });

})( App );