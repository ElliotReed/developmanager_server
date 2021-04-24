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
    s;
  }
});

module.exports = taskRouter;
