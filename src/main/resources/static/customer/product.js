const API_URL = "/vegetables";

// ===================== VARIABLES =====================

let quantity = 1;
let vegetable = null;

let cart =
    JSON.parse(localStorage.getItem("rythuFreshCart")) || [];


// ===================== PAGE LOAD =====================

window.onload = function () {

    const params =
        new URLSearchParams(window.location.search);

    const id =
        params.get("id");

    if (id) {

        loadProduct(id);

    } else {

        console.error("Product ID not found.");

        document.getElementById("productName").innerText =
            "Product Not Found";

    }

    updateProductCartCount();
};


// ===================== LOAD PRODUCT =====================

function loadProduct(id) {

    fetch(API_URL + "/" + id)

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load product.");
            }

            return response.json();
        })

        .then(data => {

            vegetable = data;

			// ===================== PRODUCT IMAGE =====================

			const productImage =
			    document.getElementById("productImage");

			productImage.alt = data.name;

			// Function to try different image filename formats
			function tryProductImage(imageElement, imageUrl, productName) {

			    const candidates = [];

			    // 1. Exact filename from MySQL
			    if (imageUrl) {
			        candidates.push(
			            "/images/" + encodeURIComponent(imageUrl)
			        );
			    }

			    // 2. Actual product name
			    if (productName) {
			        candidates.push(
			            "/images/" +
			            encodeURIComponent(productName + ".jpg")
			        );
			    }

			    // 3. Lowercase with underscores
			    if (productName) {

			        const underscoreName =
			            productName
			                .toLowerCase()
			                .replace(/\s+/g, "_") + ".jpg";

			        candidates.push(
			            "/images/" +
			            encodeURIComponent(underscoreName)
			        );
			    }

			    // 4. Lowercase with spaces
			    if (productName) {

			        const lowercaseName =
			            productName.toLowerCase() + ".jpg";

			        candidates.push(
			            "/images/" +
			            encodeURIComponent(lowercaseName)
			        );
			    }

			    let currentIndex = 0;

			    function loadNextImage() {

			        if (currentIndex >= candidates.length) {

			            console.error(
			                "Image not found for:",
			                productName,
			                candidates
			            );

			            imageElement.removeAttribute("src");

			            return;
			        }

			        const imagePath =
			            candidates[currentIndex];

			        currentIndex++;

			        imageElement.onerror = function () {

			            console.warn(
			                "Image failed:",
			                imagePath
			            );

			            loadNextImage();
			        };

			        imageElement.src = imagePath;
			    }

			    loadNextImage();
			}


			// Load product image
			tryProductImage(
			    productImage,
			    data.imageUrl,
			    data.name
			);

            // NAME
            document.getElementById("productName").innerText =
                data.name;


            // PRICE
            document.getElementById("productPrice").innerText =
                "₹" + data.price + " / " + data.unit;


            // DESCRIPTION
            document.getElementById("productDescription").innerText =
                data.description || "";


            // TAGLINE
            document.getElementById("productTagline").innerText =
                "Fresh • Healthy • Premium Quality 🥬";


				// ===================== HEALTH BENEFITS =====================

				const benefits =
				    document.getElementById("healthBenefits");

				benefits.innerHTML = "";

				if (data.healthBenefits) {

				    const benefitList =
				        data.healthBenefits
				            .split(";")
				            .map(item => item.trim())
				            .filter(item => item !== "");

				    benefitList.forEach(item => {

				        const li =
				            document.createElement("li");

				        li.innerText = item;

				        benefits.appendChild(li);

				    });

				}


            // IMPORTANT:
            // Load quantity already selected on home page
            syncQuantityFromCart();

        })

        .catch(error => {

            console.error(
                "Product loading error:",
                error
            );

            document.getElementById("productName").innerText =
                "Unable to Load Product";

            document.getElementById("productDescription").innerText =
                "Please try again.";

        });
}


// ===================== GET PRODUCT WEIGHT =====================

function getProductWeight() {

    if (!vegetable) {
        return "";
    }

    const unit =
        vegetable.unit.toLowerCase();

    if (unit === "kg") {

        return "1kg";

    }

    return vegetable.unit;
}


// ===================== SYNC QUANTITY FROM CART =====================

function syncQuantityFromCart() {

    if (!vegetable) {
        return;
    }

    // Always get latest cart
    cart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];

    const productWeight =
        getProductWeight();

    const existing =
        cart.find(item =>
            Number(item.id) === Number(vegetable.id) &&
            item.weight === productWeight
        );


    if (existing) {

        quantity =
            existing.quantity;

    } else {

        quantity = 1;

    }


    updateQuantityDisplay();
}


// ===================== UPDATE QUANTITY DISPLAY =====================

