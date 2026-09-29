// =====================================================
// RYTHUFRESH_SEC - ADMIN ORDERS
// =====================================================

const API_URL = "http://localhost:8080/orders";

let allOrders = [];

let selectedOrderId = null;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // Load orders
    loadOrders();


    // Search input
    const searchInput =
        document.getElementById("orderSearch");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterOrders
        );

    }


    // Status filter
    const statusFilter =
        document.getElementById("statusFilter");

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterOrders
        );

    }

});


// =====================================================
// LOAD ALL ORDERS
// =====================================================

async function loadOrders() {

    const tableBody =
        document.getElementById("ordersTableBody");


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr>

            <td
                colspan="10"
                class="loading"
            >
                Loading orders...
            </td>

        </tr>
    `;


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load orders"
            );

        }


        allOrders =
            await response.json();


        console.log(
            "Orders loaded:",
            allOrders
        );


        // Update summary cards
        updateSummary();


        // IMPORTANT:
        // Apply current search/status filters
        filterOrders();


    } catch (error) {

        console.error(
            "Load Orders Error:",
            error
        );


        tableBody.innerHTML = `
            <tr>

                <td
                    colspan="10"
                    class="loading"
                >

                    ❌ Failed to load orders.

                    <br><br>

                    Make sure Spring Boot is running.

                </td>

            </tr>
        `;


        // Reset summary
        allOrders = [];

        updateSummary();

    }

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSummary() {

    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    const pendingOrders =
        document.getElementById(
            "pendingOrders"
        );


    const confirmedOrders =
        document.getElementById(
            "confirmedOrders"
        );


    const deliveredOrders =
        document.getElementById(
            "deliveredOrders"
        );


    let pending = 0;

    let confirmed = 0;

    let delivered = 0;


    allOrders.forEach(order => {

        const status =
            normalizeStatus(
                order.orderStatus
            );


        if (status === "Pending") {
            pending++;
        }


        if (status === "Confirmed") {
            confirmed++;
        }


        if (status === "Delivered") {
            delivered++;
        }

    });


    if (totalOrders) {

        totalOrders.textContent =
            allOrders.length;

    }


    if (pendingOrders) {

        pendingOrders.textContent =
            pending;

    }


    if (confirmedOrders) {

        confirmedOrders.textContent =
            confirmed;

    }


    if (deliveredOrders) {

        deliveredOrders.textContent =
            delivered;

    }

}


// =====================================================
// SEARCH + STATUS FILTER ORDERS
// =====================================================

function filterOrders() {

    const searchInput =
        document.getElementById(
            "orderSearch"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "All";


    const filteredOrders =
        allOrders.filter(order => {


            // ================= SEARCH =================

            const orderId =
                String(
                    order.id ?? ""
                ).toLowerCase();


            const customerName =
                String(
                    order.customerName ?? ""
                ).toLowerCase();


            const mobile =
                String(
                    order.mobile ?? ""
                ).toLowerCase();


            const matchesSearch =

                searchText === "" ||

                orderId.includes(
                    searchText
                ) ||

                customerName.includes(
                    searchText
                ) ||

                mobile.includes(
                    searchText
                );


            // ================= STATUS =================

            const orderStatus =
                normalizeStatus(
                    order.orderStatus
                );


            const matchesStatus =

                selectedStatus === "All" ||

                orderStatus ===
                    selectedStatus;


            // ================= FINAL RESULT =================

            return (
                matchesSearch &&
                matchesStatus
            );

        });


    displayOrders(
        filteredOrders
    );

}


// =====================================================
// DISPLAY ORDERS
// =====================================================

function displayOrders(orders) {

    const tableBody =
        document.getElementById(
            "ordersTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    // No results

    if (
        !orders ||
        orders.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>

                <td
                    colspan="10"
                    class="loading"
                >
                    No orders found.
                </td>

            </tr>
        `;

        return;

    }


    // Display each order

    orders.forEach(order => {

        const row =
            document.createElement("tr");


        // ================= ADDRESS =================

        const address = [

            order.house,

            order.area,

            order.landmark,

            order.pincode

        ]
        .filter(Boolean)
        .join(", ");


        // ================= ITEMS =================

        const itemsCount =

            order.items
                ? order.items.length
                : 0;


        // ================= DATE =================

        const orderDate =
            formatDate(
                order.orderDate
            );


        // ================= STATUS =================

        const status =
            normalizeStatus(
                order.orderStatus
            );


        // ================= TABLE ROW =================

        row.innerHTML = `

            <td>

                #${order.id ?? ""}

            </td>


            <td>

                ${escapeHtml(
                    order.customerName
                )}

            </td>


            <td>

                ${escapeHtml(
                    order.mobile
                )}

            </td>


            <td>

                ${escapeHtml(
                    address
                )}

            </td>


            <td>

                ${itemsCount}

            </td>


            <td>

                ₹${Number(
                    order.totalAmount || 0
                ).toFixed(2)}

            </td>


            <td>

                ${escapeHtml(
                    order.paymentMethod
                )}

            </td>


            <td>

                ${orderDate}

            </td>


            <td>

                <span
                    class="status ${getStatusClass(
                        status
                    )}"
                >

                    ${escapeHtml(
                        status
                    )}

                </span>

            </td>


            <td>

                <button
                    class="view-btn"
                    onclick="viewOrder(
                        ${order.id}
                    )"
                >
                    👁 View
                </button>


                <button
                    class="status-btn"
                    onclick="openStatusModal(
                        ${order.id}
                    )"
                >
                    🔄 Status
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteOrder(
                        ${order.id}
                    )"
                >
                    🗑 Delete
                </button>

            </td>

        `;


        tableBody.appendChild(
            row
        );

    });

}


