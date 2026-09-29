// ================================
// RYTHUFRESH ADMIN DASHBOARD
// ================================


// ================================
// LOAD DASHBOARD DATA
// ================================

function loadDashboard() {

    fetch("/api/admin/dashboard")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load dashboard data"
                );

            }

            return response.json();

        })

        .then(data => {

            // ================================
            // BASIC COUNTS
            // ================================

            // Total Vegetables
            document.getElementById(
                "vegetableCount"
            ).textContent = data.vegetableCount;


            // Total Customers
            document.getElementById(
                "customerCount"
            ).textContent = data.customerCount;


            // Total Orders
            document.getElementById(
                "orderCount"
            ).textContent = data.orderCount;


            // Today's Orders
            document.getElementById(
                "todayOrderCount"
            ).textContent = data.todayOrderCount;


            // ================================
            // REVENUE
            // ================================

            // Today's Revenue
            document.getElementById(
                "todayRevenue"
            ).textContent =
                "₹" + Number(data.todayRevenue || 0).toFixed(2);


            // Total Revenue
            document.getElementById(
                "totalRevenue"
            ).textContent =
                "₹" + Number(data.totalRevenue || 0).toFixed(2);


            // ================================
            // ORDER STATUS
            // ================================

            // Pending Orders
            document.getElementById(
                "pendingOrders"
            ).textContent =
                data.pendingOrders;


            // Delivered Orders
            document.getElementById(
                "deliveredOrders"
            ).textContent =
                data.deliveredOrders;

        })

        .catch(error => {

            console.error(
                "Dashboard error:",
                error
            );

        });

}


// ================================
// LOGOUT
// ================================

function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (!confirmLogout) {

        return;

    }

    window.location.href =
        "admin-login.html";

}


// ================================
// OPEN VEGETABLES
// ================================

function openVegetables() {

    window.location.href =
        "vegetables.html";

}


// ================================
// OPEN ORDERS
// ================================

function openOrders() {

    window.location.href =
        "orders.html";

}


// ================================
// OPEN CUSTOMERS
// ================================

function openCustomers() {

    window.location.href =
        "customers.html";

}


// ================================
// START DASHBOARD
// ================================

document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);