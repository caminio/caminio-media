( function( App ){

  'use strict';

  App.MediaManagerRoute = Ember.Route.extend({

    setupController: function( controller, model ){
      controller.set('labels', []);
      controller.set('currentLabel', null);
      controller.set('unlabeledFiles', this.store.find('mediafile'));
      controller.set('curFile', null);
      this.store.find('user');
    }

  });

  App.MediaManagerController = Ember.Controller.extend({

    actions: {

      'cancelClose': function(){
        this.get('curFile').rollback();
        this.set('curFile', null);
      }

    }

  });



})( App );