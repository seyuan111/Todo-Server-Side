const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 4500;
require('dotenv').config();

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongodb connection successful"))
    .catch(err => console.log(err.message))

const mongooseSchema = new mongoose.Schema({
    tasks: String,
    description: String,
    date: String
})

const Post = mongoose.model("Post", mongooseSchema)

app.get("/posts", async(req,res) => {
    const posts = await Post.find()
    res.send(posts)
})

app.get("posts/:id", async(req,res) => {
    const posts = await Post.findById(req.params.id)
    res.send(posts)
})

app.post('/posts', async(req,res) => {
    const newPost = new Post(req.body)
    const savedPost = await newPost.save()
    res.send(savedPost)
})

app.put('/posts/:id', async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      // The 'new' option returns the updated document
  
      if (!updatedPost) {
        return res.status(404).send("Post not found");
      }
  
      res.send(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).send("Update failed");
    }
  });

app.delete("/posts/:id", async(req,res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.status(200).send("Successfully deleted post")
})

app.listen(PORT, console.log(`Server running on port ${PORT}`))