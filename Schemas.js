const { Schema } = require("mongoose")

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    followers: []
});

const PostSchema = new Schema({
    title: String,
    text: String,
    author: String,
    likes: []
});

module.exports = {
    UserSchema,
    PostSchema
};