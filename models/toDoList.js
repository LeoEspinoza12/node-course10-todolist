const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  todolist: {
    type: String,
    required: true
  },
  status: {
    type: String,
    require: true
  }
}, {
  timestamps: true
});



var ToDoList = mongoose.model('ToDoList', todoSchema);

module.exports = ToDoList





