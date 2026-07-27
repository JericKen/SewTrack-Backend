export function getCustomerFullName(customer) {
    if (!customer) {
        return "";
    }

    return [customer.firstName, customer.lastName]
        .filter(Boolean)
        .join(" ");
}
