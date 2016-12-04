
import Ember from 'ember';
import request from '../helpers/request';

export default Ember.Controller.extend({
  needs: ['application'],
  session: Ember.inject.service('session'),
  disabled: '',

  actions: {
    register() {
      let {
        email,
        password,
        password1,
        firstName,
        lastName
      } = this.getProperties('email', 'password', 'password1', 'firstName', 'lastName');

      request.send({
        type: 'POST',
        url:  'users',
        data: {
          email: email || "",
          name: firstName || "",
          password: password || "",
          password1: password1 || ""
        },
        success: () => {
          this.set('errorMessage', 'You will receive verification email in a moment.');
          let { email, password } = this.getProperties('email', 'password');
          this
            .get('session')
            .authenticate('authenticator:token', { identification: email, password }).then(() => {
              this.transitionToRoute('index');
            }).catch((reason) => {
              this.set('errorMessage', reason.error || reason);
            });

          this.setProperties({
            'disabled': 'disabled',
            'email': '',
            'password': '',
            'password1': '',
          });
        },
        error: (jx, status, err) => {
          if (jx.responseJSON) {
            this.set('error', {});
            this.set('errorMessage', {});
            _.keys(jx.responseJSON).forEach(function(key) {
              this.set('error.' + key, true);
              this.set('errorMessage.' + key, _.first(jx.responseJSON[key]));
            }, this);
          }
        }
      });
    }
  }
});
