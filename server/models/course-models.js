const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  id: { type: String },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  student: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Course", courseSchema);
