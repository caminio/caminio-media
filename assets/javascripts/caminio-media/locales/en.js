(function(){

  'use strict';

  if( currentLang !== 'en' ) return;

  var translations = {
    
    'media_manager.title': 'Media Manager',
    'media.upload': 'Upload a file',
    'media.insert_selected': 'Insert selected Image',

    'media.labels.title': 'Labels',
    'media.files.title': 'Files',
    'media.webpages.title': 'Webpages',


    'drop_files_here': 'Drop files or click',
    'perc_completed': 'percent completed',

    'file.actions': 'Actions',
    'file.name': 'Filename',
    'file.remove': 'Remove this file',
    'file.delete': 'Delete this file',
    'file.really_delete': 'Really delete this file ({{name}})?',
    'file.content_type': 'Content type',
    'file.size': 'Filesize',
    'file.description': 'Description',
    'file.copyright': 'Copyright',
    'file.saved': 'File {{name}} has been saved',
    'file.deleted': 'File {{name}} has been deleted'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();