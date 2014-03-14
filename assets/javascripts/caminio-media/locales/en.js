(function(){

  'use strict';

  if( currentLang !== 'en' ) return;

  var translations = {
    
    'media_manager.title': 'Media Manager',
    'media.upload': 'Upload a file'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();