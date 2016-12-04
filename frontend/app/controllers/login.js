import Ember   from 'ember';
import request from '../helpers/request';

export default Ember.Controller.extend({
  needs: ['application'],
  session: Ember.inject.service(),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');

      this.get('session').authenticate('authenticator:token', { identification, password }).then((data) => {
        request.send({
          url: 'users/me',
          type: 'GET',
          success: (data) => {
            let ctrl = this.container.lookup('controller:application');
            if (!ctrl.get('currentUser')) {
              ctrl.set('currentUser', this.store.createRecord('user', data.user));
            }
            this.set('errorMessage', null);
            this.transitionToRoute('files');
          },
          error: (jx, status, err) => {
            if (jx.responseJSON) {
              this.set('errorMessage', jx.responseJSON.error || err);
            }
          }
        }, this.get('session'));

      }).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
