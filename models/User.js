const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createJWT } = require("../utils/jsonwebtoken");

const userSchema = new Schema({
	fullname: { type: String, require: true },
	email: {
		type: String,
		required: true,
	},
	phone: { type: String, require: true },
	address: { type: String, require: false },
	password: { type: String, require: true },
	role: {
		type: String,
		enum: ["customer", "admin", "consultant"],
		default: "customer",
	},
});

userSchema.methods.signToken = function () {
	const token = createJWT(this._id, this.email, this.role);
	return token;
};

module.exports = mongoose.model("User", userSchema);
