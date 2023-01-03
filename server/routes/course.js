const { course } = require(".");

const router = require("express").Router();
const coureseValidation = require("../validation").coureseValidation;
const Course = require("../models").courseModel;

router.use((req, res, next) => {
  console.log("A request coming to course.js");
  next();
});

router.get("/", (req, res) => {
  Course.find({})
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch((err) => {
      res.status(500).send("ERROR! Cannot get course.");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((d) => {
      res.send(d);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post("/", async (req, res) => {
  //確認課程資料是否有效
  const { error } = coureseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let { title, description, price } = req.body;
  if (req.user.isStudent()) {
    return res.status(400).send("Only instructor can post course");
  }
  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });
  try {
    await newCourse.save();
    res.status(200).send("New course has been saved");
  } catch (err) {
    console.log(err);
    res.status(400).send("Cant save course");
  }
});

router.get("/instructor/:_instructor_id", (req, res) => {
  let { _instructor_id } = req.params;
  Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send("找不到資料");
    });
});

router.get("/student/:_student_id", (req, res) => {
  let { _student_id } = req.params;
  Course.find({ student: _student_id })
    .populate("instructor", ["username", "email"])
    .then((courses) => {
      res.send(courses);
    })
    .catch(() => {
      res.status(500).send("找不到資料");
    });
});

router.get("/find/:name", (req, res) => {
  let { name } = req.params;
});

router.patch("/:_id", async (req, res) => {
  const { error } = coureseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course nor found.",
    });
  }
  //console.log(course.instructor === req.user._id);
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course Updated");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    res.json({
      success: false,
      message: "You are not instructor",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course nor found.",
    });
  }
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send("Course deleted");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    res.json({
      success: false,
      message: "You are not instructor",
    });
  }
});

module.exports = router;
