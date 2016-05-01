var express = require('express');
var router = express.Router();
var ctrlProjects = require('../controllers/projects');
var ctrlTasks = require('../controllers/tasks');

router.get('/projects', ctrlProjects.projectsList);
router.post('/projects', ctrlProjects.projectsCreate);
router.get('/projects/:projectid', ctrlProjects.projectsReadOne);
router.put('/projects/:projectid', ctrlProjects.projectsUpdateOne);
router.delete('/projects/:projectid', ctrlProjects.projectsDeleteOne);

router.get('/projects/:projectid/tasks', ctrlTasks.tasksList);
router.get('/projects/:projectid/tasks/:taskid', ctrlTasks.tasksReadOne);
router.post('/projects/:projectid/tasks', ctrlTasks.tasksCreate);
router.put('/projects/:projectid/tasks/:taskid', ctrlTasks.tasksUpdateOne);
router.delete('/projects/:projectid/tasks/:taskid', ctrlTasks.tasksDeleteOne);

module.exports = router;
