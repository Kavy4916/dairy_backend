import Goal from "../models/goalModel.js";
import {
  getLocaleDate,
  logout,
  handleUnknownError,
  handleFetalError,
} from "../utils.js";

const create = async (req, res) => {
  const username = req.username;
  const offset = req.body.offset;
  const score = req.body.score;
  const goal = req.body.goal;
  const deadline = req.body.deadline;

  if ((!offset && offset != 0) || offset > 840 || offset < -720) {
    handleFetalError(res);
  } else {
    const today = getLocaleDate(offset);
    if (!score || !goal || !deadline) {
      res.status(200).send({
        code: 202,
        message: "All fields must be filled!",
      });
    } else if (goal.length > 200 || goal.length < 10) {
      res.status(200).send({
        code: 202,
        message: "Length of goal should be from 10 to 200.",
      });
    } else if (score < 1 || score > 10) {
      res
        .status(200)
        .send({ code: 202, message: "Score should be from 1 to 10." });
    } else if (deadline.length !== 10 || deadline < today) {
      res.status(200).send({ code: 202, message: "Invalid Deadline." });
    } else {
      const newGoal = {
        goal,
        score,
        status: false,
        deadline,
        username: username,
        remark: null,
      };
      try {
        const goal = await Goal.create(newGoal);
        res
          .status(200)
          .send({ code: 200, goal, message: "Goal created successfully!" });
      } catch (error) {
        handleUnknownError(error, res);
      }
    }
  }
};

