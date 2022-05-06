const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

module.exports = function () {
  router.get("/", authController.authenticate, projectController.home);
  // Projects
  router.get(
    "/new-project",
    authController.authenticate,
    projectController.projectForm
  );
  router.post(
    "/new-project",
    authController.authenticate,
    body("name").not().isEmpty().trim().escape(),
    projectController.newProject
  );
  router.get(
    "/projects/:url",
    authController.authenticate,
    projectController.project
  );
  router.get(
    "/project/edit/:id",
    authController.authenticate,
    projectController.editProject
  );
  router.post(
    "/new-project/:id",
    authController.authenticate,
    body("name").not().isEmpty().trim().escape(),
    projectController.updateProject
  );
  router.delete(
    "/projects/:url",
    authController.authenticate,
    projectController.deleteProject
  );

  // Tasks
  router.post(
    "/projects/:url",
    authController.authenticate,
    taskController.addTask
  );
  router.patch(
    "/tasks/:id",
    authController.authenticate,
    taskController.updateTaskState
  );
  router.delete(
    "/tasks/:id",
    authController.authenticate,
    taskController.deleteTask
  );

  // Users
  router.get("/sign-up", userController.signUp);
  router.post("/sign-up", userController.createAccount);
  router.get("/confirm/:email", userController.confirmAccount);

  // Auth
  router.get("/sign-in", userController.signIn);
  router.post("/sign-in", authController.authUser);

  router.get("/log-out", authController.logOut);

  router.get("/reset", userController.reset);
  router.post("/reset", authController.sendToken);
  router.get("/reset/:token", authController.validToken);
  router.post("/reset/:token", authController.updatePassword);

  return router;
};
