const prisma = require("../config/prisma");

const { getPagination } = require("../utils/pagination");
const { getSort } = require("../utils/sort");
const { contains } = require("../utils/search");
const stockService = require("../services/stockService");
const AppError = require("../utils/appError");

async function getPurchases(query) {

    const { page, limit, skip } = getPagination(query);

    const purchases = await prisma.purchase.findMany({
        
        skip,
        take: limit,
        orderBy: getSort(query),

        where: {
            supplier: query.search
                ? {
                    name: contains(query.search)
                }
                : undefined
        },

        include: {
            supplier: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    const total = await prisma.purchase.count({
        
        where: {
            supplier: query.search
                ? {
                    name: contains(query.search)
                }
                : undefined
        }
    });

    return {
        purchases,

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

async function createPurchase(data) {
    const totalAmount = calculateTotal(data.items);

    return prisma.$transaction(async (tx) => {

        const purchase = await createPurchaseRecord(
            tx,
            data,
            totalAmount
        )

        await processPurchaseItems(
            tx,
            purchase.id,
            data.items
        )

        return purchase;
    });
}

function calculateTotal(items) {

    return items.reduce((total, item) => {

        return total + item.quantity * item.unitCost;

    }, 0);

}

async function createPurchaseRecord(
    tx,
    data,
    totalAmount
) {
    return tx.purchase.create({
        data: {
            supplierId: data.supplierId,
            purchasedAt: data.purchasedAt
                ? new Date(data.purchasedAt)
                : new Date(),
            totalAmount,
            remarks: data.remarks
        }
    });
}

async function processPurchaseItems(
    tx,
    purchaseId,
    items
) {
    for (const item of items) {

        await createPurchaseItem(
            tx,
            purchaseId,
            item
        );

        await stockService.increaseStock(tx, {

            productId: item.productId,
            quantity: item.quantity,
            reason: "PURCHASE",
            referenceType: "PURCHASE",
            referenceId: purchaseId,
            remarks: "Stock added from purchase"

        });

    }
}

async function createPurchaseItem(
    tx,
    purchaseId,
    item
) {

    return tx.purchaseItem.create({
        data: {
            purchaseId,
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost
        }
    });

}

async function increaseStock(
    tx,
    item
) {
    return tx.product.update({

        where: {
            id: item.productId
        },

        data: {
            stockQuantity: {
                increment: item.quantity
            }
        }

    })
}

module.exports = {
    getPurchases,
    createPurchase
}