import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  errorMessage: null,
  currentUser: Ember.computed('session.data.authenticated.user', function() {
    return this.get('session.data.authenticated.user');
  }),
  isAuthTemplate: false,
  currentPathChanged: function() {
    let currentPath = this.get('currentPath');
    let isAuthTemplate = currentPath ? ['login', 'register'].indexOf(currentPath) > -1 : true;
    this.set('isAuthTemplate', isAuthTemplate);
  }.observes('currentPath').on("init"),
  isSending: false,
  initDropzone: function() {
    let that = this;
    this.get('session').authorize('authorizer:token', (header, value) => {
      let that = this;
      let dropzone = new Dropzone(document.body, {
        url: config.apiUrl + '/files',
        autoProcessQueue: true,
        previewTemplate: '<div id="preview-template" style="display: none;"></div>',
        parallelUploads: 5,
        uploadMultiple: false,
        addRemoveLinks: false,
        acceptedFiles: 'audio/mpeg,audio/mp3,image/jpg,image/jpeg,image/png,video/mp4',
        dictInvalidFileType: 'Only jpg, png, mp3 and mp4 files are allowed.',
        headers: {
          [header]: value
        }
      });
      dropzone.on('queuecomplete', function() {
        that.set('isSending', false);
      });
      dropzone.on('success', function(file, data, event) {
        that.get('store').pushPayload(data);
      });
      dropzone.on('error', function(event, errorMessage, xhr) {
        let msg = errorMessage;
        if(errorMessage.file) {
          msg = errorMessage.file[0];
        }
        that.set('errorMessage', msg);
        if (msg) {
          setTimeout(function() {
            this.set('errorMessage', null);
          }.bind(that), 3000)
        }
      })
      dropzone.on('sending', function(event) {
        that.set('isSending', true);
      })
    });

  }.on("init")
});
