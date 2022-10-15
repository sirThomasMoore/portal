const mongoose = require('mongoose');
const collectionName = 'garageDoors';
const GarageDoors = new mongoose.Schema({
    garageDoors: {
        type: Array,
        door: {
            type: Object,
            name: {
                type: String,
            },
            status: {
                type: Boolean
            }
        }
    }
});

mongoose.Promise = global.Promise;

GarageDoors.set('collection', 'garageDoors');

mongoose.model('GarageDoors', GarageDoors, collectionName);

module.exports = GarageDoors;