const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = `mongodb+srv://hungnc:Grhd411JftnN4dmP@cluster0.udsdb9i.mongodb.net/ecommerce-shop?retryWrites=true&w=majority`;

// const sessionStore = new mongoDBStore({
// 	uri: MONGODB_URI,
// 	collection: "sessions",
// 	expires: true,
// });

app.enable("trust proxy", 1);

app.use(
	cors({
		origin: true,
		// [
		//     "https://ecommerce-be-website.onrender.com",
		//     "http://localhost:3000",
		//     "http://localhost:3001",
		// ],
		methods: ["GET,POST,PUT,PATH,DELETE,OPTIONS"],
		credentials: true,
	})
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
	try {
		res.json({
			status: 200,
			msg: "GET DATA SUCCESS",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send("SERVER ERROR");
	}
});
app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute);
app.use("/cart", cartRoute);

app.use((error, req, res, next) => {
	console.log("=====================");
	console.log("ERROR HANDLER::", error);
	res.statusMessage = "Something go wrong";
	res.status(500).json(error);
});

mongoose
	.set("strictQuery", true)
	.connect(MONGODB_URI)
	.then(() => {
		console.log("connect success!!!");
		const server = app.listen(PORT);
		const io = require("./socket").init(server);
		io.on("connection", (socket) => {
			console.log("SOCKET IO CONNECTED");
		});
	})
	.catch((err) => console.log("mongoose connect err:", err));
