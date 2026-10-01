// RYTHUFRESH ADMIN DASHBOARD

async function loadDashboard() {

    try {

        const [vegetablesRes, ordersRes, customersRes] =
            await Promise.all([
                fetch("/vegetables/all"),
                fetch("/orders"),
                fetch("/customer/all")
            ]);

        if (
            !vegetablesRes.ok ||
            !ordersRes.ok ||
            !customersRes.ok
        ) {
            throw new Error("Admin API failed");
        }

        const vegetables =
            await vegetablesRes.json();

        const orders =
            await ordersRes.json();

        const customers =
            await customersRes.json();


        // =========================
        // TODAY
        // =========================

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


        // =========================
        // ACTIVE ORDERS
        // Cancelled excluded
        // =========================

        const activeOrders =
            orders.filter(order =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() !== "cancelled"
            );


        // =========================
        // PENDING
        // =========================

        const pendingOrders =
            orders.filter(order =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() === "pending"
            );


        // =========================
        // DELIVERED
        // =========================

        const deliveredOrders =
            orders.filter(order =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() === "delivered"
            );


        // =========================
        // TOTAL REVENUE
        // =========================

        const totalRevenue =
            activeOrders.reduce(
                (total, order) =>
                    total +
                    Number(
                        order.totalAmount || 0
                    ),
                0
            );


        // =========================
        // TODAY REVENUE
        // =========================

        const todayRevenue =
            todayOrders
                .filter(order =>
                    String(
                        order.orderStatus || ""
                    ).toLowerCase() !==
                    "cancelled"
                )
                .reduce(
                    (total, order) =>
                        total +
                        Number(
                            order.totalAmount || 0
                        ),
                    0
                );


        // =========================
        // UPDATE DASHBOARD
        // =========================

        setText(
            "vegetableCount",
            vegetables.length
        );

        setText(
            "orderCount",
            orders.length
        );

        setText(
            "customerCount",
            customers.length
        );

        setText(
            "todayOrderCount",
            todayOrders.length
        );

        setText(
            "todayRevenue",
            "₹" +
            todayRevenue.toFixed(2)
        );

        setText(
            "totalRevenue",
            "₹" +
            totalRevenue.toFixed(2)
        );

        setText(
            "pendingOrders",
            pendingOrders.length
        );

        setText(
            "deliveredOrders",
            deliveredOrders.length
        );

    }

    catch (error) {

        console.error(
            "Dashboard error:",
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
// START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);