const authService = require("../services/authService");

const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const login = asyncHandler(async (req, res) => {

    const result = await authService.login(req.body);

    return apiResponse.success(

        res,

        200,

        "Login successful.",

        result

    );

});

const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await authService.getCurrentUser(

        req.user.id

    );

    return apiResponse.success(

        res,

        200,

        "User retrieved successfully.",

        user

    );

});

const changePassword = asyncHandler(async (req, res) => {

    await authService.changePassword(

        req.user.id,

        req.body

    );

    return apiResponse.success(

        res,

        200,

        "Password changed successfully."

    );

});

module.exports = {

    login,

    getCurrentUser,

    changePassword

};