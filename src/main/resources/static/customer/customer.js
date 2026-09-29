const API_URL = "http://localhost:8080/vegetables";

// =====================================================
// CART
// =====================================================
let cart = JSON.parse(localStorage.getItem("rythuFreshCart")) || [];
let vegetables = [];

// =====================================================
// SPECIAL PRODUCTS - SOLD BY PIECE / BUNCH
// =====================================================
const SPECIAL_UNITS = {
    "Bottle Gourd": "piece",
    "Cauliflower": "piece",
    "Drumstick": "bunch",
    "Fenugreek Leaves": "bunch",
    "Roselle Leaves": "bunch",
    "Mint": "bunch",
    "Spinach": "bunch",
    "Coriander": "bunch",
    "Curry Leaves": "bunch",
    "Lemon": "piece",
    "Raw Banana": "piece",
    "Akukura": "bunch",
    "Snake Gourd": "piece",
    "Pumpkin": "piece",
    "Coconut": "piece",
    "Banana Leaf": "piece",
    "Tender Coconut": "piece",
    "Betel Leaf": "bunch"
};

function getDisplayUnit(vegetable) {
    if (!vegetable || !vegetable.name) {
        return vegetable?.unit || "kg";
    }

    return SPECIAL_UNITS[vegetable.name] ||
           vegetable.unit ||
           "kg";
}

