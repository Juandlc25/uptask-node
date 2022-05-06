const Projects = require("../models/Projects");
const Tasks = require("../models/Tasks");

exports.addTask = async (req, res, next) => {
  const project = await Projects.findOne({ where: { url: req.params.url } });
  const { task } = req.body;
  const state = 0;
  const projectId = project.id;

  const result = await Tasks.create({ task, state, projectId });
  if (!result) next();
  res.redirect(`/projects/${req.params.url}`);
};

exports.updateTaskState = async (req, res, next) => {
  const { id } = req.params;
  const task = await Tasks.findOne({ where: { id } });

  let state = 0;
  if (task.state === state) {
    state = 1;
  }
  task.state = state;
  const result = await task.save();
  if (!result) return next();
  res.status(200).send("Updated!");
};

exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  const result = await Tasks.destroy({ where: { id } });
  if (!result) return next();
  res.status(200).send("Removed!");
};
