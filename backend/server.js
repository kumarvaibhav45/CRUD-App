const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true }, (err, db) => {
	if (err) throw err;
});
const connection = mongoose.connection;

connection.once('open', function() {
	console.log('MongoDB database connection established successfully');
});

todoRoutes.route('/').get(function(req, res) {
	Todo.find(function(err, todos) {
		if (err) {
			console.log(err);
		} else {
			res.json(todos);
		}
	});
});

todoRoutes.route('/:id').get(function(req, res) {
	let id = req.params.id;
	Todo.findById(id, function(err, todo) {
		if (!todo) return res.status(404).send('Data not found!');
		res.json(todo);
	});
});

todoRoutes.route('/completed/:id').post(function(req, res) {
	Todo.findById(req.params.id, function(err, todo) {
		if (!todo) return res.status(404).send('Data not found!');
		else
			todo
				.updateOne({ $set: { completed: req.body.completed } })
				.then((todo) => {
					res.json('Task updated!');
				})
				.catch((err) => {
					res.status(400).send('Update not possible');
				});
	});
});

todoRoutes.route('/update/:id').post(function(req, res) {
	Todo.findById(req.params.id, function(err, todo) {
		if (!todo) return res.status(404).send('Data not found!');
		else todo.task = req.body.task;
		todo.responsibility = req.body.responsibility;
		todo.task_priority = req.body.task_priority;
		todo.completed = req.body.completed;
		todo
			.save()
			.then((todo) => {
				res.json('Todo updated!');
			})
			.catch((err) => {
				res.status(400).send('Update not possible');
			});
	});
});

todoRoutes.route('/delete/:id').delete(function(req, res) {
	Todo.findById(req.params.id, function(err, todo) {
		if (!todo) {
			return res.status(404).send('Data not found!');
		}
		todo
			.remove()
			.then((todo) => {
				res.json('Task Deleted!');
			})
			.catch((err) => {
				res.status(400).send('Delete not possible');
			});
	});
});

todoRoutes.route('/add').post(function(req, res) {
	let todo = new Todo(req.body);
	todo
		.save()
		.then((todo) => {
			res.status(200).json({ todo: 'todo added successfully' });
		})
		.catch((err) => {
			res.status(400).send('adding new todo failed');
		});
});

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
	console.log('Server is running on Port: ' + PORT);
});
