const mongoose = require('mongoose');
const Lab = require('../models/lab');

const classSchema = mongoose.Schema({
  className: {type: String, required: true},
  teacherId: {type: String, required: true},
  labs: [{labId: String}],
  students: [String]
});


module.exports = mongoose.model('Class', classSchema);