function updateQuantityDisplay() {

    const quantityElement =
        document.getElementById("quantity");

    if (quantityElement) {

        quantityElement.innerText =
            quantity;

    }
}


// ===================== PLUS BUTTON =====================

document.getElementById("plusBtn").onclick =
    function () {

        quantity++;

        updateQuantityDisplay();

    };


// ===================== MINUS BUTTON =====================

document.getElementById("minusBtn").onclick =
    function () {

        if (quantity > 1) {

            quantity--;

            updateQuantityDisplay();

        }

    };


// ===================== ADD TO CART =====================

function addToCart() {

    if (!vegetable) {

        alert("Product is still loading.");

        return;
    }


    // OUT OF STOCK CHECK
    if (!vegetable.inStock) {

        alert(
            "❌ This vegetable is currently out of stock."
        );

        return;
    }


    // Get latest cart
    cart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];


    // IMPORTANT:
    // Use same weight format as customer.js
    const productWeight =
        getProductWeight();


    // Find existing product
    const existing =
        cart.find(item =>
            Number(item.id) === Number(vegetable.id) &&
            item.weight === productWeight
        );


    if (existing) {

        // Update quantity
        existing.quantity =
            quantity;

    } else {

        // Add new product
        cart.push({

            id:
                vegetable.id,

            name:
                vegetable.name,

            image:
                vegetable.imageUrl,

            price:
                vegetable.price,

            originalPrice:
                vegetable.price,

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


// ===================== SAVE CART =====================

function saveCart() {

    localStorage.setItem(
        "rythuFreshCart",
        JSON.stringify(cart)
    );
}


// ===================== CART COUNT =====================

function updateProductCartCount() {

    const latestCart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];


    const totalItems =
        latestCart.reduce(
            (sum, item) =>
                sum + Number(item.quantity),
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


// ===================== GO HOME =====================

function goHome() {

    window.location.href =
        "index.html";
}


// ===================== OPEN CART =====================

function openCart() {

    // Always get latest cart
    cart =
        JSON.parse(
            localStorage.getItem("rythuFreshCart")
        ) || [];

    renderProductCart();

    document.getElementById(
        "cartSidebar"
    ).style.right = "0";

}


// ===================== CLOSE CART =====================

function closeCart() {

    document.getElementById(
        "cartSidebar"
    ).style.right = "-420px";

}


// ===================== RENDER PRODUCT CART =====================

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


    // EMPTY CART

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


    // CART PRODUCTS

    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;

        total += subtotal;


        cartItems.innerHTML += `

            <div class="cart-item">

			<img
			    src="/images/${encodeURIComponent(item.image)}"
			    alt="${item.name}"
			    onerror="
			        this.onerror = null;
			        this.src = '/images/' +
			        encodeURIComponent('${item.name}.jpg');
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
                            onclick="decreaseProductCartQuantity(
                                ${item.id},
                                '${item.weight}'
                            )">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="qty-btn"
                            onclick="increaseProductCartQuantity(
                                ${item.id},
                                '${item.weight}'
                            )">
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
                    onclick="removeProductCartItem(
                        ${item.id},
                        '${item.weight}'
                    )">

                    ✕

                </button>

            </div>

        `;

    });


    totalPrice.innerText =
        "Total : ₹" + total;

}


// ===================== INCREASE CART QUANTITY =====================

function increaseProductCartQuantity(id, weight) {

    const item =
        cart.find(item =>
            item.id === id &&
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


// ===================== DECREASE CART QUANTITY =====================

function decreaseProductCartQuantity(id, weight) {

    const item =
        cart.find(item =>
            item.id === id &&
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


// ===================== REMOVE CART ITEM =====================

function removeProductCartItem(id, weight) {

    cart =
        cart.filter(item =>
            !(
                item.id === id &&
                item.weight === weight
            )
        );


    saveCart();

    updateProductCartCount();

    renderProductCart();

    syncCurrentProductQuantity();

}


// ===================== SYNC CURRENT PRODUCT =====================

function syncCurrentProductQuantity() {

    if (!vegetable) {
        return;
    }


    const productWeight =
        vegetable.unit.toLowerCase() === "kg"
            ? "1kg"
            : vegetable.unit;


    const existing =
        cart.find(item =>
            item.id === vegetable.id &&
            item.weight === productWeight
        );


    if (existing) {

        quantity =
            existing.quantity;

    } else {

        quantity = 1;

    }


    updateQuantityDisplay();

}


// ===================== CHECKOUT =====================

function goToCart() {

    window.location.href = "index.html?openCart=true";

}
// ===================== GO TO CHECKOUT =====================

function goToCheckout() {

    window.location.href = "checkout.html";

}