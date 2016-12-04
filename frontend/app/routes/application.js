import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import request from '../helpers/request';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service(),
  beforeModel() {
    let that = this;
    request.send({
        url: 'users/me',
        type: 'GET',
        success: (data) => {
          let user = that.store.peekRecord('user', data.user.id);
          if (user === null) {
            that.store.pushPayload(data);
            user = that.store.peekRecord('user', data.user.id);
          }
          that.set('session.data.currentUser', user);
        },
        error: (jx, status, err) => {
          if (jx.responseJSON) {
            this.set('errorMessage', jx.responseJSON.error || err);
          }
          this.send('invalidateSession');
          that.transitionToRoute('login');
        }
      }, this.get('session'));
  },
  actions: {
    back() {
      history.back();
    },
    invalidateSession() {
      if (this.get('session.isAuthenticated')) {
        this.get('session').invalidate();
        this.transitionTo('index');
      }
      return false;
    }
  }
});
