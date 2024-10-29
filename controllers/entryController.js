import Entry from "../models/entryModel.js";
import { logout } from "../utils.js";
import { handleFetalError, handleUnknownError } from "../utils.js";

const getPage = async (req, res) => {
  const username = req.username;
  if (!req.query.page) {
    handleFetalError(res);
  } else {
    const page = parseInt(req.query.page);
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
      const entries = await Entry.find()
        .where("username")
        .equals(username)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
      const count = await Entry.countDocuments()
        .where("username")
        .equals(username);
      res.status(200).send({ code: 200, entries, count, page });
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

const create = async (req, res) => {
  const username = req.username;
  const title = req.body.title;
  const content = req.body.content;

  if (!title || !content) {
    res = logout(res);
    res
      .status(200)
      .send({ code: 202, message: "All fields must be filled!" });
  } else {
    if (title.length > 80 || title.length < 10) {
      res.status(200).send({
        code: 202,
        message: "Length of title should be from 10 to 80",
      });
    } else if (content.length > 300 || content.length < 30) {
      res.status(200).send({
        code: 202,
        message: "Length of content should be from 30 to 300",
      });
    } else {
      const newEntry = { title, content, username };
      try {
        const entry = await Entry.create(newEntry);
        res
          .status(200)
          .send({ code: 200, message: "Entry created successfully!", entry });
      } catch (error) {
        handleUnknownError(error, res);
      }
    }
  }
};

const getEntry = async (req, res) => {
  const username = req.username;
  const _id = req.params._id;
  if (!_id) {
    handleFetalError(res);
  } else {
    try {
      const entry = await Entry.findOne({ _id: _id });
      if (entry) {
        if ((entry.username = req.username)) {
          res.status(200).send({ code: 200, entry });
        } else {
          handleFetalError();
        }
      } else {
        res
          .status(200)
          .send({ code: 201, message: "Bad Request!", path: -1 });
      }
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

const editEntry = async (req, res) => {
  const _id = req.body._id;
  const title = req.body.set?.title;
  const content = req.body.set?.content;

  if (!_id || !title || !content) {
   handleFetalError(res);
  } else {
    if (title.length > 80 || title.length < 10) {
      res.status(200).send({
        code: 202,
        message: "Length of title should be from 10 to 80",
      });
    } else if (content.length > 300 || content.length < 30) {
      res.status(200).send({
        code: 202,
        message: "Length of content should be from 30 to 300",
      });
    } else {
      try {
        const entry = await Entry.findOne({ _id: _id });
        if (entry) {
          if ((entry.username = req.username)) {
            await Entry.updateOne(
              { _id: req.body._id },
              { $set: { title, content } }
            );
            res.status(200).send({
              code: 201,
              message: "Updated Successfully!",
              path: -1,
            });
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
  }
};

const deleteEntry = async (req, res) => {
  const _id = req.body._id;
  if (!_id) {
    handleFetalError
  } else {
    try {
      const entry = await Entry.findOne({ _id: _id });
      if (entry) {
        if ((entry.username = req.username)) {
          await Entry.deleteOne({ _id: req.body._id });
          res.status(200).send({
            code: 201,
            message: "Deleted Successfully!",
            path: -1,
          });
        } else {
         handleFetalError(res);
        }
      } else {
        res
          .status(200)
          .send({ code: 201, message: "Bad Request!", path: -1 });
      }
    } catch (error) {
      handleUnknownError(error, res);
    }
  }
};

export { create, getPage, getEntry, editEntry, deleteEntry };
