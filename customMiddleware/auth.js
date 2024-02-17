// exports.currentUser = (req, res, next) => {
// 	const reqCookie = req.headers.cookie;
// 	console.log("reqCookie111111111111", reqCookie);
// 	const userId = reqCookie.split(";")[1].split("=")[1];

// 	const token = reqCookie.split(";")[0].split("=")[1];

// 	if (req.session && userId && token) {
// 		return next();
// 	} else {
// 		var err = new Error("You must be logged in to view this page.");
// 		err.status = 401;
// 		return next(err);
// 	}
// };

const { verifyJWT } = require("../utils/jsonwebtoken");

const currentUser = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			throw new Error();
		}
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			throw new Error();
		}
		const decoded = await verifyJWT(token);
		if (!decoded) {
			throw new Error();
		}
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({
			message: "Invalid token",
		});
	}
};

module.exports = { currentUser };
