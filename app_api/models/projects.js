var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var taskSchema = require('./tasks');

var projectSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String},
	categories: [String],
	tasks: [taskSchema]
});

mongoose.model('Project', projectSchema);