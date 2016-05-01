var mongoose = require('mongoose');
var Project = mongoose.model('Project');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.projectsList = function (req, res) { 
	Project.find({})
	.exec(function (err, projects) {
		sendJsonResponse(res, 200, projects);
	});
};

module.exports.projectsCreate = function (req, res) {
	Project.create({
		name: req.body.name,
		description: req.body.description,
		categories: req.body.categories
	}, function (err, project){
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 201, project);
		}
	});
};

module.exports.projectsReadOne = function (req, res) {
	if (req.params && req.params.projectid) {
		Project.findById(req.params.projectid)
		.exec(function (err, project) {
			if (!project) {
				sendJsonResponse(res, 404, {
					"message": "projectid not found"
				});
				console.log("projectid not found");
				return;
			} else if (err) {
				sendJsonResponse(res, 404, err);
				console.log(err);
				return;
			}
			sendJsonResponse(res, 200, project);
		});
	} else {
		sendJsonResponse(res, 404, {
			"message": "No projectid in request"
		});
		console.log("No projectid in request");
	}
};

module.exports.projectsUpdateOne = function (req, res) {
	if (!req.params.projectid) {
		sendJsonResponse(res, 404, {
			"message": "Not found, projectid is required"
		});
		return;
	}

	Project
		.findById(req.params.projectid)
		.exec(
			function (err, project) {
				if (!project) {
					sendJsonResponse(res, 400, {
						"message": "projectid not found"
					});
					return;
				}
				project.name = req.body.name;
				project.description = req.body.description;
				project.categories = req.body.categories;
				project.save(function (err, project){
					if (err) {
						sendJsonResponse(res, 404, err);
					} else {
						sendJsonResponse(res, 200, project);
					}
				});
			});

};

module.exports.projectsDeleteOne = function (req, res) {
	var projectid = req.params.projectid;
	if (projectid) {
		Project
			.findByIdAndRemove(projectid)
			.exec(function (err, project) {
				if (err) {
					sendJsonResponse(res, 404, err);
					return;
				}
				sendJsonResponse(res, 204, null);
			});
	} else {
		sendJsonResponse(res, 404, {
			"message": "No projectid"
		});
	}
};