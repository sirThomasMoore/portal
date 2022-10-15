const mongoose = require('mongoose');
const Users = new mongoose.Schema({ Users: Array }, { collection: 'users' });
const collectionName = 'users';

mongoose.Promise = global.Promise;

Users.set('collection', 'users');

mongoose.model('Users', Users, collectionName);

module.exports = Users;