// =====================================================
// VIEW ORDER
// =====================================================

function viewOrder(orderId) {

    const order =
        allOrders.find(
            item =>
                Number(item.id) ===
                Number(orderId)
        );


    if (!order) {

        alert(
            "Order not found."
        );

        return;

    }


    const details =
        document.getElementById(
            "orderDetails"
        );


    if (!details) {
        return;
    }


    // ================= ITEMS =================

    let itemsHtml = "";


    if (
        order.items &&
        order.items.length > 0
    ) {

        order.items.forEach(item => {

            const quantity =
                Number(
                    item.quantity || 0
                );


            const price =
                Number(
                    item.price || 0
                );


            const itemTotal =
                price * quantity;


            itemsHtml += `

                <div class="detail-item">

                    <div>

                        <strong>

                            ${escapeHtml(
                                item.name
                            )}

                        </strong>

                        <br>

                        <small>

                            ${escapeHtml(
                                item.weight || ""
                            )}

                            × ${quantity}

                        </small>

                    </div>


                    <strong>

                        ₹${itemTotal.toFixed(2)}

                    </strong>

                </div>

            `;

        });

    } else {

        itemsHtml = `
            <p>
                No items available.
            </p>
        `;

    }


    // ================= ADDRESS =================

    const address = [

        order.house,

        order.area,

        order.landmark,

        order.pincode

    ]
    .filter(Boolean)
    .join(", ");


    // ================= DETAILS =================

    details.innerHTML = `

        <div class="order-detail-box">


            <h3>

                Order #${order.id}

            </h3>


            <p>

                <strong>
                    Customer:
                </strong>

                ${escapeHtml(
                    order.customerName
                )}

            </p>


            <p>

                <strong>
                    Mobile:
                </strong>

                ${escapeHtml(
                    order.mobile
                )}

            </p>


            <p>

                <strong>
                    Address:
                </strong>

                ${escapeHtml(
                    address
                )}

            </p>


            <p>

                <strong>
                    Payment:
                </strong>

                ${escapeHtml(
                    order.paymentMethod
                )}

            </p>


            <p>

                <strong>
                    Order Date:
                </strong>

                ${formatDate(
                    order.orderDate
                )}

            </p>


            <p>

                <strong>
                    Status:
                </strong>

                ${escapeHtml(
                    normalizeStatus(
                        order.orderStatus
                    )
                )}

            </p>


            <hr>


            <h3>

                🥬 Ordered Items

            </h3>


            <div class="detail-items">

                ${itemsHtml}

            </div>


            <hr>


            <div class="detail-total">

                <strong>
                    Total Amount
                </strong>


                <strong>

                    ₹${Number(
                        order.totalAmount || 0
                    ).toFixed(2)}

                </strong>

            </div>


        </div>

    `;


    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


// =====================================================
// CLOSE ORDER MODAL
// =====================================================

function closeOrderModal() {

    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// =====================================================
// OPEN STATUS MODAL
// =====================================================

function openStatusModal(orderId) {

    const order =
        allOrders.find(
            item =>
                Number(item.id) ===
                Number(orderId)
        );


    if (!order) {

        alert(
            "Order not found."
        );

        return;

    }


    selectedOrderId =
        order.id;


    const currentStatus =
        normalizeStatus(
            order.orderStatus
        );


    const currentDisplay =
        document.getElementById(
            "currentStatusDisplay"
        );


    const statusSelect =
        document.getElementById(
            "newOrderStatus"
        );


    const title =
        document.getElementById(
            "statusOrderTitle"
        );


    if (currentDisplay) {

        currentDisplay.textContent =
            currentStatus;

    }


    if (statusSelect) {

        statusSelect.value =
            currentStatus;

    }


    if (title) {

        title.textContent =
            `Order #${order.id} — ${order.customerName}`;

    }


    const modal =
        document.getElementById(
            "statusModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


// =====================================================
// CLOSE STATUS MODAL
// =====================================================

function closeStatusModal() {

    const modal =
        document.getElementById(
            "statusModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    selectedOrderId =
        null;

}


// =====================================================
// SAVE ORDER STATUS
// =====================================================

async function saveOrderStatus() {

    if (!selectedOrderId) {

        alert(
            "No order selected."
        );

        return;

    }


    const select =
        document.getElementById(
            "newOrderStatus"
        );


    if (!select) {
        return;
    }


    const newStatus =
        select.value;


    const order =
        allOrders.find(
            item =>
                Number(item.id) ===
                Number(selectedOrderId)
        );


    if (!order) {

        alert(
            "Order not found."
        );

        return;

    }


    // No change

    if (
        normalizeStatus(
            order.orderStatus
        ) === newStatus
    ) {

        closeStatusModal();

        return;

    }


    // ================= UPDATED ORDER =================

    const updatedOrder = {

        id:
            order.id,

        customerName:
            order.customerName,

        mobile:
            order.mobile,

        house:
            order.house,

        area:
            order.area,

        landmark:
            order.landmark,

        pincode:
            order.pincode,

        paymentMethod:
            order.paymentMethod,

        totalAmount:
            order.totalAmount,

        orderStatus:
            newStatus,

        orderDate:
            order.orderDate,

        items:
            order.items || []

    };


    try {

        const response =
            await fetch(
                `${API_URL}/${selectedOrderId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            updatedOrder
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update order status"
            );

        }


        const savedOrder =
            await response.json();


        console.log(
            "Updated order:",
            savedOrder
        );


        alert(
            `✅ Order #${selectedOrderId} status updated to ${newStatus}`
        );


        closeStatusModal();


        // Reload orders

        await loadOrders();


    } catch (error) {

        console.error(
            "Status Update Error:",
            error
        );


        alert(
            "❌ Failed to update order status."
        );

    }

}


// =====================================================
// DELETE ORDER
// =====================================================

async function deleteOrder(orderId) {

    const confirmDelete =
        confirm(
            `Are you sure you want to delete Order #${orderId}?`
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${orderId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete order"
            );

        }


        alert(
            `✅ Order #${orderId} deleted successfully.`
        );


        await loadOrders();


    } catch (error) {

        console.error(
            "Delete Order Error:",
            error
        );


        alert(
            "❌ Failed to delete order."
        );

    }

}


// =====================================================
// STATUS NORMALIZATION
// =====================================================

function normalizeStatus(status) {

    if (!status) {

        return "Pending";

    }


    const value =
        String(status)
            .trim()
            .toLowerCase();


    if (
        value === "pending"
    ) {

        return "Pending";

    }


    if (
        value === "confirmed"
    ) {

        return "Confirmed";

    }


    if (
        value === "preparing"
    ) {

        return "Preparing";

    }


    if (
        value === "out for delivery" ||
        value === "out-for-delivery"
    ) {

        return "Out for Delivery";

    }


    if (
        value === "delivered"
    ) {

        return "Delivered";

    }


    if (
        value === "cancelled" ||
        value === "canceled"
    ) {

        return "Cancelled";

    }


    return status;

}


// =====================================================
// STATUS CSS CLASS
// =====================================================

function getStatusClass(status) {

    switch (
        normalizeStatus(status)
    ) {

        case "Pending":

            return "pending";


        case "Confirmed":

            return "confirmed";


        case "Preparing":

            return "preparing";


        case "Out for Delivery":

            return "out-for-delivery";


        case "Delivered":

            return "delivered";


        case "Cancelled":

            return "cancelled";


        default:

            return "pending";

    }

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(dateValue);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "-";

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


// =====================================================
// HTML SAFETY
// =====================================================

function escapeHtml(value) {

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


// =====================================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// =====================================================

window.addEventListener(
    "click",
    function (event) {

        const orderModal =
            document.getElementById(
                "orderModal"
            );


        const statusModal =
            document.getElementById(
                "statusModal"
            );


        if (
            event.target ===
            orderModal
        ) {

            closeOrderModal();

        }


        if (
            event.target ===
            statusModal
        ) {

            closeStatusModal();

        }

    }
);
  

// =====================================================
// LOGOUT
// =====================================================

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    window.location.href =
        "admin-login.html";

}