const Product = require("../models/Product");

exports.getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        return next(new Error(error));
    }
};

exports.getProductDetail = async (req, res, next) => {
    try {
        const id = req.query.id;
        // console.log("id:", id);
        const detail = await Product.findById(id);
        // console.log("detail:", detail);
        if (detail != null) {
            res.json(detail);
        } else {
            res.send({ msg: "product not found" });
        }
    } catch (error) {
        return next(new Error(error));
    }
};
