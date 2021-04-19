const exspress = require('express');
const Lab = require('../models/lab');
const Classroom = require('../models/class');
const User = require('../models/user');
const router = exspress.Router();

router.get("/:id", (req,res,next) => {
  Classroom.findById(req.params.id).then(classData => {
    res.status(200).json({className: classData.className, labs: classData.labs, students: classData.students});
  })
  .catch(err => {
    res.status(401).json({message: 'Not valid class'});
  });
})

router.post("/create",(req, res, next) => {
  const classData = new Classroom({
    className: req.body.className,
    teacherId: req.body.teacherId,
    labs: [],
    students: []
  });
  classData.save().then(result => {
    res.status(200).json({message: "Classroom Created!", result: result});
    bindToClass(req.body.teacherId, result._id);
  })
});

router.post("/join",(req,res,next) => {
  bindToClass(req.body.userId,req.body.classId, res);
  res.status(200).json({meesage: 'Joined class'});
});

router.post("/addlab", (req,res,next) => {
  Classroom.findById(req.body.classId).then(classData => {
    classData.labs.push(req.body.labId);

    Classroom.updateOne({_id: req.body.classId}, classData).then(result => {
      res.status(200).json({message: "Updated Success", result: result});
    });
  });
});

function bindToClass(userId, classId, res) {
  User.findById(userId).then(user => {
    const newUser = new User({
      _id: userId,
      email: user.email,
      password: user.password,
      isTeacher: user.isTeacher,
      classCode: String(classId)
    });
    User.updateOne({_id: userId}, newUser).then(result => {
    });

    Classroom.findById(classId).then(classData => {
      classData.students.push(userId);
      console.log(classData);
      Classroom.updateOne({_id: classId}, classData).then(result => {
        console.log(result);
      });
    });
  })
  .catch(err => {
    res.status(401).json({message: "Join Fail"});
  });

}

module.exports = router;

