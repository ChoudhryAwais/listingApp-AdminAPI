var express = require("express");
var router = express.Router();
var Admin = require("../models/adminM");
var randomString = require("random-string");
var auth = require("../midlleware/auth");
var Category = require("../models/category");
var Message = require("../models/messages");
router.post("/signup", async (req, res, next) => {
  try {
    const isfound = await Admin.findOne({ email: req.body.email });
    if (isfound) {
      return res.json({ msg: "User already exists" });
    } else {
      const admin = await Admin.create(req.body);
      res.json(admin);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const isfound = await Admin.findOne({ email: req.body.email });
    if (isfound) {
      if (req.body.password == isfound.password) {
        process.env.accesstoken = randomString({ length: 10 });
        return res.json({
          msg: "Login Successfully",
          token: process.env.accesstoken,
          id: isfound._id,
        });
      } else {
        return res.status(404).json({ msg: "Password is incorrect" });
      }
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/getinfo", auth, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.header("id")).select("-password");

    res.json(admin);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch("/updateprofile", auth, async (req, res, next) => {
  console.log(req.body);
  await Admin.findOneAndUpdate({ id: req.header("id") }, req.body);
  res.json({ msg: "Profile Updated" });
});
router.patch("/updatepassword", auth, async (req, res, next) => {
  try {
    console.log(req.body);
    const admin = await Admin.findById(req.header("id"));
    if (req.body.oldpassword == admin.password) {
      await Admin.findOneAndUpdate(
        { _id: req.header("id") },
        { password: req.body.newpassword }
      );
      res.json({ msg: "Password Updated" });
    } else {
      res.status(404).json({ msg: "old password is incorrect" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/category", async (req, res, next) => {
  try {
    const cat = await Category.create({ name: req.body.name });

    res.status(200).json({ msg: "Category Posted" });
  } catch (error) {
    return res.status(500).json({ msg:" err.message" });
  }
});

router.get("/category", auth, async (req, res, next) => {
  try {
    const cat = await Category.find({});

    res.status(404).json({ categories: cat });
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
});

router.get("/contactmessage", auth, async (req, res, next) => {
  try {
    const messages = await Message.find({});

    res.status(404).json(messages);
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
