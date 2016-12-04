import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service('session'),
  beforeModel: function() {
    this._super(...arguments);
    if (this.get('session.isAuthenticated')) {
      return this.transitionTo('files');
    }
    this.transitionTo('login');
  }
});
