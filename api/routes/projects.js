const projectRouter = require("express").Router();

const { Op } = require("sequelize");
const db = require("../../models");

/* GET project listing. */
projectRouter.get("/", async (req, res, next) => {
  console.log("req.user: ", req.user);
  try {
    const projects = await db.project.findAll({
      where: { userId: { [Op.eq]: req.user.id } },
      attributes: ["name", "id", "archive"],
      order: [["name", "ASC"]],
    });
    if (!projects) throw new Error("No projects have been found");

    const response = projects.map((project) => {
      return {
        id: project.id,
        name: project.name,
      };
    });
    res.send(response);
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
  const id = req.params.projectId;
  try {
    const project = await db.project.findOne({
      where: {
        id: { [Op.eq]: id },
      },
    });
    project.update(req.body);
    res.status(200).send({ message: "Update successfull" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

projectRouter.post("/", async (req, res, next) => {
  try {
    const project = await db.project.findOne({
      where: {
        name: { [Op.eq]: req.body.name },
      },
    });

    if (project) throw new Error("Project already exists");
    const newProject = await db.project.create(req.body);
    res.status(201).send({ user: newProject });
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
});

module.exports = projectRouter;
