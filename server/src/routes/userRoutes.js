const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");

const {

    createUserSchema,
    updateUserSchema,
    resetPasswordSchema

} = require("../validators/userValidator");

router.use(authenticate);
router.use(authorize("ADMIN"));

router.post(
    "/",
    validate(createUserSchema),
    userController.createUser
);

router.get(
    "/",
    userController.getUsers
);

router.get(
    "/:id",
    userController.getUserById
);

router.put(
    "/:id",
    validate(updateUserSchema),
    userController.updateUser
);

router.patch(
    "/:id/password",
    validate(resetPasswordSchema),
    userController.resetPassword
);

router.patch(
    "/:id/archive",
    userController.archiveUser
);

module.exports = router;