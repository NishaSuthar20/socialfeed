const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CREATE POST
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    if (!text && !req.file) 
      return res.status(400).json({ message: 'Text or image required' });

    const post = await Post.create({
      author: req.user.id,
      username: req.user.username,
      text: text || '',
      image: req.file ? req.file.filename : '',
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL POSTS (Feed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LIKE / UNLIKE
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const username = req.user.username;
    const idx = post.likes.indexOf(username);
    if (idx === -1) post.likes.push(username);
    else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD COMMENT
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = { username: req.user.username, text: req.body.text };
    post.comments.push(comment);
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.username !== req.user.username)
      return res.status(403).json({ message: 'Not authorized' });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;