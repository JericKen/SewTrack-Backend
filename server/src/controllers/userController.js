const userService = require("../services/userService");

const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");

const createUser = asyncHandler(async (req, res) => {

    const user = await userService.createUser(req.body);

    return apiResponse.success(

        res,

        201,

        "User created successfully.",

        user

    );

});

const getUsers = asyncHandler(async (req, res) => {

    const users = await userService.getUsers();

    return apiResponse.success(

        res,

        200,

        "Users retrieved successfully.",

        users

    );

});

const getUserById = asyncHandler(async (req, res) => {

    const user = await userService.getUserById(

        Number(req.params.id)

    );

    return apiResponse.success(

        res,

        200,

        "User retrieved successfully.",

        user

    );

});

const updateUser = asyncHandler(async (req, res) => {

    const user = await userService.updateUser(

        req.user.id,

        Number(req.params.id),

        req.body

    );

    return apiResponse.success(

        res,

        200,

        "User updated successfully.",

        user

    );

});

const resetPassword = asyncHandler(async (req, res) => {

    await userService.resetPassword(

        req.user.id,

        Number(req.params.id),

        req.body.password

    );

    return apiResponse.success(

        res,

        200,

        "Password reset successfully."

    );

});

const archiveUser = asyncHandler(async (req, res) => {

    await userService.archiveUser(

        req.user.id,
        Number(req.params.id)

    );

    return apiResponse.success(

        res,
        200,
        "User archived successfully."

    );

});

module.exports = {

    createUser,

    getUsers,

    getUserById,

    updateUser,

    resetPassword,

    archiveUser

};