(function(){

  'use strict';

  if( currentLang !== 'en' ) return;

  var translations = {
    
    'media_manager.title': 'Media Manager',
    'media.upload': 'Upload a file',
    'drop_files_here': 'Drop files or click',
    'perc_completed': 'percent completed',

    'file.name': 'Filename',
    'file.content_type': 'Content type',
    'file.size': 'Filesize',
    'file.description': 'Description',
    'file.copyright': 'Copyright'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();