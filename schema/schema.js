const mongoose = require('mongoose');
const url = "mongodb://converse:higher@ds133321.mlab.com:33321/ucsdchatrooms";
Promise = require('bluebird');
mongoose.connect(url); //connect to mlab database
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
module.exports.Schema = Schema;
module.exports.Promise = Promise;

/**
 * Message Schema
 */
module.exports.Message = mongoose.model('Message', new Schema({
  Sender: String,
  Content: String,
  Time: String,
},{collection: 'Messages'}));



