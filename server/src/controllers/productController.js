const productService = require("../services/productService");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const getProducts = asyncHandler(async (req, res) => {

    const products = await productService.getProducts();

    return apiResponse.success(
        res,
        200,
        "Products retrieve successfully.",
        products
    );
    
});

const createProduct = asyncHandler(async (req, res) => {

    const product = await productService.createProduct(req.body);

    return apiResponse.success(
        res,
        201,
        "Product created successfully.",
        product
    );

});

const updateProduct = asyncHandler(async (req, res) => {

    const product = await productService.updateProduct(
        req.params.id,
        req.body
    );

    return apiResponse.success(
        res,
        200,
        "Product updated successfully.",
        product
    );

});

const deleteProduct = asyncHandler(async (req, res) => {

    const product = await productService.deleteProduct(req.params.id);

    return apiResponse.success(
        res,
        200,
        "Product deleted successfully.",
        product
    );

});

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};