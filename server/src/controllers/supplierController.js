const supplierService = require("../services/supplierService");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const createSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.createSupplier(req.body);

    return apiResponse.success(
        res,
        201,
        "Supplier created successfully.",
        supplier
    );
});

const getSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await supplierService.getSuppliers(req.query.search ?? "");

    return apiResponse.success(
        res,
        200,
        "Suppliers retrieved successfully.",
        suppliers
    );
});

const updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.updateSupplier(
        req.params.id,
        req.body
    );

    return apiResponse.success(
        res,
        200,
        "Supplier updated successfully.",
        supplier
    );
});

const archiveSupplier = asyncHandler(async (req, res) => {
    const supplier = await supplierService.archiveSupplier(req.params.id);

    return apiResponse.success(
        res,
        200,
        "Supplier removed successfully.",
        supplier
    );
});

module.exports = {
    createSupplier,
    getSuppliers,
    updateSupplier,
    archiveSupplier,
};
