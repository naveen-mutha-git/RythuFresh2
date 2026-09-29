// ===============================
// RYTHUFRESH ADMIN - CUSTOMERS
// ===============================

let allCustomers = [];


// ===============================
// LOAD CUSTOMERS WHEN PAGE OPENS
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    loadCustomers();

    // Search customers
    const searchInput =
        document.getElementById("customerSearch");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                searchCustomers(this.value);

            }
        );
    }

});


// ===============================
// LOAD ALL CUSTOMERS
// ===============================

function loadCustomers() {

    fetch("/customer/all")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load customers"
                );

            }

            return response.json();

        })

        .then(customers => {

            // Store all customers
            allCustomers = customers || [];

            // Display all customers
            displayCustomers(allCustomers);

        })

        .catch(error => {

            console.error(
                "Customer Error:",
                error
            );

            document.getElementById(
                "customerTableBody"
            ).innerHTML = `

                <tr>

                    <td colspan="6"
                        style="
                            text-align: center;
                            padding: 20px;
                            color: red;
                        ">

                        Failed to load customers.

                    </td>

                </tr>

            `;

        });

}


// ===============================
// SEARCH CUSTOMERS
// ===============================

function searchCustomers(searchText) {

    const searchValue =
        String(searchText || "")
            .trim()
            .toLowerCase();


    // If search box is empty
    // show all customers
    if (searchValue === "") {

        displayCustomers(allCustomers);

        return;

    }


    // Search by:
    // Name
    // Email
    // Phone

    const filteredCustomers =
        allCustomers.filter(customer => {

            const name =
                String(
                    customer.fullName || ""
                ).toLowerCase();

            const email =
                String(
                    customer.email || ""
                ).toLowerCase();

            const phone =
                String(
                    customer.phone || ""
                ).toLowerCase();


            return (

                name.includes(searchValue) ||

                email.includes(searchValue) ||

                phone.includes(searchValue)

            );

        });


    displayCustomers(filteredCustomers);

}


// ===============================
// DISPLAY CUSTOMERS
// ===============================

