import DS from 'ember-data';
import config from '../config/environment';

export default DS.Model.extend({
  path: DS.attr('string'),
  name: DS.attr('string'),
  hash: DS.attr('string'),
  mime: DS.attr('string'),
  size: DS.attr('number'),

  user: DS.belongsTo('user'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  downloadUrl: function() {
    return config.apiUrl + '/files/' + this.get('hash');
  }.property('hash'),

  thumbUrl: function() {
    return config.apiUrl + '/files/' + this.get('hash') + '/thumb';
  }.property('hash'),

  createdFromNow: function() {
    let date = moment.utc(this.get('created_at'), 'YYYY-MM-DD HH:mm:ss').toDate();
    console.log(date);
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  }.property('created_at'),

  fileSize: function() {
    return filesize(this.get('size'));
  }.property('size'),

  confirmDelete: false,
});
