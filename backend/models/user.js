const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  isTeacher: { type: Boolean, required: true},
  classCode: { type: String, required: true},
  labs: { type: [{labId: String, completed: Boolean, progress: String}], required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
