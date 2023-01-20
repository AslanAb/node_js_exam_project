const express = require("express");
const { UserModel } = require("../Models");
const router = express.Router();

router.post("/", (req, res) => {
    const { name, surname, email, password } = req.body;

    const newUser = new UserModel({ name, surname, email, password });
    newUser.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send("ok");
        }
    });
})

router.get("/", (req, res) => {
    UserModel.find({}, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
})

router.get("/:id", (req, res) => {
    const id = req.params.id;
    UserModel.findById(id, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

router.put("/change/:id", async (req, res) => {
    const id = req.params.id;
    const { name, surname, email } = req.body;
    const user = await UserModel.findById(id)
    user.name = name
    user.surname = surname
    user.email = email
    user.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send("updated");
        }
    });
})

router.put("/follow/:id", async (req, res) => {
    const id = req.params.id;
    const { localUserId } = req.body
    const user = await UserModel.findById(id)
    user.followers.push(localUserId)
    user.save(((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send("updated");
        }
    }))
})

router.get("/followed/:id/:userid", async (req, res) => {
    const id = req.params.id
    const userId = req.params.userid
    const user = await UserModel.findById(id)
    let followed = false
    user.followers.forEach((el) => {
        if (el == userId) {
            followed = true
        }
    })
    res.status(200).send(followed)
});

router.put("/unfollow/:id", async (req, res) => {
    const id = req.params.id;
    const { localUserId } = req.body
    const user = await UserModel.findById(id)
    const userIndex = user.followers.indexOf(localUserId)
    user.followers.splice(userIndex, 1)
    user.save(((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send("updated");
        }
    }))
})

module.exports = router