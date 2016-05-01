var request = require('request');
var mongoose = require('mongoose');
var Project = mongoose.model('Project');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

var doAddTask = function(req, res, project) {
	if (!project) {
		sendJsonResponse(res, 404, {
			"message": "projectid not found"
		});
	}else {
		project.tasks.push({
			name: req.body.name,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			done: req.body.done
		});
		project.save(function(err, project){
			var thisTask;
			if (err) {
				sendJsonResponse(res, 400, err);
			} else {
				thisTask = project.tasks[project.tasks.length - 1];
				sendJsonResponse(res, 201, thisTask);
			}
		});
	}
};

module.exports.tasksList = function (req, res) {
	if (req.params && req.params.projectid) {
		Project
		.findById(req.params.projectid)
		.select('name tasks')
		.exec(
			function (err, project) {
				var response, tasks;
				if (!project) {
					sendJsonResponse(res, 404, {
						"message": "projectid not found"
					});
					return;
				}else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				if (project.tasks && project.tasks.length > 0) {
					tasks = project.tasks;
					response = {
						project: {
								name: project.name,
								id: req.params.projectid
							},
						tasks: tasks
					};
					sendJsonResponse(res, 200, response);
				} else {
					sendJsonResponse(res, 404, {
						"message": "no tasks found"
					});
				}
			}
		);
	} else {
		sendJsonResponse(res, 404, {
			"message": "Not found, projectid is required"
		});
	}
};

module.exports.tasksReadOne = function (req, res) {
	if (req.params && req.params.projectid && req.params.taskid) {
		Project
		.findById(req.params.projectid)
		.select('name tasks')
		.exec(
			function (err, project) {
				var response, task;
				if (!project) {
					sendJsonResponse(res, 404, {
						"message": "projectid not found"
					});
					return;
				}else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				if (project.tasks && project.tasks.length > 0) {
					task = project.tasks.id(req.params.taskid);
					if (!task) {
						sendJsonResponse(res, 404, {
							"message": "taskid not found"
						});
					}else {
						response = {
							project: {
								name: project.name,
								id: req.params.projectid
							},
							task: task
						};
						sendJsonResponse(res, 200, response);
					}
				}else {
						sendJsonResponse(res, 404, {
							"message": "no tasks found"
						});
					}
				}
		);
	}else {
		sendJsonResponse(res, 404, {
			"message": "Not found, projectid and taskid are both required"
		});
	}
};

module.exports.tasksCreate = function (req, res) {
	var projectid = req.params.projectid;
	if (projectid) {
		Project
		.findById(projectid)
		.select('tasks')
		.exec(
			function (err, project) {
				if (err) {
					sendJsonResponse(res, 400, err);
				}else {
					doAddTask(req, res, project);
				}
			}
		);
	}else {
		sendJsonResponse(res, 404, {
			"message": "Not found, projectid required"
		});
	}
};

module.exports.tasksUpdateOne = function (req, res) {
	if (!req.params.projectid || !req.params.taskid) {
		sendJsonResponse(res, 404, {
			"message": "Not found, projectid and taskid are both required"
		});
		return;
	}
	Project
	.findById(req.params.projectid)
	.select('tasks')
	.exec(
		function (err, project) {
			var thisTask;
			if (!project) {
				sendJsonResponse(res, 404, {
					"message": "projectid not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			if (project.tasks && project.tasks.length > 0) {
				thisTask = project.tasks.id(req.params.taskid);
				if (!thisTask) {
					sendJsonResponse(res, 404, {
						"message": "taskid not found"
					});
				}else {
					thisTask.name = req.body.name;
					thisTask.startDate = req.body.startDate;
					thisTask.endDate = req.body.endDate;
					thisTask.done = req.body.done;
					project.save(function(err, project){
						if (err) {
							sendJsonResponse(res, 404, err);
						} else {
							sendJsonResponse(res, 200, thisTask);
						}
					});
				}
			} else {
				sendJsonResponse(res, 404, {
					"message": "No review to update"
				});
			}
		}
	);
};

module.exports.tasksDeleteOne = function (req, res) {
	if (!req.params.projectid || !req.params.taskid) {
		sendJsonResponse(res, 404, {
			"message": "Not found, projectid and taskid are both required"
		});
		return;
	}
	Project
	.findById(req.params.projectid)
	.select('tasks')
	.exec(
		function(err, project) {
			if (!project) {
				sendJsonResponse(res, 404, {
					"message": "projectid not found"
				});
				return;
			}else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			if (project.tasks && project.tasks.length > 0) {
				if (!project.tasks.id(req.params.taskid)) {
					sendJsonResponse(res, 404, {
						"message": "taskid not found"
					});
				}else {
					project.tasks.id(req.params.taskid).remove();
					project.save(function(err){
						if (err) {
							sendJsonResponse(res, 404, err);
						} else {
							sendJsonResponse(res, 204, null);
						}
					});
				}
			} else {
				sendJsonResponse(res, 404, {
					"message": "No task to delete"
				});
			}
		}
	);
};