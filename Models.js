const mongoose = require("mongoose");
const { UserSchema, PostSchema } = require("./Schemas");

const UserModel = mongoose.model("User", UserSchema);
const PostModel = mongoose.model("Post", PostSchema);

module.exports = {
    UserModel,
    PostModel,
};