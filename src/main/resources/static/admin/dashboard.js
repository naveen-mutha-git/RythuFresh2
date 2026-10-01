// RYTHUFRESH ADMIN DASHBOARD

document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {

    // Load each section independently
    await loadVegetables();
    await loadOrders();
    await loadCustomers();

}


// =========================
// VEGETABLES
// =========================

async function loadVegetables() {

    try {

        const response =
            await fetch("/vegetables/all");

        if (!response.ok) {
            throw new Error("Vegetables API failed");
        }

        const vegetables =
            await response.json();

        setText(
            "vegetableCount",
            Array.isArray(vegetables)
                ? vegetables.length
                : 0
        );

        console.log("Vegetables:", vegetables);

    } catch (error) {

        console.error(
            "Vegetables API Error:",
            error
        );

        setText("vegetableCount", "0");

    }

}


// =========================
// ORDERS
// =========================

async function loadOrders() {

    try {

        const response =
            await fetch("/orders");

        if (!response.ok) {
            throw new Error("Orders API failed");
        }

        const orders =
            await response.json();

        if (!Array.isArray(orders)) {
            throw new Error("Invalid orders response");
        }

        setText(
            "orderCount",
            orders.length
        );


        // TODAY

        const now = new Date();

        const startOfDay =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

        const endOfDay =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );


        const todayOrders =
            orders.filter(order => {

                if (!order.orderDate) {
                    return false;
                }

                const date =
                    new Date(order.orderDate);

                return (
                    date >= startOfDay &&
                    date < endOfDay
                );

            });


        setText(
            "todayOrderCount",
            todayOrders.length
        );


        // PENDING

        const pendingOrders =
            orders.filter(order =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() === "pending"
            );

        setText(
            "pendingOrders",
            pendingOrders.length
        );


        // DELIVERED

        const deliveredOrders =
            orders.filter(order =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() === "delivered"
            );

        setText(
            "deliveredOrders",
            deliveredOrders.length
        );


        // ACTIVE ORDERS
        // Cancelled orders excluded

        const activeOrders =
            orders.filter(order =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() !== "cancelled"
            );


        // TOTAL REVENUE

        const totalRevenue =
            activeOrders.reduce(
                (total, order) =>
                    total +
                    Number(
                        order.totalAmount || 0
                    ),
                0
            );


        setText(
            "totalRevenue",
            "₹" +
            totalRevenue.toFixed(2)
        );


        // TODAY REVENUE

        const todayRevenue =
            todayOrders
                .filter(order =>
                    String(
                        order.orderStatus || ""
                    ).toLowerCase() !== "cancelled"
                )
                .reduce(
                    (total, order) =>
                        total +
                        Number(
                            order.totalAmount || 0
                        ),
                    0
                );


        setText(
            "todayRevenue",
            "₹" +
            todayRevenue.toFixed(2)
        );


        console.log(
            "Orders:",
            orders
        );

    } catch (error) {

        console.error(
            "Orders API Error:",
            error
        );

    }

}


// =========================
// CUSTOMERS
// =========================

async function loadCustomers() {

    try {

        const response =
            await fetch("/customer/all");

        if (!response.ok) {
            throw new Error("Customers API failed");
        }

        const customers =
            await response.json();

        setText(
            "customerCount",
            Array.isArray(customers)
                ? customers.length
                : 0
        );

        console.log(
            "Customers:",
            customers
        );

    } catch (error) {

        console.error(
            "Customers API Error:",
            error
        );

    }

}


// =========================
// SET TEXT
// =========================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


// =========================
// NAVIGATION
// =========================

function openVegetables() {

    window.location.href =
        "vegetables.html";

}


function openOrders() {

    window.location.href =
        "orders.html";

}


function openCustomers() {

    window.location.href =
        "customers.html";

}


// =========================
// LOGOUT
// =========================

function logout() {

    if (
        confirm(
            "Are you sure you want to logout?"
        )
    ) {

        window.location.href =
            "admin-login.html";

    }

}