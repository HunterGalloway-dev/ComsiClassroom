const Lab = require('../models/lab');
const express = require("express");
const checkAuth = require('../middleware/check-auth')

const router = express.Router();

router.post("",checkAuth,(req,res,next) => {
  const lab = new Lab({
    labTitle: req.body.labName,
    labDesc: req.body.labDesc,
    labExamples: req.body.labExamples,
    labTestCases: req.body.labTestCases,
    labStarter: req.body.starterCode
  });
  lab.save().then(createdLab => {
    res.status(201).json({
      message: "Lab Added Successfully",
      lab: {
        ...createdLab,
        id: createdLab._id
      }
    });
  })
  .catch(error => {
    console.log(error);
  });
})
/*
  const postSchema = mongoose.Schema({
  labTitle: { type: String, required: true },
  labDesc: { type: String, required: true },
  labExamples: { type: String, required: true },
  labStarter: { type: String, required: true },
});
*/

router.delete("/:id", checkAuth,(req,res,next) => {
  Lab.deleteOne({_id: req.params.id}).then(result => {
  });
})

router.put("/:id",checkAuth,(req,res,next) => {
  const lab = new Lab({
    _id: req.body.id,
    labTitle: req.body.labName,
    labDesc: req.body.labDesc,
    labExamples: req.body.labExamples,
    labTestCases: req.body.labTestCases,
    labStarter: req.body.starterCode
  });

  Lab.updateOne({_id: req.params.id}, lab).then(result => {
    res.status(200).json({message: "Update Successful"});
  });
});

router.get("",(req,res,next) => {
  Lab.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      labs: documents
    });
  });
})

router.get("/:id",(req,res,next) => {
  Lab.findById(req.params.id).then(lab => {
    if(lab) {
      res.status(200).json(lab);
    }
  });
});


module.exports = router;