const goalCheck = async (req, res) => {
  const username = req.username;
  const offset = req.body.offset;
  const _id = req.body._id;
  const status = req.body.status;
  if (
    (!offset && offset != 0) ||
    offset > 840 ||
    offset < -720 ||
    !_id ||
    !(status === true || status === false)
  ) {
    handleFetalError(res);
  } else {
    try {
      const goal = await Goal.findOne({ _id });
      if (goal) {
        const today = getLocaleDate(offset);
        const yesterday =
          today.split("-")[0] +
          "-" +
          today.split("-")[1] +
          "-" +
          (parseInt(today.split("-")[2]) - 1);
        if (goal.username === username && (goal.deadline === today || goal.deadline === yesterday)) {
          await Goal.updateOne({ _id: _id }, { $set: { status } });
          res.status(200).send({ code: 200});
        } else {
          handleFetalError(res);
        }
      } else {
        handleFetalError(res);
      }
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

const todayGoal = async (req, res) => {
  const username = req.username;
  const offset = req.query.offset;
  if ((!offset && offset != 0) || offset > 840 || offset < -720) {
    handleFetalError(res);
  } else {
    const today = getLocaleDate(offset);
    try {
      const goals = await Goal.find()
        .where("deadline")
        .equals(today)
        .where("username")
        .equals(username);
      res.status(200).send({ code: 200, goals });
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

const dateGoal = async (req, res) => {
  const username = req.username;
  const date = req.query.date;
  if (date > "2030-12-31" || date <  "2024-10-01") {
    handleFetalError(res);
  } else {
    try {
      const goals = await Goal.find()
        .where("deadline")
        .equals(date)
        .where("username")
        .equals(username);
      res.status(200).send({ code: 200, goals });
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

const yesterdayGoal = async (req, res) => {
  const username = req.username;
  const offset = req.query.offset;
  if ((!offset && offset != 0) || offset > 840 || offset < -720) {
    handleFetalError(res);
  } else {
    const today = getLocaleDate(req.query.offset);
    const yesterday =
      today.split("-")[0] +
      "-" +
      today.split("-")[1] +
      "-" +
      (parseInt(today.split("-")[2]) - 1);
    try {
      const goals = await Goal.find()
        .where("deadline")
        .equals(yesterday)
        .where("username")
        .equals(username);
      if (goals.length === 0)
        res.status(200).send({
          code: 201,
          path: "/",
          message: "No goals were set for Yesterday!",
        });
      else res.status(200).send({ code: 200, goals });
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

const getGoal = async (req, res) => {
  const username = req.username;
  const _id = req.query._id;
  if (!_id) {
    handleFetalError(res);
  } else {
    try {
      const goal = await Goal.findOne({ _id: _id });
      if (!goal) {
        res.status(200).send({ code: 201, message: "Bad Request!", path: -1 });
      } else {
        if (goal.username !== username) {
          handleFetalError(res);
        } else {
          res.status(200).send({ code: 200, goal });
        }
      }
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

const editGoal = async (req, res) => {
  const username = req.username;
  const _id = req.body._id;
  const offset = req.body.offset;
  const remark = req.body.remark;
  const goal = req.body.goal;
  const score = req.body.score;
  const deadline = req.body.deadline;
  const status = req.body.status;
  if (
    (!offset && offset != 0) ||
    offset > 840 ||
    offset < -720 ||
    status === false ||
    status === true ||
    !_id
  ) {
    handleFetalError(res);
  } else {
    try {
      const oldGoal = await Goal.findOne({ _id: _id });
      if (!oldGoal) {
        res.status(200).send({ code: 201, message: "Bad Request!", path: -1 });
      } else {
        if (oldGoal.username !== username) {
          handleFetalError(res);
        } else {
          const today = getLocaleDate(offset);
          if (oldGoal.deadline > today) {
            if (remark) handleFetalError(res);
            else {
              if (!score || !goal || !deadline) {
                res.status(200).send({
                  code: 202,
                  message: "All fields must be filled!",
                });
              } else {
                if (goal.length > 200 || goal.length < 10) {
                  res.status(200).send({
                    code: 202,
                    message: "Length of goal should be from 10 to 200.",
                  });
                } else {
                  if (score < 1 || score > 10) {
                    res.status(200).send({
                      code: 202,
                      message: "Score should be from 1 to 10.",
                    });
                  } else {
                    if (deadline.length !== 10 || deadline < today) {
                      res
                        .status(200)
                        .send({ code: 202, message: "Invalid Deadline." });
                    } else {
                      await Goal.updateOne(
                        { _id: _id },
                        { $set: { goal, score, deadline } }
                      );
                      res.status(200).send({
                        code: 201,
                        message: "Updated Successfully!",
                        path: -1,
                      });
                    }
                  }
                }
              }
            }
          } else if (oldGoal.deadline < today) {
            if (goal || deadline || score) handleFetalError(res);
            else {
              if (!remark || remark.length < 10 || remark.length > 100) {
                res.status(200).send({
                  code: 202,
                  message: "Length of remark should be from 10 to 100.",
                });
              } else {
                await Goal.updateOne({ _id: _id }, { remark });
                res.status(200).send({
                  code: 201,
                  message: "Updated Successfully!",
                  path: -1,
                });
              }
            }
          } else if (oldGoal.deadline === today) {
            if (!score || !goal || !deadline) {
              res.status(200).send({
                code: 202,
                message: "All fields must be filled!",
              });
            } else {
              if (goal.length > 200 || goal.length < 10) {
                res.status(200).send({
                  code: 202,
                  message: "Length of goal should be from 10 to 200.",
                });
              } else {
                if (score < 1 || score > 10) {
                  res.status(200).send({
                    code: 202,
                    message: "Score should be from 1 to 10.",
                  });
                } else {
                  if (deadline.length !== 10 || deadline < today) {
                    res
                      .status(200)
                      .send({ code: 202, message: "Invalid Deadline." });
                  } else {
                    if (remark && (remark.length < 10 || remark.length > 100)) {
                      res.status(200).send({
                        code: 202,
                        message: "Length of remark should be from 10 to 100.",
                      });
                    } else {
                      if (remark)
                        await Goal.updateOne(
                          { _id: _id },
                          { $set: { goal, score, deadline, remark } }
                        );
                      else
                        await Goal.updateOne(
                          { _id: _id },
                          { $set: { goal, score, deadline } }
                        );
                      res.status(200).send({
                        code: 201,
                        message: "Updated Successfully!",
                        path: -1,
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

const deleteGoal = async (req, res) => {
  const _id = req.body._id;
  const offset = req.body.offset;
  if (!_id || (!offset && offset != 0) || offset > 840 || offset < -720) {
    handleFetalError(res);
  } else {
    try {
      const goal = await Goal.findOne({ _id: _id });
      if (goal) {
        const today = getLocaleDate(offset);
        if (goal.username != req.username && goal.deadline < today) {
          handleFetalError(res);
        } else {
          await Goal.deleteOne({ _id: req.body._id });
          res.status(200).send({
            code: 201,
            message: "Deleted Successfully!",
            path: -1,
          });
        }
      }
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};
export {
  create,
  goalCheck,
  todayGoal,
  yesterdayGoal,
  getGoal,
  editGoal,
  deleteGoal,
  dateGoal
};
