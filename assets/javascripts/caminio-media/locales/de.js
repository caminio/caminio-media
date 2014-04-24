(function(){

  'use strict';

  if( currentLang !== 'de' ) return;

  var translations = {
    
    'media_manager.title': 'Media Manager',
    'media.upload': 'Datei hochladen',
    'media.insert_selected': 'Ausgewähltes Bild einfügen',

    'media.labels.title': 'Labels',
    'media.files.title': 'Dateien',
    'media.webpages.title': 'Webseiten',

    'drop_files_here': 'Hochladen',
    'perc_completed': 'Prozent abgeschlossen',

    'file.actions': 'Aktionen',
    'file.name': 'Dateiname',
    'file.content_type': 'Dateityp',
    'file.size': 'Größe',
    'file.description': 'Beschreibung',
    'file.remove': 'Datei löschen',
    'file.delete': 'Diese Datei löschen',
    'file.really_delete': 'Soll diese Datei ({{name}}) wirklich gelöscht werden?',
    'file.deleted': '{{name}} wurde gelöscht',
    'file.copyright': 'Copyright'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();