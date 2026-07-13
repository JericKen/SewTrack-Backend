const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");

const {

    loginSchema,

    changePasswordSchema

} = require("../validators/authValidator");

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@sewtrack.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

router.post(

    "/login",

    validate(loginSchema),

    authController.login

);

router.get(

    "/me",

    authenticate,

    authController.getCurrentUser

);

router.post(

    "/change-password",

    authenticate,

    validate(changePasswordSchema),

    authController.changePassword

);

module.exports = router;