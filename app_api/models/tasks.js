var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
	name: {type: String, required: true},
	startDate: {type: Date, default: Date.now},
	endDate: {type: Date, default: Date.now},
	done: {type: Boolean, default: false}
});

mongoose.model('Task', taskSchema);

module.exports = taskSchema;