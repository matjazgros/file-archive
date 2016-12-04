import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('file').then(files => files.sortBy('created_at').reverse());
  }
});
