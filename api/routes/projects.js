const projectRouter = require("express").Router();

const db = require("../../models");
const { Op } = require("sequelize");

/* GET project listing. */
projectRouter.get("/", async (req, res, next) => {
  console.log("req.user: ", req.user);
  try {
    const projects = await db.project.findAll({
      where: { userId: { [Op.eq]: req.user.id } },
      attributes: ["name", "id", "archive", "createdAt", "updatedAt"],
      order: [["name", "ASC"]],
    });

    if (!projects) throw new Error("No projects have been found");

    res.send(projects);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

/* GET project */
projectRouter.get("/:projectId", async (req, res, next) => {
  const id = req.params.projectId;
  try {
    const project = await db.project.findOne({
      where: {
        id: { [Op.eq]: id },
      },
    });

    if (!project) throw new Error("Project not found");

    res.status(200).send(project);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

projectRouter.patch("/:projectId", async (req, res, next) => {
  console.log("patch req");
  const id = req.params.projectId;
  try {
    const project = await db.project.findOne({
      where: {
        id: { [Op.eq]: id },
      },
    });
    project.update(req.body);
    res.status(200).send(project);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

projectRouter.post("/", async (req, res, next) => {
  const projectWithUser = { userId: req.user.id, ...req.body };
  console.log("projectWithUser: ", projectWithUser);
  try {
    const project = await db.project.findOne({
      where: {
        name: { [Op.eq]: req.body.name },
      },
    });

    if (project) throw new Error("Project already exists");
    const newProject = await db.project.create(projectWithUser);
    res.status(201).send(newProject);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

projectRouter.delete("/:projectId", async (req, res, next) => {
  const id = req.params.projectId;
  console.log("id: ", id);
  try {
    const project = await db.project.findOne({
      where: {
        id: { [Op.eq]: id },
      },
    });

    if (!project) throw new Error("Project doesn't exist");
    await project.destroy();
    res.status(200).send(id);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

module.exports = projectRouter;
