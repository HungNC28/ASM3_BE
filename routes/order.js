const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const middleware = require("../customMiddleware/auth");

router.post("/create", middleware.currentUser, orderController.createOrder);
router.get("/get-all-order", middleware.currentUser, orderController.getAllOrder);
router.get("/get-order-by-id", middleware.currentUser, orderController.getOrderById);

module.exports = router;
