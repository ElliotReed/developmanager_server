const router = require("express").Router();
const { Op } = require("sequelize");

const db = require("../models");

/* GET project listing. */
router.get("/", async (req, res, next) => {
  console.log('req user: ', req.user);
  // console.log('projectheaders: ', req.headers);
  // const testId = '720f6285-ebf7-4f24-aee6-c26f54924e4f';
  try {
    const projects = await db.project.findAll({
      where: { userId: { [Op.eq]: req.user.id } },
      attributes: ["name", "id", "archive"],
      order: [["name", "ASC"]],
    });
    console.log('projects: ', projects);
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
router.get("/:projectId", async (req, res, next) => {
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

router.patch("/:projectId", async (req, res, next) => {
  const id = req.params.projectId;
  console.log("Body: ", req.body);
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

router.post("/", async (req, res, next) => {
  console.log("Headers: ", req.cookies);

  try {
    const project = await db.project.findOne({
      where: {
        name: { [Op.eq]: req.body.name },
      },
    });

    if (project) throw new Error("Project already exists");
    // const hashedPassword = await hash(password, 10);
    const newProject = await db.project.create(req.body);
    // const newUser = await db.user.create({ email: email, password: hashedPassword });
    res.status(201).send({ user: newProject });
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
  // console.log('User', user);
  // throw new Error('Broken');
  // res.cookie('userId', '743');
  // console.log('Cookies: ', req.cookies);
  // res.send({ message: 'user created' });
});

module.exports = router;
