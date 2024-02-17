const jwt = require("jsonwebtoken");

const createJWT = (_id, email, role) => {
	return jwt.sign({ _id, email, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const verifyJWT = (token) => {
	return new Promise((resolve, reject) => {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			resolve(decoded);
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = { createJWT, verifyJWT };
