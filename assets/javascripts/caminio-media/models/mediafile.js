( function(App){

  'use strict';

  App.Mediafile = DS.Model.extend({
    name: DS.attr(),
    contentType: DS.attr(),
    size: DS.attr('number'),
    createdAt: DS.attr('date'),
    preferences: DS.attr('object'),
    updatedAt: DS.attr('date'),
    createdBy: DS.belongsTo('user'),
    updatedBy: DS.belongsTo('user'),
    description: DS.attr(),
    copyright: DS.attr(),
    thumbnails: DS.attr('array'),
    url: function(){
      if( currentDomain.preferences.isCaminioHosted )
        return '/caminio/domains/'+currentDomain._id+'/preview/'+this.get('name');
      return null;
    }.property('preferences'),
    isImage: function(){
      return this.get('contentType').indexOf('image') === 0;
    }.property('contentType'),
    humanSize: function(){
      return filesize(this.get('size'));
    }.property('size')
  });

})(App);