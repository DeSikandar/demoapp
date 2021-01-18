const mongoose = require('mongoose');
const schema = mongoose.Schema;

const employeeSchema = schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Employee', employeeSchema);
