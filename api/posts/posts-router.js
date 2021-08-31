const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await Posts.find();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving the posts",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Posts.findById(id);
    if (response) {
      res
        .status(200)
        .json({ id: id, title: response.title, contents: response.contents });
    } else {
      res.status(404).json({ message: "does not exist" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving the post",
    });
  }
});

router.post("/", (req, res) => {
  const newPost = req.body;

  if (!newPost.title || !newPost.contents) {
    res.status(400).json({ message: "provide name and bio" });
  } else {
    Posts.insert(newPost)
      .then((post) => {
        res.status(201).json({
          id: post.id,
          title: newPost.title,
          contents: newPost.contents,
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;

  if (!body.title || !body.contents) {
    res.status(400).json({ message: "provide title and contents" });
  } else {
    Posts.update(id, body)
      .then((post) => {
        if (post) {
          res
            .status(200)
            .json({ id: post, title: body.title, contents: body.contents });
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);
    const response = await Posts.remove(id);
    if (response) {
      res.status(200).json({ id, title: post.title, contents: post.contents });
    } else {
      res.status(404).json({ message: "Does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "no" });
  }
});

router.get('/:id/comments', async(req,res) => {
  const { id } = req.params;

  const post = await Posts.findById(id);

  if(post){
    Posts.findPostComments(id)
      .then((comments) => {
          res
            .status(200)
            .json(comments);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
    }
else {
  res
    .status(404)
    .json({ message: "The post with the specified ID does not exist" });
}
})

module.exports = router;
