const User = require('../models/user');
const Lab = require('../models/lab');
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/signup",(req,res,next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10,)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        isTeacher: req.body.role === "teacher",
        classCode: String('null'),
        labs: [],
      });
      user.save().
        then(result => {
          res.status(201).json({message: "User signed up sucessfully", result: result});
        })
        .catch((err) => {
          res.status(401).json({message: 'Signup Failed'});
        });
    });
});

router.post("/lab",(req,res,next) => {
  User.findById(req.body.userId).then(user => {
    data = user.labs.filter(lab => lab.labId === req.body.labId)[0];

    if(data) {
      res.status(200).json({done: data.completed, progress: data.progress});
    } else {
      res.status(201).json(data);
    }
  })
});

router.post("/updateUserLab", (req, res, next) => {
  User.findById(req.body.userId).then(user => {
    let progress = req.body.progress;
    if (!progress) {
      user.labs.filter(lab => {
        if(lab.labId === req.body.labId) {
          progress = lab.progress;
        }
      });
    }
    console.log(req.body.done);
    user.labs = user.labs.filter(lab => lab.labId !== req.body.labId);
    user.labs.push({labId: req.body.labId, completed: req.body.done, progress: progress});

    User.updateOne({_id: req.body.userId}, user).then(result => {
      res.status(200).json({message: "Update success"});
    });
    //[{labId: String, completed: Boolean, progress: String}]
    /*
      Classroom.updateOne({_id: req.body.clssId}, classData).then(result => {
      res.status(200).json({message: "Updated Success", result: result});
    });
      const userLabData = {
        userId: localStorage.getItem('userId'),
        labId: labId,
        done: done,
        progress: progress,
      };
    */
  });
});

router.get("/:id",(req,res,next) => {
  User.findById(req.params.id).then(user => {
    res.status(200).json({isTeacher: user.isTeacher, classCode: user.classCode, email: user.email});
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email}).then(user => {
    if(!user) {
      return res.status(401).json({
        message: 'Auth Failed'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: 'Auth Failed'
      });
    }

    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      'secret_this_should_be_longer',
      {expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      id: fetchedUser._id,
      classId: fetchedUser.classCode
    });
  })
  .catch(err => {
    console.log("error");
    return res.status(401).json({
      message: 'Auth Failed'
    });

  });
});

module.exports = router;
