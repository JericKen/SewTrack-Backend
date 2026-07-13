const bcrypt = require("bcrypt");

const prisma = require("../config/prisma");

const AppError = require("../utils/appError");

async function createUser(data) {

    const existingUser = await prisma.user.findUnique({

        where: {

            email: data.email

        }

    });

    if (existingUser) {

        throw new AppError(
            "Email already exists.",
            409
        );

    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );

    const user = await prisma.user.create({

        data: {

            name: data.name,

            email: data.email,

            password: hashedPassword,

            role: data.role

        }

    });

    return mapUser(user);

}

function mapUser(user) {

    return {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

        isActive: user.isActive,

        createdAt: user.createdAt,

        updatedAt: user.updatedAt

    };

}

async function getUsers() {

    const users = await prisma.user.findMany({

        orderBy: {

            createdAt: "desc"

        }

    });

    return users.map(mapUser);

}

async function getUserById(id) {

    const user = await prisma.user.findUnique({

        where: {

            id

        }

    });

    if (!user) {

        throw new AppError(
            "User not found.",
            404
        );

    }

    return mapUser(user);

}

async function updateUser(currentUserId, targetUserId, data) {

    const user = await prisma.user.findUnique({

        where: {

            id: targetUserId

        }

    });

    if (!user) {

        throw new AppError(

            "User not found.",

            404

        );

    }

    if (!user.isActive) {

        throw new AppError(

            "Cannot update an archived user.",

            400

        );

    }

    if (data.email) {

        const existing = await prisma.user.findFirst({

            where: {

                email: data.email,

                NOT: {

                    id: targetUserId

                }

            }

        });

        if (existing) {

            throw new AppError(

                "Email already exists.",

                409

            );

        }

    }

    if (

        data.role &&
        user.role === "ADMIN" &&
        data.role !== "ADMIN"

    ) {

        if (currentUserId === targetUserId) {

            throw new AppError(

                "You cannot change your own role.",

                400

            );

        }

        const activeAdmins = await prisma.user.count({

            where: {

                role: "ADMIN",

                isActive: true

            }

        });

        if (activeAdmins <= 1) {

            throw new AppError(

                "Cannot change the role of the last active administrator.",

                400

            );

        }

    }

    const updatedUser = await prisma.user.update({

        where: {

            id: targetUserId

        },

        data

    });

    return mapUser(updatedUser);

}   

async function resetPassword(
    currentUserId,
    targetUserId,
    password
) {

    if (currentUserId === targetUserId) {

        throw new AppError(

            "Use the change password endpoint to update your own password.",

            400

        );

    }

    const user = await prisma.user.findUnique({

        where: {

            id: targetUserId

        }

    });

    if (!user) {

        throw new AppError(

            "User not found.",

            404

        );

    }

    if (!user.isActive) {

        throw new AppError(

            "Cannot reset password for an archived user.",

            400

        );

    }

    const hashedPassword = await bcrypt.hash(

        password,

        10

    );

    await prisma.user.update({

        where: {

            id: targetUserId

        },

        data: {

            password: hashedPassword

        }

    });

}

async function archiveUser(currentUserId, targetUserId) {

    if (currentUserId === targetUserId) {

        throw new AppError(

            "You cannot archive your own account.",

            400

        );

    }

    const user = await prisma.user.findUnique({

        where: {

            id: targetUserId

        }

    });

    if (!user) {

        throw new AppError(

            "User not found.",

            404

        );

    }

    if (!user.isActive) {

        throw new AppError(

            "User is already archived.",

            400

        );

    }

    await prisma.user.update({

        where: {

            id: targetUserId

        },

        data: {

            isActive: false

        }

    });

}

module.exports = {

    createUser,

    getUsers,

    getUserById,

    updateUser,

    resetPassword,

    archiveUser

};  