const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

    const adminEmail =
        process.env.SEED_ADMIN_EMAIL || "admin@sewtrack.com";

    const adminName =
        process.env.SEED_ADMIN_NAME || "Administrator";

    const adminPassword =
        process.env.SEED_ADMIN_PASSWORD || "admin123";

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    });

    if (!existingAdmin) {

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.create({

            data: {
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN",
                isActive: true
            }

        });

        console.log("✅ Admin user created.");

    } else {

        console.log("ℹ️ Admin already exists.");

    }

    const categories = [

        {
            code: "BED",
            name: "Bedsheets"
        },

        {
            code: "PIL",
            name: "Pillow Cases"
        },

        {
            code: "CUR",
            name: "Curtains"
        },

        {
            code: "UNI",
            name: "School Uniforms"
        },

        {
            code: "RAG",
            name: "Rags"
        }

    ];

    for (const category of categories) {

        await prisma.category.upsert({

            where: {
                code: category.code
            },

            update: {},

            create: category

        });

    }

    console.log("✅ Categories seeded.");

}

main()
    .catch(error => {

        console.error(error);
        process.exit(1);

    })
    .finally(async () => {

        await prisma.$disconnect();

    });