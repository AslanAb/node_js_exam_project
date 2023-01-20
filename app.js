const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/static", express.static(__dirname + "/public"));

mongoose.connect('mongodb+srv://admin:admin@cluster0.niiuuok.mongodb.net/?retryWrites=true&w=majority', (err) => {
    if (err) {
        console.log("mongodb err", err)
    } else {
        console.log("Server started, very good!")
        app.use("/users", userRouter);
        app.use("/posts", postRouter);
        app.listen(8090);
    }
});