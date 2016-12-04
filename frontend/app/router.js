import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('register');
  this.route('files');
  // this.route('files', function() {
  //   this.route('list');
  //   this.route('upload');
  //   this.route('view/:id');
  // });
});

export default Router;
