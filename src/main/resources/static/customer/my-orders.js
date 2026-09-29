document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadOrders();

    }
);


// ==================================================
// LOAD ORDERS
// ==================================================

function loadOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    // ===============================
    // GET CUSTOMER MOBILE
    // ===============================

    const mobile =
        localStorage.getItem(
            "customerPhone"
        );


    console.log(
        "My Orders - Customer Mobile:",
        mobile
    );


    // ===============================
    // LOGIN CHECK
    // ===============================

    if (!mobile) {

        container.innerHTML = `

            <div class="no-orders">

                <div class="no-orders-icon">
                    🔐
                </div>

                <h2>
                    Please Login
                </h2>

                <p>
                    Please login to view your orders.
                </p>

                <button
                    onclick="goToLogin()">
                    Login
                </button>

            </div>

        `;

        return;
    }


    // ===============================
    // LOADING
    // ===============================

    container.innerHTML = `

        <div class="message">
            Loading your orders...
        </div>

    `;


    // ===============================
    // API URL
    // ===============================

    const API_URL =
        "http://localhost:8080/orders/customer/" +
        encodeURIComponent(mobile);


    console.log(
        "Fetching:",
        API_URL
    );


    // ===============================
    // FETCH ORDERS
    // ===============================

    fetch(API_URL)

        .then(response => {

            console.log(
                "Orders API Status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Orders API returned " +
                    response.status
                );
            }


            return response.json();

        })


        .then(orders => {

            console.log(
                "Orders received:",
                orders
            );


            // ===============================
            // NO ORDERS
            // ===============================

            if (
                !orders ||
                !Array.isArray(orders) ||
                orders.length === 0
            ) {

                showNoOrders();

                return;
            }


            // ===============================
            // DISPLAY
            // ===============================

            displayOrders(orders);

        })


        .catch(error => {

            console.error(
                "Load Orders Error:",
                error
            );


            container.innerHTML = `

                <div class="no-orders">

                    <div class="no-orders-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Orders
                    </h2>

                    <p>
                        Please check your connection
                        and try again.
                    </p>

                    <button
                        onclick="loadOrders()">
                        Try Again
                    </button>

                </div>

            `;

        });
}


// ==================================================
// DISPLAY ORDERS
// ==================================================

function displayOrders(orders) {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    container.innerHTML = "";


    orders.forEach(order => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "order-card";


        const status =
            order.orderStatus ||
            "Pending";


        const statusClass =
            status
                .toLowerCase()
                .replace(/\s+/g, "-");


        const orderDate =
            formatDate(
                order.orderDate
            );


        // ===============================
        // ITEMS
        // ===============================

        let itemsHTML = "";


        if (
            order.items &&
            order.items.length > 0
        ) {

            order.items.forEach(item => {

                const price =
                    Number(item.price) || 0;


                const quantity =
                    Number(item.quantity) || 0;


                const itemTotal =
                    price * quantity;


                itemsHTML += `

                    <div class="item-row">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    item.name
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    item.weight || ""
                                )}
                            </small>

                        </div>


                        <div>
                            × ${quantity}
                        </div>


                        <div>
                            ₹${itemTotal.toFixed(2)}
                        </div>

                    </div>

                `;

            });

        } else {

            itemsHTML = `

                <p>
                    No items found.
                </p>

            `;
        }


        // ===============================
        // ORDER CARD
        // ===============================

        card.innerHTML = `

            <div class="order-header">

                <div>

                    <h2>
                        Order #${order.id}
                    </h2>

                    <p>
                        ${orderDate}
                    </p>

                </div>


                <span
                    class="status ${statusClass}">
                    ${escapeHTML(status)}
                </span>

            </div>


            <!-- STATUS -->

            ${createStatusFlow(status)}


            <!-- ITEMS -->

            <div class="order-items">

                <h3>
                    🥬 Order Items
                </h3>

                ${itemsHTML}

            </div>


            <!-- FOOTER -->

            <div class="order-footer">

                <div>

                    <span>
                        Payment Method
                    </span>

                    <strong>
                        ${escapeHTML(
                            order.paymentMethod ||
                            "Cash On Delivery"
                        )}
                    </strong>

                </div>


                <div class="order-total">

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ₹${Number(
                            order.totalAmount || 0
                        ).toFixed(2)}
                    </strong>

                </div>

            </div>


            <!-- ACTIONS -->

            <div class="order-actions">

                <button
                    class="details-btn"
                    onclick="viewOrderDetails(${order.id})">

                    View Details

                </button>


                ${
                    status.toLowerCase() === "pending"
                    ?
                    `
                    <button
                        class="cancel-btn"
                        onclick="cancelOrder(${order.id})">

                        Cancel Order

                    </button>
                    `
                    :
                    ""
                }

            </div>

        `;


        container.appendChild(card);

    });
}


// ==================================================
// STATUS FLOW
// ==================================================

function createStatusFlow(currentStatus) {

    const statuses = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered"
    ];


    const currentIndex =
        getStatusIndex(
            currentStatus
        );


    let html = `
        <div class="status-flow">
    `;


    statuses.forEach(
        (status, index) => {

            let className = "";


            if (index < currentIndex) {

                className =
                    "completed";

            }
            else if (
                index === currentIndex
            ) {

                className =
                    "current";

            }


            html += `

                <div
                    class="status-step ${className}">

                    <div class="status-circle">
                        ${index + 1}
                    </div>

                    <span>
                        ${status}
                    </span>

                </div>

            `;

        }
    );


    html += `
        </div>
    `;


    return html;
}


// ==================================================
// GET STATUS INDEX
// ==================================================

function getStatusIndex(status) {

    const value =
        String(status)
            .toLowerCase()
            .trim();


    if (value === "pending") {
        return 0;
    }


    if (value === "confirmed") {
        return 1;
    }


    if (value === "preparing") {
        return 2;
    }


    if (
        value === "out for delivery" ||
        value === "out-for-delivery"
    ) {

        return 3;
    }


    if (value === "delivered") {
        return 4;
    }


    return 0;
}


// ==================================================
// NO ORDERS
// ==================================================

function showNoOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    container.innerHTML = `

        <div class="no-orders">

            <div class="no-orders-icon">
                📦
            </div>

            <h2>
                No Orders Yet
            </h2>

            <p>
                You haven't placed any orders yet.
            </p>

            <button
                onclick="goToHome()">

                🥬 Start Shopping

            </button>

        </div>

    `;
}


// ==================================================
// VIEW DETAILS
// ==================================================

function viewOrderDetails(orderId) {

    alert(
        "Order #" +
        orderId +
        " details"
    );
}


// ==================================================
// CANCEL ORDER
// ==================================================

function cancelOrder(orderId) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel Order #" +
            orderId +
            "?"
        );


    if (!confirmed) {
        return;
    }


    fetch(
        "http://localhost:8080/orders/" +
        orderId +
        "/cancel",
        {
            method: "PUT"
        }
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to cancel order"
                );
            }


            return response.json();

        })

        .then(() => {

            alert(
                "Order cancelled successfully!"
            );


            loadOrders();

        })

        .catch(error => {

            console.error(
                "Cancel Error:",
                error
            );


            alert(
                "Unable to cancel order."
            );

        });
}


// ==================================================
// NAVIGATION
// ==================================================

function goToHome() {

    window.location.href =
        "index.html";
}


function goToLogin() {

    window.location.href =
        "login.html";
}


// ==================================================
// DATE FORMAT
// ==================================================

function formatDate(dateString) {

    if (!dateString) {
        return "Date not available";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==================================================
// HTML ESCAPE
// ==================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}