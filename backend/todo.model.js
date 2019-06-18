const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
	task: {
		type: String
	},
	responsibility: {
		type: String
	},
	task_priority: {
		type: String
	},
	completed: {
		type: Boolean
	}
});

module.exports = mongoose.model('Todo', Todo);
