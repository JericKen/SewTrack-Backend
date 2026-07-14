const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const AppError = require("../utils/appError");

const { generateToken } = require("../utils/jwt");

async function login(data) {

    const user = await prisma.user.findUnique({

        where: {

            email: data.email

        }

    });

    if (!user) {
        throw new AppError("Invalid email or password.", 401);
    }

    if (!user.isActive) {
        throw new AppError(
            "Your account has been deactivated.",
            403
        );
    }

    const passwordMatch = await bcrypt.compare(

        data.password,
        user.password

    );

    if (!passwordMatch) {

        throw new AppError("Invalid email or password.", 401);

    }

    const token = generateToken(user);

    return {

        token,

        user: {

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role

        }

    };

}

async function getCurrentUser(userId) {

    const user = await prisma.user.findUnique({

        where: {

            id: userId

        },

        select: {

            id: true,
            name: true,
            email: true,
            role: true

        }

    });

    if (!user) {

        throw new AppError("User not found.", 404);

    }

    return user;

}

async function changePassword(userId, data) {

    const user = await prisma.user.findUnique({

        where: {

            id: userId

        }

    });

    if (!user) {

        throw new AppError("User not found.", 404);

    }

    const passwordMatch = await bcrypt.compare(

        data.currentPassword,
        user.password

    );

    if (!passwordMatch) {

        throw new AppError("Current password is incorrect.", 400);

    }

    const hashedPassword = await bcrypt.hash(

        data.newPassword,
        10

    );

    await prisma.user.update({

        where: {

            id: userId

        },

        data: {

            password: hashedPassword

        }

    });

}

module.exports = {
    login,
    getCurrentUser,
    changePassword
};
