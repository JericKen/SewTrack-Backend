const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const AppError = require("../utils/appError");

async function authenticate(req, res, next) {

    const authHeader = req.headers.authorization;

    if (

        !authHeader ||

        !authHeader.startsWith("Bearer ")

    ) {

        return next(

            new AppError("Authentication required.", 401)

        );

    }

    const token = authHeader.split(" ")[1];

    try {

        const payload = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        const user = await prisma.user.findUnique({

            where: {

                id: payload.id

            },

            select: {

                id: true,

                name: true,

                email: true,

                role: true,

                isActive: true

            }

        });

        if (!user || !user.isActive) {

            return next(
                new AppError("User not found or inactive.", 401)
            );

        }

        req.user = user;

        next();

    } catch {

        return next(

            new AppError("Invalid or expired token.", 401)

        );

    }

}

module.exports = authenticate;