function displayCustomers(customers) {

    const tableBody =
        document.getElementById(
            "customerTableBody"
        );


    tableBody.innerHTML = "";


    if (!customers || customers.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="6"
                    style="
                        text-align: center;
                        padding: 20px;
                    ">

                    No customers found.

                </td>

            </tr>

        `;

        return;

    }


    customers.forEach(customer => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td style="
                padding: 14px;
                border-bottom: 1px solid #ddd;
            ">

                ${customer.id ?? ""}

            </td>


            <td style="
                padding: 14px;
                border-bottom: 1px solid #ddd;
            ">

                ${customer.fullName ?? ""}

            </td>


            <td style="
                padding: 14px;
                border-bottom: 1px solid #ddd;
            ">

                ${customer.email ?? ""}

            </td>


            <td style="
                padding: 14px;
                border-bottom: 1px solid #ddd;
            ">

                ${customer.phone ?? ""}

            </td>


            <td style="
                padding: 14px;
                border-bottom: 1px solid #ddd;
            ">

                ${customer.address ?? ""}

            </td>


            <td style="
                padding: 14px;
                border-bottom: 1px solid #ddd;
            ">

                <button
                    class="view-customer-btn"
                    onclick="viewCustomer(
                        '${customer.id}',
                        '${escapeQuotes(customer.fullName)}',
                        '${escapeQuotes(customer.email)}',
                        '${escapeQuotes(customer.phone)}',
                        '${escapeQuotes(customer.address)}'
                    )">

                    👁 View

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ===============================
// ESCAPE QUOTES
// ===============================

function escapeQuotes(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/\\/g, "\\\\")

        .replace(/'/g, "\\'");

}


// ===============================
// VIEW CUSTOMER
// ===============================

function viewCustomer(
    id,
    name,
    email,
    phone,
    address
) {

    // Fill customer information

    document.getElementById(
        "modalCustomerName"
    ).innerText = name || "-";


    document.getElementById(
        "modalCustomerEmail"
    ).innerText = email || "-";


    document.getElementById(
        "modalCustomerPhone"
    ).innerText = phone || "-";


    document.getElementById(
        "modalCustomerAddress"
    ).innerText = address || "-";


    // Reset statistics

    document.getElementById(
        "statTotalOrders"
    ).innerText = "0";


    document.getElementById(
        "statPending"
    ).innerText = "0";


    document.getElementById(
        "statDelivered"
    ).innerText = "0";


    document.getElementById(
        "statTotalSpent"
    ).innerText = "₹0";


    // Show loading message

    document.getElementById(
        "customerOrderHistory"
    ).innerHTML = `

        <tr>

            <td colspan="5"
                style="
                    text-align: center;
                    padding: 20px;
                ">

                Loading order history...

            </td>

        </tr>

    `;


    // Open modal

    document.getElementById(
        "customerModal"
    ).style.display = "flex";


    // Load customer's orders

    loadCustomerOrders(phone);

}


// ===============================
// LOAD CUSTOMER ORDERS
// ===============================

function loadCustomerOrders(mobile) {

    if (!mobile) {

        document.getElementById(
            "customerOrderHistory"
        ).innerHTML = `

            <tr>

                <td colspan="5"
                    style="
                        text-align: center;
                        padding: 20px;
                    ">

                    Mobile number not available.

                </td>

            </tr>

        `;

        return;

    }


    // Remove leading 0
    // if phone number has 11 digits

    const normalizedMobile =
        mobile.replace(/^0/, "");


    fetch(
        "/orders/customer/" +
        encodeURIComponent(normalizedMobile)
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load customer orders"
                );

            }

            return response.json();

        })

        .then(orders => {

            displayCustomerOrders(orders);

        })

        .catch(error => {

            console.error(
                "Order History Error:",
                error
            );


            document.getElementById(
                "customerOrderHistory"
            ).innerHTML = `

                <tr>

                    <td colspan="5"
                        style="
                            text-align: center;
                            padding: 20px;
                            color: red;
                        ">

                        Failed to load order history.

                    </td>

                </tr>

            `;

        });

}


// ===============================
// DISPLAY CUSTOMER ORDERS
// ===============================

function displayCustomerOrders(orders) {

    const tableBody =
        document.getElementById(
            "customerOrderHistory"
        );


    tableBody.innerHTML = "";


    // No orders

    if (!orders || orders.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="5"
                    style="
                        text-align: center;
                        padding: 20px;
                    ">

                    No orders found for this customer.

                </td>

            </tr>

        `;

        updateCustomerStats([]);

        return;

    }


    // Calculate statistics

    updateCustomerStats(orders);


    // Display each order

    orders.forEach(order => {

        const row =
            document.createElement("tr");


        const date =
            formatOrderDate(
                order.orderDate
            );


        const status =
            order.orderStatus ||
            "Pending";


        row.innerHTML = `

            <td>

                #${order.id ?? ""}

            </td>


            <td>

                ${date}

            </td>


            <td>

                ₹${Number(
                    order.totalAmount || 0
                ).toFixed(2)}

            </td>


            <td>

                ${order.paymentMethod || "-"}

            </td>


            <td>

                <span
                    class="order-status"
                    style="${getStatusStyle(status)}">

                    ${status}

                </span>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ===============================
// CUSTOMER STATISTICS
// ===============================

function updateCustomerStats(orders) {

    let pending = 0;

    let delivered = 0;

    let totalSpent = 0;


    orders.forEach(order => {

        const status =
            String(
                order.orderStatus || ""
            ).toLowerCase();


        if (status === "pending") {

            pending++;

        }


        if (status === "delivered") {

            delivered++;

        }


        totalSpent +=
            Number(
                order.totalAmount || 0
            );

    });


    document.getElementById(
        "statTotalOrders"
    ).innerText = orders.length;


    document.getElementById(
        "statPending"
    ).innerText = pending;


    document.getElementById(
        "statDelivered"
    ).innerText = delivered;


    document.getElementById(
        "statTotalSpent"
    ).innerText =
        "₹" + totalSpent.toFixed(2);

}


// ===============================
// FORMAT DATE
// ===============================

function formatOrderDate(orderDate) {

    if (!orderDate) {

        return "-";

    }


    const date =
        new Date(orderDate);


    if (isNaN(date.getTime())) {

        return orderDate;

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


// ===============================
// STATUS STYLE
// ===============================

function getStatusStyle(status) {

    const value =
        String(status)
            .toLowerCase();


    if (value === "delivered") {

        return `
            background: #e8f5e9;
            color: #2e7d32;
        `;

    }


    if (value === "pending") {

        return `
            background: #fff3cd;
            color: #856404;
        `;

    }


    if (value === "confirmed") {

        return `
            background: #e3f2fd;
            color: #1565c0;
        `;

    }


    if (value === "cancelled") {

        return `
            background: #ffebee;
            color: #c62828;
        `;

    }


    if (
        value === "out for delivery"
    ) {

        return `
            background: #fff3e0;
            color: #ef6c00;
        `;

    }


    if (value === "preparing") {

        return `
            background: #f3e5f5;
            color: #7b1fa2;
        `;

    }


    return `
        background: #eeeeee;
        color: #555;
    `;

}


// ===============================
// CLOSE CUSTOMER MODAL
// ===============================

function closeCustomerModal() {

    document.getElementById(
        "customerModal"
    ).style.display = "none";

}


// ===============================
// CLOSE MODAL WHEN CLICKING
// OUTSIDE THE BOX
// ===============================

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "customerModal"
            );


        if (event.target === modal) {

            closeCustomerModal();

        }

    }
);


// ===============================
// LOGOUT
// ===============================

function logout() {

    window.location.href =
        "admin-login.html";

}