( function( App ){

  'use strict';

  App.MediaIndexRoute = Ember.Route.extend({

    setupController: function( controller, model ){
      controller.set('webpages', this.store.find('webpage'));
      controller.set('labels', this.store.find('label'));
      this.store.find('user');
    }

  });

  App.MediaIndexController = Ember.Controller.extend({

    actions: {
    }

  });



})( App );