const express = require("express");
const { PostModel, UserModel } = require("../Models");
const router = express.Router();

router.post("/", (req, res) => {
    const { title, text, authorId } = req.body;
    const author = authorId

    const post = new PostModel({ title, text, author });
    post.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send("ok");
        }
    });
})
router.get("/", (req, res) => {
    PostModel.find({}, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
})
router.get("/:id", (req, res) => {
    const id = req.params.id;
    PostModel.findById(id, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    }); 
})
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    PostModel.findByIdAndDelete(id, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send("deleted");
        }
    });
})
router.put("/like", async (req, res) => {
    const { userId, postId } = req.body
    const post = await PostModel.findById(postId)
    let isLiked = false
    post.likes.forEach((el) => {
        if (el == userId) {
            return isLiked = true
        }
    })
    if (isLiked) {
        let index = post.likes.indexOf(userId)
        post.likes.splice(index, 1)
    } else {
        post.likes.push(userId)
    }
    post.save((err) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send("updated")
        }
    })
})
router.put("/change/:id", async (req, res) => {
    const id = req.params.id;
    const { title, text } = req.body;

    const post = await PostModel.findById(id)
    post.title = title
    post.text = text
    post.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("updated");
        }
    });
})

module.exports = router