const API_URL = "/vegetables";

let quantity = 1;
let vegetable = null;

let cart =
    JSON.parse(localStorage.getItem("rythuFreshCart")) || [];


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    console.log("Product ID:", id);

    if (!id) {
        showProductError("Product ID is missing.");
        return;
    }

    loadProduct(id);

    updateProductCartCount();

    const plusBtn = document.getElementById("plusBtn");
    const minusBtn = document.getElementById("minusBtn");

    if (plusBtn) {
        plusBtn.onclick = function () {
            quantity++;
            updateQuantityDisplay();
        };
    }

    if (minusBtn) {
        minusBtn.onclick = function () {
            if (quantity > 1) {
                quantity--;
                updateQuantityDisplay();
            }
        };
    }
});


/* =====================================================
   LOAD PRODUCT
===================================================== */

async function loadProduct(id) {

    const productId = encodeURIComponent(id);

    const url = `${API_URL}/${productId}`;

    console.log("Loading product from:", url);

    let lastError = null;

    /*
       Railway/Spring Boot can sometimes take a few seconds
       to wake up. Try the request 3 times.
    */

    for (let attempt = 1; attempt <= 3; attempt++) {

        try {

            console.log(`Product request attempt ${attempt}`);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(
                    `Server returned ${response.status}`
                );
            }

            const data = await response.json();

            console.log("Product received:", data);

            if (!data || !data.id) {
                throw new Error("Invalid product data received.");
            }

            vegetable = data;

            displayProduct(data);

            syncQuantityFromCart();

            return;

        } catch (error) {

            console.error(
                `Product loading failed - attempt ${attempt}:`,
                error
            );

            lastError = error;

            /*
               Wait before retrying.
               This is especially useful when Railway
               is waking the Spring Boot service.
            */

            if (attempt < 3) {
                await new Promise(resolve =>
                    setTimeout(resolve, 2000)
                );
            }
        }
    }

    console.error("Final product loading error:", lastError);

    showProductError(
        "Unable to load this product. Please try again."
    );
}


/* =====================================================
   DISPLAY PRODUCT
===================================================== */

function displayProduct(data) {

    const nameElement =
        document.getElementById("productName");

    const priceElement =
        document.getElementById("productPrice");

    const descriptionElement =
        document.getElementById("productDescription");

    const taglineElement =
        document.getElementById("productTagline");

    const imageElement =
        document.getElementById("productImage");

    const benefitsElement =
        document.getElementById("healthBenefits");


    /* ---------- NAME ---------- */

    if (nameElement) {
        nameElement.innerText =
            data.name || "Vegetable";
    }


    /* ---------- PRICE ---------- */

    if (priceElement) {

        const price =
            data.price !== undefined &&
            data.price !== null
                ? data.price
                : 0;

        const unit =
            data.unit || "kg";

        priceElement.innerText =
            "₹" + price + " / " + unit;
    }


    /* ---------- DESCRIPTION ---------- */

    if (descriptionElement) {

        descriptionElement.innerText =
            data.description ||
            "Fresh and healthy vegetable.";
    }


    /* ---------- TAGLINE ---------- */

    if (taglineElement) {

        taglineElement.innerText =
            "Fresh • Healthy • Premium Quality 🥬";
    }


    /* ---------- IMAGE ---------- */

    loadProductImage(
        imageElement,
        data
    );

   /* ---------- HEALTH BENEFITS ---------- */

if (benefitsElement) {

    benefitsElement.innerHTML = "";

    /*
       Read the health benefits directly from the
       vegetable data received from the backend.
    */
    const rawBenefits =
        data.healthBenefits ??
        data.healthBenefit ??
        data.health_benefits ??
        data.benefits;

    let benefitList = [];

    if (Array.isArray(rawBenefits)) {

        benefitList = rawBenefits
            .map(item => String(item).trim())
            .filter(item => item !== "");

    } else if (
        rawBenefits !== undefined &&
        rawBenefits !== null
    ) {

        const value = String(rawBenefits).trim();

        benefitList = value
            .split(/[;\n]+/)
            .map(item => item.trim())
            .filter(item => item !== "");
    }

    /*
       Use the default only when the database
       does not contain a health benefit.
    */
    if (benefitList.length === 0) {

        benefitList = [
            "Fresh and nutritious"
        ];
    }

    benefitList.forEach(item => {

        const li =
            document.createElement("li");

        li.innerText = item;

        benefitsElement.appendChild(li);
    });
}
}
/* =====================================================
   PRODUCT IMAGE
===================================================== */

