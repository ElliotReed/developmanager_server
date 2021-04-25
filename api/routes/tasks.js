const taskRouter = require("express").Router();

const db = require("../../models");
const { Op } = require("sequelize");

taskRouter.get("/", async (req, res, next) => {
  try {
    const tasks = await db.task.findAll({
      where: { userId: { [Op.eq]: req.user.id } },
      order: [["completedDate", "ASC"]],
    });

    if (!task) throw new Error("No tasks were found!");

    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

taskRouter.post("/", (req, res, next) => {
  console.log("Task post route hit");
  res.status(201).send({ message: "A task was created" });
});

module.exports = taskRouter;
