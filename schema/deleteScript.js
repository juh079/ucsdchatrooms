const models = require('./schema');
models.Message.find({}).remove().exec();