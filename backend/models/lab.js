const mongoose = require('mongoose');

const labSchema = mongoose.Schema({
  labTitle: { type: String, required: true },
  labDesc: { type: String, required: true },
  labExamples: { type: String, required: true },
  labTestCases: { type: String, required: true},
  labStarter: { type: String, required: true },
});

module.exports = mongoose.model('Lab', labSchema);
