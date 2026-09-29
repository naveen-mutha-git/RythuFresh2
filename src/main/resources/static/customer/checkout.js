const API_URL = "http://localhost:8080/orders";

// =========================================================
// CART
// =========================================================

let cart =
    JSON.parse(
        localStorage.getItem("rythuFreshCart")
    ) || [];


// =========================================================
// FINAL CHECKOUT IMAGE LOADER
// WORKS FOR ALL VEGETABLES
// =========================================================

function setCheckoutSafeImage(img, item) {

    if (!img || !item) {
        return;
    }

    const imageValue =
        item.image ||
        item.imageUrl ||
        item.image_url ||
        "";

    const productName =
        String(
            item.name || ""
        ).trim();

    const candidates = [];


    // =====================================================
    // ADD IMAGE CANDIDATE
    // =====================================================

    function addCandidate(value) {

        if (!value) {
            return;
        }

        let filename =
            String(value).trim();

        filename =
            filename
                .replace(/^\/+/, "")
                .replace(/^images\//i, "");

        if (!filename) {
            return;
        }


        // Exact
        candidates.push(
            "/images/" +
            encodeURI(filename)
        );


        // Relative
        candidates.push(
            "images/" +
            encodeURI(filename)
        );


        // Parent
        candidates.push(
            "../images/" +
            encodeURI(filename)
        );

    }


    // =====================================================
    // 1. EXACT DATABASE IMAGE
    // =====================================================

    addCandidate(imageValue);


    // =====================================================
    // 2. FILENAME TRANSFORMATIONS
    // =====================================================

    if (imageValue) {

        const original =
            String(
                imageValue
            ).trim();


        const withoutExtension =
            original.replace(
                /\.[^/.]+$/,
                ""
            );


        // underscore → space
        addCandidate(
            withoutExtension
                .replace(/_/g, " ") +
            ".jpg"
        );


        // space → underscore
        addCandidate(
            withoutExtension
                .replace(/\s+/g, "_") +
            ".jpg"
        );


        // lowercase
        addCandidate(
            withoutExtension
                .toLowerCase() +
            ".jpg"
        );


        // uppercase extension
        addCandidate(
            withoutExtension +
            ".JPG"
        );

    }


    // =====================================================
    // 3. PRODUCT NAME
    // =====================================================

    if (productName) {

        addCandidate(
            productName +
            ".jpg"
        );


        addCandidate(
            productName +
            ".JPG"
        );


        // spaces → underscores
        addCandidate(
            productName
                .replace(/\s+/g, "_") +
            ".jpg"
        );


        // underscores → spaces
        addCandidate(
            productName
                .replace(/_/g, " ") +
            ".jpg"
        );

    }


    // =====================================================
    // 4. ALL PROJECT IMAGE NAMES
    // =====================================================

    const IMAGE_MAP = {

        "Amla":
            "Amla.jpg",

        "Arbi":
            "Arbi.jpg",

        "Ash Gourd":
            "Ash Gourd.jpg",

        "Banana":
            "Banana.jpg",

        "Banana Leaf":
            "Banana Leaf.jpg",

        "Bangalore Tomato":
            "Bangalore Tomato.jpg",

        "Beetroot":
            "Beetroot.jpg",

        "Betel Leaf":
            "Betel Leaf.jpg",

        "Bharta Brinjal":
            "Bharta Brinjal.jpg",

        "Bitter Gourd":
            "Bitter Gourd.jpg",

        "Black Brinjal":
            "Black Brinjal.jpg",

        "Bottle Gourd":
            "Bottle Gourd.jpg",

        "Broad Beans":
            "Broad Beans.jpg",

        "Cabbage":
            "Cabbage.jpg",

        "Capsicum":
            "Capsicum.jpg",

        "Carrot":
            "Carrot.jpg",

        "Cauliflower":
            "Cauliflower.jpg",

        "Cluster Beans":
            "Cluster Beans.jpg",

        "Coconut":
            "Coconut.jpg",

        "Coriander":
            "Coriander.jpg",

        "Cucumber":
            "Cucumber.jpg",

        "Curry Leaves":
            "Curry Leaves.jpg",

        "Drumstick":
            "Drumstick.jpg",

        "Fenugreek Leaves":
            "Fenugreek Leaves.jpg",

        "French Beans":
            "beans.jpg",

        "Beans":
            "beans.jpg",

        "Garlic":
            "Garlic.jpg",

        "Ginger":
            "Ginger.jpg",

        "Green Chillies":
            "Green Chillies.jpg",

        "Green Cucumber":
            "Green Cucumber.jpg",

        "Green Peas":
            "Green Peas.jpg",

        "Ivy Gourd":
            "Ivy Gourd.jpg",

        "Lady Finger":
            "Lady Finger.jpg",

        "Lemon":
            "Lemon.jpg",

        "Long Pink Brinjal":
            "Long Pink Brinjal.jpg",

        "Mint":
            "Mint.jpg",

        "Onion":
            "onion.jpg",

        "Potato":
            "potato.jpg",

        "Pumpkin":
            "Pumpkin.jpg",

        "Raw Banana":
            "Raw Banana.jpg",

        "Raw Mango":
            "Raw Mango.jpg",

        "Red & Yellow Capsicum":
            "Red & Yellow Capsicum.jpg",

        "Ridge Gourd":
            "Ridge Gourd.jpg",

        "Roselle Leaves":
            "Roselle Leaves.jpg",

        "Sambar Onion":
            "Sambar Onion.jpg",

        "Snake Gourd":
            "Snake Gourd.jpg",

        "Spinach":
            "Spinach.jpg",

        "Sweet Corn":
            "Sweet Corn.jpg",

        "Sweet Potato":
            "Sweet Potato.jpg",

        "Tender Coconut":
            "Tender Coconut.jpg",

        "Tomato":
            "Tomato.jpg",

        "Watermelon":
            "Watermelon.jpg"

    };


    // =====================================================
    // 5. EXACT PRODUCT-NAME MAPPING
    // =====================================================

    if (
        IMAGE_MAP[
            productName
        ]
    ) {

        addCandidate(
            IMAGE_MAP[
                productName
            ]
        );

    }


    // =====================================================
    // 6. NORMALIZE PRODUCT NAME
    // =====================================================

    const normalizedName =
        productName
            .toLowerCase()
            .replace(
                /&/g,
                "and"
            )
            .replace(
                /[^a-z0-9]/g,
                ""
            );


    Object.keys(
        IMAGE_MAP
    ).forEach(
        key => {

            const normalizedKey =
                key
                    .toLowerCase()
                    .replace(
                        /&/g,
                        "and"
                    )
                    .replace(
                        /[^a-z0-9]/g,
                        ""
                    );


            if (
                normalizedKey ===
                normalizedName
            ) {

                addCandidate(
                    IMAGE_MAP[key]
                );

            }

        }
    );


    // =====================================================
    // REMOVE DUPLICATES
    // =====================================================

    const uniqueCandidates =
        [
            ...new Set(
                candidates
            )
        ];


    // =====================================================
    // TRY IMAGES ONE BY ONE
    // =====================================================

    let index = 0;


    function tryNextImage() {

        if (
            index >=
            uniqueCandidates.length
        ) {

            console.error(
                "Checkout image not found:",
                {
                    name:
                        productName,

                    databaseImage:
                        imageValue
                }
            );


            // No emoji fallback
            img.removeAttribute(
                "src"
            );

            img.style.display =
                "none";

            return;
        }


        img.src =
            uniqueCandidates[
                index
            ];

        index++;

    }


    img.onerror =
        tryNextImage;


    // Start image loading
    tryNextImage();

}


// =========================================================
// CHECKOUT IMAGE URL
// =========================================================

function getCheckoutImage(item) {

    const imageValue =
        item.image ||
        item.imageUrl ||
        item.image_url ||
        "";

    const productName =
        item.name ||
        "Vegetable";


    if (imageValue) {

        const value =
            String(
                imageValue
            ).trim();


        if (
            value.startsWith(
                "http://"
            ) ||
            value.startsWith(
                "https://"
            )
        ) {

            return value;

        }


        return (

            "/images/" +

            value
                .replace(
                    /^\/+/,
                    ""
                )
                .replace(
                    /^images\//i,
                    ""
                )

        );

    }


    return (

        "/images/" +

        productName.trim() +

        ".jpg"

    );

}


// =========================================================
// PAGE LOAD
// =========================================================

window.onload = function () {

    loadOrderSummary();

};


// =========================================================
// ORDER SUMMARY
// =========================================================

function loadOrderSummary() {

    const orderItems =
        document.getElementById(
            "orderItems"
        );

    const subtotal =
        document.getElementById(
            "subtotal"
        );

    const total =
        document.getElementById(
            "total"
        );


    if (!orderItems) {

        console.error(
            "orderItems element not found"
        );

        return;

    }


    orderItems.innerHTML = "";

    let grandTotal = 0;


    // =====================================================
    // EMPTY CART
    // =====================================================

    if (
        cart.length === 0
    ) {

        orderItems.innerHTML = `

            <div class="empty-order">

                <div class="empty-order-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some fresh vegetables
                    to continue.
                </p>

            </div>

        `;


        if (subtotal) {

            subtotal.innerText =
                "₹0";

        }


        if (total) {

            total.innerText =
                "₹0";

        }


        return;

    }


    // =====================================================
    // DISPLAY CART ITEMS
    // =====================================================

    cart.forEach(
        item => {

            const price =
                Number(
                    item.price
                ) || 0;


            const quantity =
                Number(
                    item.quantity
                ) || 0;


            const itemTotal =
                price *
                quantity;


            grandTotal +=
                itemTotal;


            // -------------------------------------------------
            // IMAGE
            // -------------------------------------------------

            const imageHTML = `

                <img
                    src=""
                    alt="${
                        item.name ||
                        "Vegetable"
                    }"
                    class="checkout-item-image"
                >

            `;


            // -------------------------------------------------
            // ORDER ITEM
            // -------------------------------------------------

            orderItems.innerHTML += `

                <div class="order-item">


                    <!-- PRODUCT IMAGE -->

                    <div
                        class="checkout-item-image-box"
                    >

                        ${imageHTML}

                    </div>


                    <!-- PRODUCT DETAILS -->

                    <div
                        class="checkout-item-details"
                    >

                        <h4>

                            ${
                                item.name ||
                                "Vegetable"
                            }

                        </h4>


                        <p>

                            ${
                                item.weight ||
                                "1 kg"
                            }

                            ×

                            ${quantity}

                        </p>


                        <span
                            class="checkout-item-price"
                        >

                            ₹${itemTotal.toFixed(2)}

                        </span>

                    </div>


                </div>

            `;

        }
    );


    // =====================================================
    // LOAD ALL CHECKOUT IMAGES
    // =====================================================

    const checkoutImages =
        orderItems.querySelectorAll(
            ".checkout-item-image"
        );


    checkoutImages.forEach(
        (img, index) => {

            const item =
                cart[index];

            if (!item) {
                return;
            }

            setCheckoutSafeImage(
                img,
                item
            );

        }
    );


    // =====================================================
    // TOTALS
    // =====================================================

    if (subtotal) {

        subtotal.innerText =
            "₹" +
            grandTotal.toFixed(2);

    }


    if (total) {

        total.innerText =
            "₹" +
            grandTotal.toFixed(2);

    }

}
// =========================================================
// PLACE ORDER
// =========================================================

async function placeOrder() {

    // =====================================================
    // EMPTY CART CHECK
    // =====================================================

    if (
        cart.length === 0
    ) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    // =====================================================
    // GET CUSTOMER DETAILS
    // =====================================================

    const name =
        document.getElementById(
            "name"
        )
        .value
        .trim();


    const mobile =
        document.getElementById(
            "mobile"
        )
        .value
        .trim();


    const house =
        document.getElementById(
            "house"
        )
        .value
        .trim();


    const area =
        document.getElementById(
            "area"
        )
        .value
        .trim();


    const landmark =
        document.getElementById(
            "landmark"
        )
        .value
        .trim();


    const pincode =
        document.getElementById(
            "pincode"
        )
        .value
        .trim();


    // =====================================================
    // REQUIRED FIELD VALIDATION
    // =====================================================

    if (
        name === "" ||
        mobile === "" ||
        house === "" ||
        area === "" ||
        pincode === ""
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    // =====================================================
    // MOBILE VALIDATION
    // =====================================================

    if (
        !/^[0-9]{10}$/.test(
            mobile
        )
    ) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;

    }


    // =====================================================
    // PINCODE VALIDATION
    // =====================================================

    if (
        !/^[0-9]{6}$/.test(
            pincode
        )
    ) {

        alert(
            "Please enter a valid 6-digit pincode."
        );

        return;

    }


    // =====================================================
    // CALCULATE TOTAL
    // =====================================================

    const totalAmount =
        cart.reduce(
            (
                sum,
                item
            ) => {

                const price =
                    Number(
                        item.price
                    ) || 0;


                const quantity =
                    Number(
                        item.quantity
                    ) || 0;


                return (
                    sum +
                    (
                        price *
                        quantity
                    )
                );

            },
            0
        );


    // =====================================================
    // CREATE ORDER
    // =====================================================

    const order = {

        customerName:
            name,

        mobile:
            mobile,

        house:
            house,

        area:
            area,

        landmark:
            landmark,

        pincode:
            pincode,

        paymentMethod:
            "Cash On Delivery",

        totalAmount:
            totalAmount,


        items:
            cart.map(
                item => ({

                    vegetableId:
                        item.id,

                    name:
                        item.name,

                    image:
                        item.image ||
                        item.imageUrl ||
                        item.image_url ||
                        "",

                    price:
                        Number(
                            item.price
                        ) || 0,

                    weight:
                        item.weight,

                    quantity:
                        Number(
                            item.quantity
                        ) || 0

                })
            )

    };


    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
        "Order being sent:",
        order
    );


    // =====================================================
    // SEND ORDER TO SPRING BOOT
    // =====================================================

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify(
                            order
                        )

                }
            );


        // =================================================
        // RESPONSE CHECK
        // =================================================

        if (
            !response.ok
        ) {

            throw new Error(

                "Failed to place order. Status: " +
                response.status

            );

        }


        // =================================================
        // SAVED ORDER
        // =================================================

        const savedOrder =
            await response.json();


        console.log(
            "Order saved successfully:",
            savedOrder
        );


        // =================================================
        // SAVE CUSTOMER INFORMATION
        // =================================================

        localStorage.setItem(
            "customerPhone",
            mobile
        );


        localStorage.setItem(
            "customerName",
            name
        );


        // =================================================
        // CLEAR CART
        // =================================================

        localStorage.removeItem(
            "rythuFreshCart"
        );


        // =================================================
        // SUCCESS
        // =================================================

        alert(
            "✅ Order Placed Successfully!"
        );


        // =================================================
        // GO TO MY ORDERS
        // =================================================

        window.location.href =
            "my-orders.html";


    }

    catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(
            "❌ Unable to place order. Please try again."
        );

    }

}
// =========================================================
// GO HOME
// =========================================================

function goHome() {

    window.location.href =
        "index.html";

}