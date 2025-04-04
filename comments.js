//create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Comment = require('./models/comment'); // Import the Comment model
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/comments';
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
// Define the Comment model
const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
});
const Comment = mongoose.model('Comment', commentSchema);
// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Comment API');
});
app.post('/comments', async (req, res) => {
  const { name, email, comment } = req.body;
  const newComment = new Comment({ name, email, comment });
  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
});
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});
app.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});
app.put('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, comment } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, { name, email, comment }, { new: true });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Export the app for testing
module.exports = app;
// Export the Comment model for testing
module.exports.Comment = Comment;
// Export the mongoose connection for testing
module.exports.mongoose = mongoose;
// Export the server for testing
module.exports.server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Export the server for testing     