function loadProductImage(imageElement, data) {

    if (!imageElement) {
        return;
    }

    const candidates = [];

    const imageUrl = data.imageUrl;
    const name = data.name;


    /*
       First use the exact image URL from database.
    */

    if (imageUrl) {

        if (
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
        ) {

            candidates.push(imageUrl);

        } else {

            candidates.push(
                imageUrl.startsWith("/")
                    ? imageUrl
                    : "/" + imageUrl
            );

            candidates.push(
                "/images/" +
                encodeURIComponent(imageUrl)
            );
        }
    }


    /*
       Try product name formats.
    */

    if (name) {

        candidates.push(
            "/images/" +
            encodeURIComponent(name + ".jpg")
        );

        const underscoreName =
            name
                .toLowerCase()
                .replace(/\s+/g, "_") +
            ".jpg";

        candidates.push(
            "/images/" +
            encodeURIComponent(underscoreName)
        );

        const lowercaseName =
            name.toLowerCase() + ".jpg";

        candidates.push(
            "/images/" +
            encodeURIComponent(lowercaseName)
        );
    }


    /*
       Remove duplicate URLs.
    */

    const uniqueCandidates =
        [...new Set(candidates)];


    let index = 0;


    function tryNextImage() {

        if (index >= uniqueCandidates.length) {

            console.error(
                "No product image found:",
                data.name,
                uniqueCandidates
            );

            /*
               Hide broken image instead of showing
               the browser's broken-image icon.
            */

            imageElement.style.display = "none";

            return;
        }

        const imagePath =
            uniqueCandidates[index];

        index++;

        console.log(
            "Trying product image:",
            imagePath
        );

        imageElement.onerror =
            function () {

                console.warn(
                    "Image failed:",
                    imagePath
                );

                tryNextImage();
            };

        imageElement.onload =
            function () {

                imageElement.style.display =
                    "block";

            };

        imageElement.src = imagePath;
    }


    tryNextImage();
}


/* =====================================================
   PRODUCT ERROR
===================================================== */

function showProductError(message) {

    const nameElement =
        document.getElementById("productName");

    const priceElement =
        document.getElementById("productPrice");

    const descriptionElement =
        document.getElementById("productDescription");

    if (nameElement) {
        nameElement.innerText =
            "Unable to Load Product";
    }

    if (priceElement) {
        priceElement.innerText =
            "Please try again";
    }

    if (descriptionElement) {
        descriptionElement.innerText =
            message;
    }
}


/* =====================================================
   PRODUCT WEIGHT
===================================================== */

function getProductWeight() {

    if (!vegetable) {
        return "";
    }

    const unit =
        String(vegetable.unit || "")
            .toLowerCase();

    if (unit === "kg") {
        return "1kg";
    }

    return vegetable.unit;
}


/* =====================================================
   SYNC QUANTITY
===================================================== */

function syncQuantityFromCart() {

    if (!vegetable) {
        return;
    }

    cart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];

    const productWeight =
        getProductWeight();

    const existing =
        cart.find(item =>
            Number(item.id) ===
                Number(vegetable.id) &&
            item.weight === productWeight
        );

    if (existing) {

        quantity =
            Number(existing.quantity) || 1;

    } else {

        quantity = 1;
    }

    updateQuantityDisplay();
}


/* =====================================================
   QUANTITY DISPLAY
===================================================== */

function updateQuantityDisplay() {

    const quantityElement =
        document.getElementById("quantity");

    if (quantityElement) {

        quantityElement.innerText =
            quantity;
    }
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart() {

    if (!vegetable) {

        alert(
            "Product is still loading. Please wait."
        );

        return;
    }


    if (!vegetable.inStock) {

        alert(
            "❌ This vegetable is currently out of stock."
        );

        return;
    }


    cart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];


    const productWeight =
        getProductWeight();


    const existing =
        cart.find(item =>
            Number(item.id) ===
                Number(vegetable.id) &&
            item.weight === productWeight
        );


    if (existing) {

        existing.quantity =
            quantity;

    } else {

        cart.push({

            id:
                vegetable.id,

            name:
                vegetable.name,

            image:
                vegetable.imageUrl,

            price:
                Number(vegetable.price),

            originalPrice:
                Number(vegetable.price),

            weight:
                productWeight,

            quantity:
                quantity
        });
    }


    saveCart();

    updateProductCartCount();

    renderProductCart();
}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(
        "rythuFreshCart",
        JSON.stringify(cart)
    );
}