// =====================================================
// IMAGE PATH
// =====================================================
function getImageUrl(imageValue, vegetableName = "") {

    if (!imageValue && !vegetableName) {
        return "";
    }

    let value =
        String(
            imageValue || vegetableName
        ).trim();

    if (!value) {
        return "";
    }

    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    value = value
        .replace(/^\/+/, "")
        .replace(/^images\//i, "")
        .replace(/^\/images\//i, "");

    return "/images/" + value;
}

// =====================================================
// IMAGE FALLBACK
// =====================================================
function setSafeImage(
    img,
    imageValue,
    vegetableName
) {

    if (!img) {
        return;
    }

    const filename =
        String(
            imageValue ||
            vegetableName ||
            ""
        ).trim();

    if (!filename) {
        return;
    }

    const cleanName =
        filename
            .replace(/^\/+/, "")
            .replace(/^images\//i, "")
            .replace(/^\/images\//i, "");

    const candidates = [
        "/images/" + cleanName,
        "images/" + cleanName,
        "../images/" + cleanName
    ];

    if (vegetableName) {

        const name =
            String(
                vegetableName
            ).trim();

        candidates.push(
            "/images/" + name + ".jpg"
        );

        candidates.push(
            "/images/" + name + ".JPG"
        );

        candidates.push(
            "images/" + name + ".jpg"
        );

        candidates.push(
            "../images/" + name + ".jpg"
        );
    }

    const uniqueCandidates =
        [...new Set(candidates)];

    let index = 0;

    function tryImage() {

        if (
            index >=
            uniqueCandidates.length
        ) {

            console.error(
                "Image not found:",
                filename
            );

            img.removeAttribute(
                "src"
            );

            img.style.display =
                "none";

            return;
        }

        img.src =
            uniqueCandidates[index++];

    }

    img.onerror = tryImage;

    tryImage();
}

// =====================================================
// PAGE LOAD
// =====================================================
window.onload = function () {

    cleanCart();

    loadVegetables();

    updateCartCount();

    renderCart();

    const params =
        new URLSearchParams(
            window.location.search
        );

    if (
        params.get("openCart") ===
        "true"
    ) {

        openCart();

    }

};

// =====================================================
// CLEAN OLD CART DATA
// =====================================================
function cleanCart() {

    if (!Array.isArray(cart)) {
        cart = [];
    }

    cart =
        cart.filter(
            item =>
                item &&
                item.id !== undefined &&
                item.id !== null
        );

    cart =
        cart.map(item => {

            const quantity =
                Number(
                    item.quantity
                );

            const price =
                Number(
                    item.price
                );

            const specialUnit =
                SPECIAL_UNITS[
                    item.name
                ];

            return {

                ...item,

                quantity:
                    Number.isFinite(
                        quantity
                    ) &&
                    quantity > 0
                        ? quantity
                        : 1,

                price:
                    Number.isFinite(
                        price
                    )
                        ? price
                        : 0,

                weight:
                    specialUnit ||
                    item.weight ||
                    "1kg"

            };

        });

    localStorage.setItem(
        "rythuFreshCart",
        JSON.stringify(cart)
    );
}

// =====================================================
// LOAD VEGETABLES
// =====================================================
async function loadVegetables() {

    const container =
        document.getElementById(
            "vegetableContainer"
        );

    if (!container) {

        console.error(
            "vegetableContainer not found"
        );

        return;
    }

    container.innerHTML = `
        <p style="
            text-align:center;
            width:100%;
            padding:40px;
        ">
            Loading vegetables...
        </p>
    `;

    try {

        const response =
            await fetch(
                API_URL + "/all"
            );

        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );

        }

        const data =
            await response.json();

        vegetables =
            Array.isArray(data)
                ? data
                : [];

        container.innerHTML = "";

        if (
            vegetables.length === 0
        ) {

            container.innerHTML = `
                <div style="
                    text-align:center;
                    width:100%;
                    padding:40px;
                ">
                    <h2>
                        No vegetables available
                    </h2>
                </div>
            `;

            return;
        }

        // =================================================
        // CREATE VEGETABLE CARDS
        // =================================================

        vegetables.forEach(
            veg => {

                const imageValue =
                    veg.imageUrl ||
                    veg.image ||
                    "";

                const displayUnit =
                    getDisplayUnit(
                        veg
                    );

                const isSpecialProduct =
                    Object.prototype.hasOwnProperty.call(
                        SPECIAL_UNITS,
                        veg.name
                    );
					                container.innerHTML += `
					                    <div
					                        class="card"
					                        onclick="openProduct(${veg.id})"
					                    >

					                        <!-- PRODUCT IMAGE -->

					                        <img
					                            class="vegetable-image"
					                            data-image-value="${imageValue}"
					                            data-vegetable-name="${veg.name}"
					                            alt="${veg.name}"
					                        >

					                        <div class="card-body">

					                            <h2>
					                                ${veg.name}
					                            </h2>

					                            <h4>
					                                ${veg.teluguName || ""}
					                            </h4>

					                            <!-- PRICE -->

					                            <div class="price">

					                                ₹${Number(
					                                    veg.price || 0
					                                ).toFixed(2)}

					                                /${displayUnit}

					                            </div>


					                            <!-- WEIGHT / UNIT -->

					                            ${
					                                isSpecialProduct

					                                    ? `

					                                    <div
					                                        class="special-unit-label"
					                                    >

					                                        1 ${displayUnit}

					                                    </div>

					                                    `

					                                    : `

					                                    <select
					                                        id="weight-${veg.id}"
					                                        class="weight-select"
					                                        onclick="
					                                            event.stopPropagation();
					                                        "
					                                        onchange="
					                                            event.stopPropagation();
					                                            updateProductButton(${veg.id});
					                                        "
					                                    >

					                                        <option value="0.25">
					                                            250 g
					                                        </option>

					                                        <option value="0.50">
					                                            500 g
					                                        </option>

					                                        <option value="0.75">
					                                            750 g
					                                        </option>

					                                        <option
					                                            value="1"
					                                            selected
					                                        >
					                                            1 kg
					                                        </option>

					                                    </select>

					                                    `
					                            }


					                            <!-- STOCK -->

					                            <div class="stock">

					                                ${
					                                    veg.inStock

					                                        ? "🟢 In Stock"

					                                        : "🔴 Out Of Stock"
					                                }

					                            </div>


					                            <!-- HEALTH BENEFITS -->

					                            <div
					                                class="health-benefits-toggle"
					                                onclick="
					                                    event.stopPropagation();
					                                "
					                            >

					                                <span>
					                                    ▸
					                                </span>

					                                🌿 Health Benefits

					                            </div>


					                            <!-- CART BUTTON -->

					                            <div
					                                id="cart-control-${veg.id}"
					                                class="product-cart-control"
					                                onclick="
					                                    event.stopPropagation();
					                                "
					                            >

					                            </div>

					                        </div>

					                    </div>

					                `;

					            }
					        );


					        // =================================================
					        // LOAD ALL IMAGES
					        // =================================================

					        const images =
					            container.querySelectorAll(
					                ".vegetable-image"
					            );

					        images.forEach(
					            img => {

					                setSafeImage(
					                    img,
					                    img.dataset.imageValue,
					                    img.dataset.vegetableName
					                );

					            }
					        );


					        // =================================================
					        // UPDATE BUTTONS
					        // =================================================

					        vegetables.forEach(
					            veg => {

					                updateProductButton(
					                    veg.id
					                );

					            }
					        );

					    }

					    catch (error) {

					        console.error(
					            "Failed to load vegetables:",
					            error
					        );

					        container.innerHTML = `

					            <div style="
					                text-align:center;
					                width:100%;
					                padding:40px;
					            ">

					                <h2>
					                    ❌ Unable to load vegetables
					                </h2>

					                <p>
					                    Please make sure Spring Boot
					                    is running.
					                </p>

					                <button
					                    onclick="loadVegetables()"
					                    style="
					                        margin-top:15px;
					                        padding:10px 20px;
					                        cursor:pointer;
					                    "
					                >
					                    🔄 Retry
					                </button>

					            </div>

					        `;

					    }

					}


					// =====================================================
					// GET SELECTED WEIGHT / UNIT
					// =====================================================

					function getSelectedWeight(id) {

					    const vegetable =
					        vegetables.find(
					            v =>
					                Number(v.id) ===
					                Number(id)
					        );

					    if (!vegetable) {
					        return null;
					    }


					    // =================================================
					    // SPECIAL PRODUCTS
					    // PIECE / BUNCH
					    // =================================================

					    if (
					        Object.prototype.hasOwnProperty.call(
					            SPECIAL_UNITS,
					            vegetable.name
					        )
					    ) {

					        return {

					            value: 1,

					            text:
					                SPECIAL_UNITS[
					                    vegetable.name
					                ]

					        };

					    }


					    // =================================================
					    // NORMAL KG PRODUCTS
					    // =================================================

					    const element =
					        document.getElementById(
					            "weight-" + id
					        );

					    if (!element) {

					        return {

					            value: 1,

					            text: "1kg"

					        };

					    }

					    const value =
					        parseFloat(
					            element.value
					        );

					    let text =
					        "1kg";


					    if (
					        value === 0.25
					    ) {

					        text =
					            "250g";

					    }

					    else if (
					        value === 0.50
					    ) {

					        text =
					            "500g";

					    }

					    else if (
					        value === 0.75
					    ) {

					        text =
					            "750g";

					    }

					    else {

					        text =
					            "1kg";

					    }


					    return {

					        value:
					            value,

					        text:
					            text

					    };

					}


					// =====================================================
					// UPDATE PRODUCT BUTTON
					// =====================================================

					function updateProductButton(id) {

					    const control =
					        document.getElementById(
					            "cart-control-" +
					            id
					        );

					    if (!control) {
					        return;
					    }

					    const selectedWeight =
					        getSelectedWeight(
					            id
					        );

					    if (!selectedWeight) {
					        return;
					    }

					    const vegetable =
					        vegetables.find(
					            v =>
					                Number(v.id) ===
					                Number(id)
					        );

					    if (!vegetable) {
					        return;
					    }

					    const item =
					        cart.find(
					            cartItem =>
					                Number(
					                    cartItem.id
					                ) ===
					                    Number(id) &&

					                cartItem.weight ===
					                    selectedWeight.text
					        );


					    // =================================================
					    // OUT OF STOCK
					    // =================================================

					    if (
					        !vegetable.inStock
					    ) {

					        control.innerHTML = `

					            <button
					                class="add-btn"
					                disabled
					            >

					                Out Of Stock

					            </button>

					        `;

					        return;
					    }


					    // =================================================
					    // NOT IN CART
					    // =================================================

					    if (!item) {

					        control.innerHTML = `

					            <button
					                class="add-btn"
					                onclick="
					                    event.stopPropagation();
					                    addToCart(${id});
					                "
					            >

					                ADD

					            </button>

					        `;

					        return;
					    }


					    // =================================================
					    // ALREADY IN CART
					    // =================================================

					    control.innerHTML = `

					        <div
					            class="product-qty-box"
					        >

					            <button
					                class="product-qty-btn"
					                onclick="
					                    event.stopPropagation();
					                    decreaseCardQuantity(${id});
					                "
					            >

					                −

					            </button>


					            <span
					                class="product-qty-number"
					            >

					                ${item.quantity}

					            </span>


					            <button
					                class="product-qty-btn"
					                onclick="
					                    event.stopPropagation();
					                    increaseCardQuantity(${id});
					                "
					            >

					                +

					            </button>

					        </div>

					    `;

					}


					// =====================================================
					// REFRESH PRODUCT BUTTONS
					// =====================================================
					function refreshProductButtons() {

					    vegetables.forEach(
					        veg => {

					            updateProductButton(
					                veg.id
					            );

					        }
					    );

					}


					// =====================================================
					// ADD TO CART
					// =====================================================

					function addToCart(id) {

					    const vegetable =
					        vegetables.find(
					            v =>
					                Number(v.id) ===
					                Number(id)
					        );

					    if (!vegetable) {
					        return;
					    }

					    if (!vegetable.inStock) {

					        alert(
					            "❌ This vegetable is currently out of stock."
					        );

					        return;
					    }

					    const selectedWeight =
					        getSelectedWeight(id);

					    if (!selectedWeight) {
					        return;
					    }


					    // Price according to selected
					    // weight / piece / bunch

					    const actualPrice =
					        Number(
					            vegetable.price || 0
					        ) *
					        selectedWeight.value;


					    let existing =
					        cart.find(
					            item =>
					                Number(item.id) ===
					                    Number(id) &&

					                item.weight ===
					                    selectedWeight.text
					        );


					    if (existing) {

					        existing.quantity =
					            Number(
					                existing.quantity || 0
					            ) + 1;

					    }

					    else {

					        cart.push({

					            id:
					                vegetable.id,

					            name:
					                vegetable.name,

					            image:
					                vegetable.imageUrl ||
					                vegetable.image ||
					                "",

					            price:
					                actualPrice,

					            originalPrice:
					                Number(
					                    vegetable.price || 0
					                ),

					            weight:
					                selectedWeight.text,

					            quantity:
					                1

					        });

					    }


					    syncCart();

					}


					// =====================================================
					// CARD PLUS
					// =====================================================

					function increaseCardQuantity(id) {

					    const selectedWeight =
					        getSelectedWeight(id);

					    if (!selectedWeight) {
					        return;
					    }

					    increaseQuantity(
					        id,
					        selectedWeight.text
					    );

					}


					// =====================================================
					// CARD MINUS
					// =====================================================

					function decreaseCardQuantity(id) {

					    const selectedWeight =
					        getSelectedWeight(id);

					    if (!selectedWeight) {
					        return;
					    }

					    decreaseQuantity(
					        id,
					        selectedWeight.text
					    );

					}


					// =====================================================
					// SAVE CART
					// =====================================================

					function saveCart() {

					    localStorage.setItem(
					        "rythuFreshCart",
					        JSON.stringify(cart)
					    );

					}


					// =====================================================
					// SYNC EVERYTHING
					// =====================================================

					function syncCart() {

					    saveCart();

					    updateCartCount();

					    renderCart();

					    refreshProductButtons();

					}


					// =====================================================
					// CART COUNT
					// =====================================================

					function updateCartCount() {

					    const cartCount =
					        document.getElementById(
					            "cartCount"
					        );

					    if (!cartCount) {
					        return;
					    }

					    const totalItems =
					        cart.reduce(
					            (
					                sum,
					                item
					            ) =>
					                sum +
					                Number(
					                    item.quantity || 0
					                ),
					            0
					        );

					    cartCount.innerText =
					        totalItems;

					}


					// =====================================================
					// RENDER CART
					// =====================================================

					function renderCart() {

					    const cartItems =
					        document.getElementById(
					            "cartItems"
					        );

					    const totalPrice =
					        document.getElementById(
					            "totalPrice"
					        );

					    if (
					        !cartItems ||
					        !totalPrice
					    ) {

					        return;

					    }

					    cartItems.innerHTML = "";

					    let total = 0;


					    // EMPTY CART

					    if (
					        cart.length === 0
					    ) {

					        cartItems.innerHTML = `

					            <p style="
					                text-align:center;
					                padding:30px;
					            ">

					                Your cart is empty 🛒

					            </p>

					        `;

					        totalPrice.innerText =
					            "Total : ₹0";

					        return;

					    }


					    // CART ITEMS

					    cart.forEach(
					        item => {

					            const price =
					                Number(
					                    item.price
					                ) || 0;

					            const quantity =
					                Number(
					                    item.quantity
					                ) || 1;

					            const subtotal =
					                price *
					                quantity;

					            total +=
					                subtotal;


					            cartItems.innerHTML += `

					                <div
					                    class="cart-item"
					                >


					                    <!-- IMAGE -->

					                    <img
					                        class="cart-product-image"
					                        data-image-value="${
					                            item.image || ""
					                        }"
					                        data-vegetable-name="${
					                            item.name || ""
					                        }"
					                        alt="${item.name}"
					                    >


					                    <!-- DETAILS -->

					                    <div
					                        class="cart-details"
					                    >

					                        <h3>
					                            ${item.name}
					                        </h3>


					                        <p>

					                            <b>
					                                Weight:
					                            </b>

					                            ${
					                                item.weight ||
					                                "1kg"
					                            }

					                        </p>


					                        <p>

					                            <b>
					                                Price:
					                            </b>

					                            ₹${
					                                formatPrice(
					                                    price
					                                )
					                            }

					                        </p>


					                        <!-- QUANTITY -->

					                        <div
					                            class="qty-box"
					                        >

					                            <button
					                                class="qty-btn"
					                                onclick="
					                                    decreaseQuantity(
					                                        ${item.id},
					                                        '${item.weight}'
					                                    )
					                                "
					                            >

					                                −

					                            </button>


					                            <span>

					                                ${quantity}

					                            </span>


					                            <button
					                                class="qty-btn"
					                                onclick="
					                                    increaseQuantity(
					                                        ${item.id},
					                                        '${item.weight}'
					                                    )
					                                "
					                            >

					                                +

					                            </button>

					                        </div>


					                        <p>

					                            <b>
					                                Subtotal:
					                            </b>

					                            ₹${
					                                formatPrice(
					                                    subtotal
					                                )
					                            }

					                        </p>

					                    </div>


					                    <!-- DELETE -->

					                    <button
					                        class="delete-btn"
					                        onclick="
					                            removeFromCart(
					                                ${item.id},
					                                '${item.weight}'
					                            )
					                        "
					                    >

					                        ❌

					                    </button>

					                </div>

					            `;

					        }
					    );


					    // =================================================
					    // LOAD CART IMAGES
					    // =================================================

					    const cartImages =
					        cartItems.querySelectorAll(
					            ".cart-product-image"
					        );

					    cartImages.forEach(
					        img => {

					            setSafeImage(
					                img,

					                img.dataset.imageValue,

					                img.dataset.vegetableName

					            );

					        }
					    );

						    totalPrice.innerHTML =
						        "Total : ₹" +
						        formatPrice(
						            total
						        );

						}


						// =====================================================
						// FORMAT PRICE
						// =====================================================

						function formatPrice(price) {

						    const number =
						        Number(price) || 0;

						    return Number.isInteger(
						        number
						    )
						        ? number
						        : number.toFixed(2);

						}


						// =====================================================
						// INCREASE QUANTITY
						// =====================================================

						function increaseQuantity(
						    id,
						    weight
						) {

						    const item =
						        cart.find(
						            c =>
						                Number(c.id) ===
						                    Number(id) &&

						                c.weight ===
						                    weight
						        );

						    if (item) {

						        item.quantity =
						            Number(
						                item.quantity || 0
						            ) + 1;

						    }

						    syncCart();

						}


						// =====================================================
						// DECREASE QUANTITY
						// =====================================================

						function decreaseQuantity(
						    id,
						    weight
						) {

						    const item =
						        cart.find(
						            c =>
						                Number(c.id) ===
						                    Number(id) &&

						                c.weight ===
						                    weight
						        );

						    if (!item) {
						        return;
						    }

						    const currentQuantity =
						        Number(
						            item.quantity || 1
						        );


						    if (
						        currentQuantity > 1
						    ) {

						        item.quantity =
						            currentQuantity - 1;

						    }

						    else {

						        cart =
						            cart.filter(
						                cartItem =>
						                    !(
						                        Number(
						                            cartItem.id
						                        ) ===
						                            Number(id) &&

						                        cartItem.weight ===
						                            weight
						                    )
						            );

						    }

						    syncCart();

						}


						// =====================================================
						// REMOVE FROM CART
						// =====================================================

						function removeFromCart(
						    id,
						    weight
						) {

						    cart =
						        cart.filter(
						            item =>
						                !(
						                    Number(
						                        item.id
						                    ) ===
						                        Number(id) &&

						                    item.weight ===
						                        weight
						                )
						        );

						    syncCart();

						}


						// =====================================================
						// SEARCH
						// =====================================================

						function searchVegetables() {

						    const searchElement =
						        document.getElementById(
						            "search"
						        );

						    if (!searchElement) {
						        return;
						    }

						    const input =
						        searchElement.value
						            .toLowerCase()
						            .trim();

						    const cards =
						        document.querySelectorAll(
						            ".card"
						        );

						    cards.forEach(
						        card => {

						            const nameElement =
						                card.querySelector(
						                    "h2"
						                );

						            if (!nameElement) {
						                return;
						            }

						            const name =
						                nameElement.innerText
						                    .toLowerCase();

						            card.style.display =
						                name.includes(input)
						                    ? ""
						                    : "none";

						        }
						    );

						}

						// =====================================================
						// OFFERS
						// =====================================================

						function showOffers() {

						    alert(
						        "🎁 RythuFresh_Sec Offers\n\n" +
						        "Fresh vegetables at affordable prices.\n\n" +
						        "Place your order today and enjoy fresh vegetables delivered to your doorstep!"
						    );

						}


						// =====================================================
						// CONTACT
						// =====================================================

						function showContact() {

						    alert(
						        "📞 RythuFresh_Sec\n\n" +
						        "Business Contact Number:\n" +
						        "7569796486\n\n" +
						        "For orders, delivery and support,\n" +
						        "please call us."
						    );

					   }
						// =====================================================
						// OPEN CART
						// =====================================================

						function openCart() {

						    const sidebar =
						        document.getElementById(
						            "cartSidebar"
						        );

						    if (sidebar) {

						        sidebar.style.right =
						            "0";

						    }

						}


						// =====================================================
						// CLOSE CART
						// =====================================================

						function closeCart() {

						    const sidebar =
						        document.getElementById(
						            "cartSidebar"
						        );

						    if (sidebar) {

						        sidebar.style.right =
						            "-400px";

						    }

						}


						// =====================================================
						// OPEN PRODUCT
						// =====================================================

						function openProduct(id) {

						    window.location.href =
						        "product.html?id=" +
						        id;

						}


						// =====================================================
						// CHECKOUT
						// =====================================================

						function goToCheckout() {

						    if (
						        cart.length === 0
						    ) {

						        alert(
						            "Your cart is empty."
						        );

						        return;

						    }

						    window.location.href =
						        "checkout.html";

						}


						// =====================================================
						// MY ORDERS
						// =====================================================

						function openMyOrders() {

						    const customerPhone =
						        localStorage.getItem(
						            "customerPhone"
						        );

						    if (!customerPhone) {

						        alert(
						            "Please login to view your orders."
						        );

						        window.location.href =
						            "login.html";

						        return;

						    }

						    window.location.href =
						        "my-orders.html";

						}


						// =====================================================
						// PROFILE
						// =====================================================

						function openProfile() {

						    const customerId =
						        localStorage.getItem(
						            "customerId"
						        );

						    if (!customerId) {

						        alert(
						            "Please login to access your profile."
						        );

						        window.location.href =
						            "login.html";

						        return;

						    }

						    window.location.href =
						        "profile.html";

						}


						// =====================================================
						// HOME
						// =====================================================

						function goHome() {

						    window.location.href =
						        "index.html";

						}