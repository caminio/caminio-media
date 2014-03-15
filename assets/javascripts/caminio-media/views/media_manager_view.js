( function(){

  'use strict';

  window.App.MediaManagerView = Ember.View.extend({
    didInsertElement: function(){
      var controller = this.get('controller');
      $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },500);
          data.result.files.forEach( function( file ){
            controller.store.createRecord('mediafile', file );
          });
        },
        progressall: function (e, data) {
          $('#progress').addClass('active');
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress .progress-bar').css(
            'width',
            progress + '%'
          )
          .attr('aria-valuenow', progress)
          .find('.perc-text').text(progress+'%');
        }
    });
    }
  });

}).call();