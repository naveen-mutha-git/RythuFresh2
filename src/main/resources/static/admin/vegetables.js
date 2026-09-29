// ======================================================
// RythuFresh_Sec - Admin Vegetables
// ======================================================

const API_URL = "/vegetables";


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadVegetables();

    const form = document.getElementById("vegetableForm");

    if (form) {
        form.addEventListener("submit", saveVegetable);
    }

});


// ======================================================
// LOAD ALL VEGETABLES
// ======================================================

async function loadVegetables() {

    try {

        const response = await fetch(`${API_URL}/all`);

        if (!response.ok) {
            throw new Error("Failed to load vegetables");
        }

        const vegetables = await response.json();

        displayVegetables(vegetables);

    } catch (error) {

        console.error("Error loading vegetables:", error);

        const tableBody =
            document.getElementById("vegetableTableBody");

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="loading">
                        Unable to load vegetables.
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================================
// DISPLAY VEGETABLES
// ======================================================

function displayVegetables(vegetables) {

    const tableBody =
        document.getElementById("vegetableTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";


    // Update total

    const totalElement =
        document.getElementById("vegetableTotal");

    if (totalElement) {

        totalElement.textContent =
            vegetables.length + " vegetables";

    }


    // No vegetables

    if (vegetables.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9"
                    style="text-align:center; padding:30px;">
                    No vegetables found.
                </td>
            </tr>
        `;

        return;
    }


    // Display each vegetable

    vegetables.forEach(function (vegetable) {

        const row =
            document.createElement("tr");


        const stockStatus =
            vegetable.inStock

                ? `<span class="stock-badge stock-in">
                       In Stock
                   </span>`

                : `<span class="stock-badge stock-out">
                       Out of Stock
                   </span>`;


        row.innerHTML = `

            <td>
                ${vegetable.id ?? ""}
            </td>


            <td>

                <img
                    src="${vegetable.imageUrl || 'https://via.placeholder.com/60'}"
                    alt="${escapeHtml(vegetable.name || 'Vegetable')}"
                    class="vegetable-image"
                >

            </td>


            <td>
                ${escapeHtml(vegetable.name || "")}
            </td>


            <td>
                ${escapeHtml(vegetable.teluguName || "")}
            </td>


            <td>
                ₹${Number(vegetable.price || 0).toFixed(2)}
            </td>


            <td>
                ${escapeHtml(vegetable.unit || "")}
            </td>


            <td>
                ${vegetable.quantity ?? 0}
            </td>


            <td>
                ${stockStatus}
            </td>


            <td>

                <button
                    class="edit-btn"
                    onclick="editVegetable(${vegetable.id})">
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteVegetable(${vegetable.id})">
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================================================
// OPEN ADD FORM
// ======================================================

function openAddForm() {

    resetForm();


    const formCard =
        document.getElementById("vegetableFormCard");

    if (formCard) {

        formCard.style.display = "block";

        formCard.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ======================================================
// CLOSE FORM
// ======================================================

function closeForm() {

    resetForm();


    const formCard =
        document.getElementById("vegetableFormCard");

    if (formCard) {

        formCard.style.display = "none";

    }

}


// ======================================================
// SAVE VEGETABLE
// ADD + UPDATE
// ======================================================

async function saveVegetable(event) {

    event.preventDefault();


    const id =
        document.getElementById("vegetableId").value.trim();


    const vegetable = {

        name:
            document.getElementById("name").value.trim(),

        teluguName:
            document.getElementById("teluguName").value.trim(),

        price:
            parseFloat(
                document.getElementById("price").value
            ),

        unit:
            document.getElementById("unit").value.trim(),

        imageUrl:
            document.getElementById("imageUrl").value.trim(),

        quantity:
            parseInt(
                document.getElementById("quantity").value
            ),

        description:
            document.getElementById("description").value.trim(),

        healthBenefits:
            document.getElementById("healthBenefits").value.trim()

    };


    // ==================================================
    // VALIDATION
    // ==================================================

    if (!vegetable.name) {

        alert("Please enter vegetable name.");

        return;

    }


    if (isNaN(vegetable.price)) {

        alert("Please enter a valid price.");

        return;

    }


    if (isNaN(vegetable.quantity)) {

        alert("Please enter a valid quantity.");

        return;

    }


    try {

        let response;


        // ==================================================
        // UPDATE EXISTING VEGETABLE
        // ==================================================

        if (id) {

            vegetable.id =
                parseInt(id);


            response = await fetch(
                `${API_URL}/update`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(vegetable)

                }
            );

        }


        // ==================================================
        // ADD NEW VEGETABLE
        // ==================================================

        else {

            response = await fetch(
                `${API_URL}/add`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(vegetable)

                }
            );

        }


        if (!response.ok) {

            throw new Error(
                "Failed to save vegetable"
            );

        }


        // ==================================================
        // SUCCESS
        // ==================================================

        alert(
            id
                ? "Vegetable updated successfully!"
                : "Vegetable added successfully!"
        );


        closeForm();

        loadVegetables();


    } catch (error) {

        console.error(
            "Error saving vegetable:",
            error
        );

        alert(
            "Unable to save vegetable."
        );

    }

}


// ======================================================
// EDIT VEGETABLE
// ======================================================

async function editVegetable(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);


        if (!response.ok) {

            throw new Error(
                "Vegetable not found"
            );

        }


        const vegetable =
            await response.json();


        // Fill form

        document.getElementById("vegetableId").value =
            vegetable.id ?? "";


        document.getElementById("name").value =
            vegetable.name ?? "";


        document.getElementById("teluguName").value =
            vegetable.teluguName ?? "";


        document.getElementById("price").value =
            vegetable.price ?? "";


        document.getElementById("unit").value =
            vegetable.unit ?? "";


        document.getElementById("imageUrl").value =
            vegetable.imageUrl ?? "";


        document.getElementById("quantity").value =
            vegetable.quantity ?? "";


        document.getElementById("description").value =
            vegetable.description ?? "";


        document.getElementById("healthBenefits").value =
            vegetable.healthBenefits ?? "";


        // Change title

        const formTitle =
            document.getElementById("formTitle");

        if (formTitle) {

            formTitle.textContent =
                "Edit Vegetable";

        }


        // Change button

        const saveBtn =
            document.getElementById("saveBtn");

        if (saveBtn) {

            saveBtn.textContent =
                "Update Vegetable";

        }


        // Show cancel

        const cancelBtn =
            document.getElementById("cancelBtn");

        if (cancelBtn) {

            cancelBtn.style.display =
                "inline-block";

        }


        // Show form

        const formCard =
            document.getElementById("vegetableFormCard");

        if (formCard) {

            formCard.style.display =
                "block";


            formCard.scrollIntoView({
                behavior: "smooth"
            });

        }


    } catch (error) {

        console.error(
            "Error loading vegetable:",
            error
        );

        alert(
            "Unable to load vegetable details."
        );

    }

}


// ======================================================
// DELETE VEGETABLE
// ======================================================

async function deleteVegetable(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this vegetable?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/delete/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete vegetable"
            );

        }


        alert(
            "Vegetable deleted successfully!"
        );


        loadVegetables();


    } catch (error) {

        console.error(
            "Error deleting vegetable:",
            error
        );

        alert(
            "Unable to delete vegetable."
        );

    }

}


// ======================================================
// RESET FORM
// ======================================================

function resetForm() {

    const form =
        document.getElementById("vegetableForm");


    if (form) {

        form.reset();

    }


    document.getElementById("vegetableId").value =
        "";


    const formTitle =
        document.getElementById("formTitle");

    if (formTitle) {

        formTitle.textContent =
            "Add Vegetable";

    }


    const saveBtn =
        document.getElementById("saveBtn");

    if (saveBtn) {

        saveBtn.textContent =
            "Save Vegetable";

    }


    const cancelBtn =
        document.getElementById("cancelBtn");

    if (cancelBtn) {

        cancelBtn.style.display =
            "inline-block";

    }

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    const confirmed =
        confirm("Do you want to logout?");


    if (confirmed) {

        window.location.href =
            "admin-login.html";

    }

}