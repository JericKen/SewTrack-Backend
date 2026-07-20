const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const validate = require("../middleware/validate");
const {
    createProductSchema,
    updateProductSchema,
    productIdSchema
} = require("../validators/productValidator");

router.get(
    "/",
    productController.getProducts
)

router.post(
    "/",
    validate(createProductSchema),
    productController.createProduct
);

router.put(
    "/:id",
    validate(productIdSchema, "params"),
    validate(updateProductSchema),
    productController.updateProduct
);

router.delete(
    "/:id",
    validate(productIdSchema, "params"),
    productController.deleteProduct
);

module.exports = router;