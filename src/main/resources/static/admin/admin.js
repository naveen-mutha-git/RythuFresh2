const API_URL = "http://localhost:8080/vegetables";

window.onload = function () {
    loadVegetables();
};

// ================= LOAD VEGETABLES =================

function loadVegetables() {

    fetch(API_URL + "/all")
        .then(response => response.json())
        .then(data => {

            const table = document.getElementById("vegetableTable");

            table.innerHTML = "";

            // Dashboard

            document.getElementById("totalVeg").innerText = data.length;

            document.getElementById("stockCount").innerText =
                data.filter(v => v.inStock).length;

            document.getElementById("outStockCount").innerText =
                data.filter(v => !v.inStock).length;

            // Table

            data.forEach(veg => {

                table.innerHTML += `

                <tr data-telugu="${veg.teluguName}">

                    <td>${veg.id}</td>

                    <td>

                        <img
                            src="/images/${veg.imageUrl}"
                            width="60"
                            height="60"
                            style="
                                object-fit:cover;
                                border-radius:8px;
                            ">

                    </td>

                    <td>${veg.name}</td>

                    <td>

                        ₹${veg.price}/${veg.unit}

                    </td>

                    <td>

                        ${veg.quantity} ${veg.unit}

                    </td>

                    <td>

                        ${veg.inStock
                            ? "🟢 In Stock"
                            : "🔴 Out Of Stock"}

                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editVegetable(${veg.id})">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteVegetable(${veg.id})">

                            Delete

                        </button>

                    </td>

                </tr>

                `;

            });

        })
        .catch(error => console.error(error));

}
// ================= SAVE / UPDATE VEGETABLE =================

async function saveVegetable() {

    const id = document.getElementById("vegId").value;

    const quantity = parseInt(document.getElementById("quantity").value);

    let imageName = document.getElementById("imageUrl").value;

    // ========= Upload Image =========

    const imageFile = document.getElementById("imageFile").files[0];

    if (imageFile) {

        const formData = new FormData();

        formData.append("file", imageFile);

        const uploadResponse = await fetch("http://localhost:8080/upload", {

            method: "POST",

            body: formData

        });

        if (!uploadResponse.ok) {

            alert("❌ Image Upload Failed");

            return;

        }

        imageName = await uploadResponse.text();

        document.getElementById("imageUrl").value = imageName;

    }

    // ===============================

    const vegetable = {

        id: id ? parseInt(id) : null,

        name: document.getElementById("name").value,

        teluguName: document.getElementById("teluguName").value,

        price: parseFloat(document.getElementById("price").value),

        unit: document.getElementById("unit").value,

        quantity: quantity,

        imageUrl: imageName,

        description: document.getElementById("description").value,

        healthBenefits: document.getElementById("healthBenefits").value,

        inStock: quantity > 0

    };

    const url = id
        ? API_URL + "/update"
        : API_URL + "/add";

    const method = id
        ? "PUT"
        : "POST";

    fetch(url, {

        method: method,

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(vegetable)

    })

    .then(response => response.json())

    .then(() => {

        alert(
            id
            ? "✅ Vegetable Updated Successfully"
            : "✅ Vegetable Added Successfully"
        );

        clearForm();

        loadVegetables();

    })

    .catch(error => {

        console.error(error);

        alert("❌ Failed To Save Vegetable");

    });

}
// ================= EDIT VEGETABLE =================

function editVegetable(id) {

    fetch(API_URL + "/" + id)

        .then(response => response.json())

        .then(veg => {

            document.getElementById("vegId").value = veg.id;

            document.getElementById("name").value = veg.name;

            document.getElementById("teluguName").value = veg.teluguName;

            document.getElementById("price").value = veg.price;

            document.getElementById("unit").value = veg.unit;

            document.getElementById("quantity").value = veg.quantity;

            document.getElementById("description").value = veg.description || "";

            document.getElementById("healthBenefits").value = veg.healthBenefits || "";

            document.getElementById("imageUrl").value = veg.imageUrl;

            const preview = document.getElementById("preview");

            if (veg.imageUrl) {

                preview.src = "/images/" + veg.imageUrl;

                preview.style.display = "block";

            } else {

                preview.style.display = "none";

            }

        })

        .catch(error => console.error(error));

}

// ================= DELETE VEGETABLE =================

function deleteVegetable(id) {

    if (!confirm("Delete this vegetable?")) {

        return;

    }

    fetch(API_URL + "/delete/" + id, {

        method: "DELETE"

    })

    .then(() => {

        alert("🗑️ Vegetable Deleted Successfully");

        loadVegetables();

    })

    .catch(error => console.error(error));

}

// ================= CLEAR FORM =================

function clearForm() {

    document.getElementById("vegId").value = "";

    document.getElementById("name").value = "";

    document.getElementById("teluguName").value = "";

    document.getElementById("price").value = "";

    document.getElementById("unit").value = "";

    document.getElementById("quantity").value = "";

    document.getElementById("description").value = "";

    document.getElementById("healthBenefits").value = "";

    document.getElementById("imageUrl").value = "";

    document.getElementById("imageFile").value = "";

    const preview = document.getElementById("preview");

    preview.src = "";

    preview.style.display = "none";

}
// ================= SEARCH VEGETABLE =================

function searchVegetables() {

    const search = document
        .getElementById("search")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#vegetableTable tr");

    rows.forEach(row => {

        const englishName =
            row.cells[2].innerText.toLowerCase();

        const teluguName =
            row.getAttribute("data-telugu").toLowerCase();

        if (
            englishName.includes(search) ||
            teluguName.includes(search)
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}

// ================= IMAGE PREVIEW =================

function previewImage(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        const preview =
            document.getElementById("preview");

        preview.src = e.target.result;

        preview.style.display = "block";

    };

    reader.readAsDataURL(file);

}