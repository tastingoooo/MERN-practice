const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("A request is coming to auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  //check user validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email has already been registered");
  }
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      meg: "success",
      saveObject: savedUser,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send("User not saved");
  }
});

router.post("/login", (req, res) => {
  //驗證密碼
  const { error } = loginValidation(req.body);
  if (error) {
    console.log("0");
    return res.status(400).send(error.details[0].message);
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("1");
      res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("User not found.");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
          //console.log("2:" + err);
          return res.status(400).send(err);
        }
        if (isMatch) {
          //登入成功把資料用JWT加密成TOKEN
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRCT);
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          console.log(err);
          res.status(401).send("Wrong password!");
        }
      });
    }
  });
});

module.exports = router;
