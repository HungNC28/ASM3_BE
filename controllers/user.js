const mongoose = require("mongoose");
const User = require("../models/User");
const Cart = require("../models/Cart");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const comparePassword = async (password, hashPassword) => {
	return await bcrypt.compare(password, hashPassword);
};

exports.signup = async (req, res, next) => {
	console.log(req.body);
	try {
		const reqData = req.body;
		const valid = validationResult(req);
		const hashPass = await bcrypt.hash(reqData.password, 12);
		// console.log("reqData:", reqData);
		if (valid.errors.length > 0) {
			console.log("valid:", valid);
			res.send(valid);
		} else {
			// console.log("hashPass:", hashPass);
			const newUser = new User({
				_id: new mongoose.Types.ObjectId(),
				email: reqData.email,
				fullname: reqData.fullname,
				phone: reqData.phone,
				password: hashPass,
				address: "",
			});
			const newCart = new Cart({
				userId: newUser._id,
				items: [],
				total: 0,
			});

			newUser.save();
			newCart.save();
			res.status(201).json({
				message: "User created successfully",
				token: newUser.signToken(),
			});
		}
	} catch (error) {
		return next(new Error(error));
	}
};

exports.login = async (req, res, next) => {
	try {
		const reqData = req.body;
		const valid = validationResult(req);
		if (valid.errors.length <= 0) {
			const foundUser = await User.findOne({ email: reqData.email }).select("email password role");
			if (foundUser) {
				const isEqual = await comparePassword(reqData.password, foundUser.password);
				if (isEqual) {
				
					res.send({
						userId: foundUser._id,
						role: foundUser.role,
						token: foundUser.signToken(),
					});
				} else {
					res.json({ msg: "Password wrong" });
				}
			}
		} else {
			res.send({ msg: "Email wrong" });
		}
	} catch (error) {
		return next(new Error(error));
	}
};

exports.logout = (req, res, next) => {
	try {
		res.header("Authorization", null);
		res.status(200).json({
			message: "You have successfully logged out",
		});
	} catch (error) {
		return next(new Error(error));
	}
};

exports.getUserInfo = async (req, res, next) => {
	const { user } = req;
	try {
		const foundUser = await User.findById(user._id);
		if (foundUser) {
			res.json(foundUser);
		} else {
			res.json({ msg: "User not found" });
		}
	} catch (error) {
		return next(new Error(error));
	}
};
