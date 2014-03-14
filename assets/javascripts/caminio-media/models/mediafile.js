( function(){

  'use strict';

  window.App.Mediafile = DS.Model.extend({
    locale: DS.attr(),
    title: DS.attr(),
    subtitle: DS.attr(),
    content: DS.attr(),
    metaDescription: DS.attr(),
    metaKeywords: DS.attr()
  });

}).call();