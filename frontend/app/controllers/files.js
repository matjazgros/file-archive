import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  appController: Ember.inject.controller('application'),
  isSending: function() {
    return this.get('appController.isSending');
  }.property('appController.isSending'),
  files: function() {
    return this.store.peekAll('file');
  }.property('store'),
  sortingKey: ['created_at:desc'],
  sortedFiles: Ember.computed.sort('files', 'sortingKey'),
  actions: {
    confirmDelete(file) {
      file.set('confirmDelete', true);
      // toggle confirmDelete after 1.8s
      setTimeout(function() {
        if (this.get('isValid')) {
          this.set('confirmDelete', false);
        }
      }.bind(file), 1800);
      return false;
    },
    delete(file) {
      if (file) {
        file.deleteRecord();
        setTimeout(function() {
          $('.deleted')
            .children('td')
            .animate({ padding: 0, border: 0 })
            .wrapInner('<div />')
            .children()
            .slideUp();
        }, 0);
        setTimeout(function() {
          if (this.get('isDeleted')) {
            this.destroyRecord();
          }
        }.bind(file), 2000);
      }
      return false;
    }
  }
});
