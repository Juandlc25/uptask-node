const Projects = require("../models/Projects");
const Tasks = require("../models/Tasks");
// const slug = require("slug");

exports.home = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({ where: { userId } });
  res.render("index", {
    name: "Projects",
    projects,
  });
};

exports.projectForm = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({ where: { userId } });
  res.render("newProject", { name: "New Project", projects });
};

exports.newProject = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({ where: { userId } });
  const { name } = req.body;
  let errors = [];
  if (!name) {
    errors.push({ text: "Please enter a name" });
  }
  if (errors.length > 0) {
    res.render("newProject", { projects, name: "New Project", errors });
  } else {
    // Projects.create({ name })
    //   .then(() => console.log("successfully saved"))
    //   .catch((err) => console.log(err));
    // const url = slug(name).toLocaleLowerCase();
    const userId = res.locals.user.id;
    await Projects.create({ name, userId });
    res.redirect("/");
  }
};

exports.project = async (req, res, next) => {
  const userId = res.locals.user.id;
  const projectsPromise = Projects.findAll({ where: { userId } });
  const projectPromise = Projects.findOne({
    where: { url: req.params.url, userId },
  });
  const [projects, project] = await Promise.all([
    projectsPromise,
    projectPromise,
  ]);
  const tasks = await Tasks.findAll({
    where: { projectId: project.id },
    include: [{ model: Projects }],
  });
  if (!project) return next();
  res.render("task", { name: "Project task", project, projects, tasks });
};

exports.editProject = async (req, res, next) => {
  const userId = res.locals.user.id;
  const projectsPromise = Projects.findAll({ where: { userId } });
  const projectPromise = Projects.findOne({
    where: { id: req.params.id, userId },
  });
  const [projects, project] = await Promise.all([
    projectsPromise,
    projectPromise,
  ]);
  res.render("newProject", { name: "Edit project", projects, project });
};

exports.updateProject = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll({ where: { userId } });
  const { name } = req.body;
  let errors = [];
  if (!name) {
    errors.push({ text: "Please enter a name" });
  }
  if (errors.length > 0) {
    res.render("newProject", { projects, name: "New Project", errors });
  } else {
    await Projects.update({ name }, { where: { id: req.params.id } });
    res.redirect("/");
  }
};

exports.deleteProject = async (req, res, next) => {
  const { urlProject } = req.query;
  const result = await Projects.destroy({ where: { url: urlProject } });
  if (!result) {
    return next();
  }
  res.status().send("Your project has been deleted.");
};
