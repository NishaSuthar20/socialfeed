const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String },
  image: { type: String },   
  likes: [{ type: String }], 
  comments: [{
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]

  
}, { timestamps: true });



module.exports = mongoose.model('Post', postSchema);