/* =====================================================
   CART COUNT
===================================================== */

function updateProductCartCount() {

    const latestCart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];


    const totalItems =
        latestCart.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );


    const cartCount =
        document.getElementById(
            "productCartCount"
        );


    if (cartCount) {

        cartCount.innerText =
            totalItems;
    }
}


/* =====================================================
   HOME
===================================================== */

function goHome() {

    window.location.href =
        "index.html";
}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    cart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];

    renderProductCart();

    const sidebar =
        document.getElementById("cartSidebar");

    if (sidebar) {

        sidebar.style.right = "0";
    }
}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    const sidebar =
        document.getElementById("cartSidebar");

    if (sidebar) {

        sidebar.style.right = "-420px";
    }
}


/* =====================================================
   RENDER CART
===================================================== */

function renderProductCart() {

    cart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];


    const cartItems =
        document.getElementById("cartItems");

    const totalPrice =
        document.getElementById("totalPrice");


    if (!cartItems || !totalPrice) {
        return;
    }


    cartItems.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

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


    cart.forEach(item => {

        const subtotal =
            Number(item.price) *
            Number(item.quantity);

        total += subtotal;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="/images/${encodeURIComponent(item.image || "")}"
                    alt="${item.name || "Vegetable"}"
                    onerror="
                        this.onerror = null;
                        this.src =
                        '/images/' +
                        encodeURIComponent(
                            '${item.name}.jpg'
                        );
                    "
                >

                <div class="cart-details">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        <b>Weight :</b>
                        ${item.weight}
                    </p>

                    <p>
                        <b>Price :</b>
                        ₹${item.price}
                    </p>

                    <div class="qty-box">

                        <button
                            class="qty-btn"
                            onclick="
                                decreaseProductCartQuantity(
                                    ${item.id},
                                    '${item.weight}'
                                )
                            "
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="qty-btn"
                            onclick="
                                increaseProductCartQuantity(
                                    ${item.id},
                                    '${item.weight}'
                                )
                            "
                        >
                            +
                        </button>

                    </div>

                    <p>
                        <b>Subtotal :</b>
                        ₹${subtotal}
                    </p>

                </div>

                <button
                    class="delete-btn"
                    onclick="
                        removeProductCartItem(
                            ${item.id},
                            '${item.weight}'
                        )
                    "
                >
                    ✕
                </button>

            </div>
        `;
    });


    totalPrice.innerText =
        "Total : ₹" + total;
}


/* =====================================================
   INCREASE CART QUANTITY
===================================================== */

function increaseProductCartQuantity(id, weight) {

    const item =
        cart.find(item =>
            Number(item.id) === Number(id) &&
            item.weight === weight
        );


    if (item) {

        item.quantity++;
    }


    saveCart();

    updateProductCartCount();

    renderProductCart();

    syncCurrentProductQuantity();
}


/* =====================================================
   DECREASE CART QUANTITY
===================================================== */

function decreaseProductCartQuantity(id, weight) {

    const item =
        cart.find(item =>
            Number(item.id) === Number(id) &&
            item.weight === weight
        );


    if (!item) {
        return;
    }


    if (item.quantity > 1) {

        item.quantity--;

    } else {

        removeProductCartItem(
            id,
            weight
        );

        return;
    }


    saveCart();

    updateProductCartCount();

    renderProductCart();

    syncCurrentProductQuantity();
}


/* =====================================================
   REMOVE CART ITEM
===================================================== */

function removeProductCartItem(id, weight) {

    cart =
        cart.filter(item =>
            !(
                Number(item.id) === Number(id) &&
                item.weight === weight
            )
        );


    saveCart();

    updateProductCartCount();

    renderProductCart();

    syncCurrentProductQuantity();
}


/* =====================================================
   SYNC CURRENT PRODUCT
===================================================== */

function syncCurrentProductQuantity() {

    if (!vegetable) {
        return;
    }


    const productWeight =
        String(vegetable.unit || "")
            .toLowerCase() === "kg"
                ? "1kg"
                : vegetable.unit;


    const existing =
        cart.find(item =>
            Number(item.id) ===
                Number(vegetable.id) &&
            item.weight === productWeight
        );


    if (existing) {

        quantity =
            Number(existing.quantity) || 1;

    } else {

        quantity = 1;
    }


    updateQuantityDisplay();
}


/* =====================================================
   CHECKOUT
===================================================== */

function goToCart() {

    window.location.href =
        "index.html?openCart=true";
}


function goToCheckout() {

    window.location.href =
        "checkout.html";
}
