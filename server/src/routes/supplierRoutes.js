const express = require("express");
const router = express.Router();

const supplierController = require("../controllers/supplierController");
const validate = require("../middleware/validate");
const {
    createSupplierSchema,
    updateSupplierSchema,
    supplierIdSchema,
} = require("../validators/supplierValidator");

router.get("/", supplierController.getSuppliers);

router.post(
    "/",
    validate(createSupplierSchema),
    supplierController.createSupplier
);

router.put(
    "/:id",
    validate(supplierIdSchema, "params"),
    validate(updateSupplierSchema),
    supplierController.updateSupplier
);

router.delete(
    "/:id",
    validate(supplierIdSchema, "params"),
    supplierController.archiveSupplier
);

module.exports = router;