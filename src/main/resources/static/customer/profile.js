// =====================================================
// RYTHUFRESH_SEC - CUSTOMER PROFILE
// =====================================================


// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = "/customer";


// =====================================================
// GET LOGGED-IN CUSTOMER ID
// =====================================================

function getCustomerId() {

    const customerId =
        localStorage.getItem("customerId");

    if (!customerId) {

        alert(
            "Please login to access your profile."
        );

        window.location.href =
            "login.html";

        return null;
    }

    return customerId;
}

// =====================================================
// LOAD CUSTOMER PROFILE
// =====================================================

function loadProfile() {

    const customerId =
        getCustomerId();

    if (!customerId) {
        return;
    }


	fetch(
	    `${API_BASE_URL}/id/${customerId}`
	)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load profile"
                );
            }

            return response.json();
        })

        .then(customer => {

            if (customer.success === false) {

                showMessage(
                    customer.message ||
                    "Unable to load profile.",
                    "error"
                );

                return;
            }


            document.getElementById(
                "fullName"
            ).value =
                customer.fullName || "";


            document.getElementById(
                "email"
            ).value =
                customer.email || "";


            document.getElementById(
                "phone"
            ).value =
                customer.phone || "";


            document.getElementById(
                "address"
            ).value =
                customer.address || "";
        })

        .catch(error => {

            console.error(
                "Profile loading error:",
                error
            );

            showMessage(
                "Unable to load profile. Please try again.",
                "error"
            );
        });
}


// =====================================================
// UPDATE CUSTOMER PROFILE
// =====================================================

function updateProfile(event) {

    event.preventDefault();


    const customerId =
        getCustomerId();

    if (!customerId) {
        return;
    }


    const fullName =
        document.getElementById(
            "fullName"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const address =
        document.getElementById(
            "address"
        ).value.trim();


    // =================================================
    // VALIDATION
    // =================================================

    if (!fullName) {

        showMessage(
            "Please enter your full name.",
            "error"
        );

        return;
    }


    if (!email) {

        showMessage(
            "Email is required.",
            "error"
        );

        return;
    }


    if (!phone) {

        showMessage(
            "Please enter your phone number.",
            "error"
        );

        return;
    }


    if (phone.length < 10) {

        showMessage(
            "Please enter a valid phone number.",
            "error"
        );

        return;
    }


    // =================================================
    // SAVE BUTTON
    // =================================================

    const saveButton =
        document.querySelector(
            ".save-btn"
        );

    const originalText =
        saveButton.textContent;


    saveButton.disabled = true;

    saveButton.textContent =
        "Saving...";


    // =================================================
    // REQUEST DATA
    // =================================================

    const customerData = {

        id:
            Number(customerId),

        fullName:
            fullName,

        email:
            email,

        phone:
            phone,

        address:
            address

    };


    // =================================================
    // API REQUEST
    // =================================================

    fetch(

        `${API_BASE_URL}/id/${customerId}`,

        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(
                    customerData
                )

        }

    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Profile update failed. Status: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(data => {

            showMessage(

                "Profile updated successfully!",

                "success"

            );


            // =================================================
            // UPDATE LOCAL STORAGE
            // =================================================

            localStorage.setItem(
                "customerName",
                fullName
            );


            localStorage.setItem(
                "customerPhone",
                phone
            );


            // =================================================
            // LOAD UPDATED PROFILE
            // =================================================

            loadProfile();

        })

        .catch(error => {

            console.error(
                "Profile update error:",
                error
            );


            showMessage(

                error.message ||
                "Unable to update profile. Please try again.",

                "error"

            );

        })

        .finally(() => {

            saveButton.disabled = false;

            saveButton.textContent =
                originalText;

        });

}


// =====================================================
// SHOW PROFILE MESSAGE
// =====================================================

function showMessage(
    message,
    type
) {

    const messageElement =
        document.getElementById(
            "profileMessage"
        );

    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        message;

    messageElement.className =
        "profile-message";

    messageElement.classList.add(
        type
    );


    setTimeout(() => {

        messageElement.className =
            "profile-message";

        messageElement.textContent =
            "";

    }, 4000);
}


// =====================================================
// BACK BUTTON
// =====================================================

function goBack() {

    window.history.back();
}


// =====================================================
// OPEN CHANGE PASSWORD MODAL
// =====================================================

function openChangePassword() {

    const modal =
        document.getElementById(
            "passwordModal"
        );

    if (!modal) {
        return;
    }


    modal.classList.add("show");


    // Clear previous values

    document.getElementById(
        "currentPassword"
    ).value = "";

    document.getElementById(
        "newPassword"
    ).value = "";

    document.getElementById(
        "confirmPassword"
    ).value = "";


    clearPasswordMessage();


    // Focus current password

    setTimeout(() => {

        document.getElementById(
            "currentPassword"
        ).focus();

    }, 100);
}


// =====================================================
// CLOSE CHANGE PASSWORD MODAL
// =====================================================

function closeChangePassword() {

    const modal =
        document.getElementById(
            "passwordModal"
        );

    if (!modal) {
        return;
    }


    modal.classList.remove("show");


    clearPasswordMessage();
}


// =====================================================
// PASSWORD MESSAGE
// =====================================================

function showPasswordMessage(
    message,
    type
) {

    const messageElement =
        document.getElementById(
            "passwordMessage"
        );

    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        message;

    messageElement.className =
        "password-message";

    messageElement.classList.add(
        type
    );
}


function clearPasswordMessage() {

    const messageElement =
        document.getElementById(
            "passwordMessage"
        );

    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        "";

    messageElement.className =
        "password-message";
}


// =====================================================
// CHANGE PASSWORD
// =====================================================

function changePassword(event) {

    event.preventDefault();


    const customerId =
        getCustomerId();

    if (!customerId) {
        return;
    }


    // =================================================
    // GET VALUES
    // =================================================

    const currentPassword =
        document.getElementById(
            "currentPassword"
        ).value;


    const newPassword =
        document.getElementById(
            "newPassword"
        ).value;


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;


    // =================================================
    // VALIDATION
    // =================================================

    if (!currentPassword) {

        showPasswordMessage(
            "Please enter your current password.",
            "error"
        );

        return;
    }


    if (!newPassword) {

        showPasswordMessage(
            "Please enter a new password.",
            "error"
        );

        return;
    }


    if (newPassword.length < 6) {

        showPasswordMessage(
            "New password must contain at least 6 characters.",
            "error"
        );

        return;
    }


    if (newPassword !== confirmPassword) {

        showPasswordMessage(
            "New password and confirm password do not match.",
            "error"
        );

        return;
    }


    if (currentPassword === newPassword) {

        showPasswordMessage(
            "New password must be different from current password.",
            "error"
        );

        return;
    }


    // =================================================
    // BUTTON
    // =================================================

    const updateButton =
        document.querySelector(
            ".update-password-btn"
        );

    const originalText =
        updateButton.textContent;


    updateButton.disabled = true;

    updateButton.textContent =
        "Updating...";


    // =================================================
    // REQUEST DATA
    // =================================================

    const passwordData = {

        currentPassword:
            currentPassword,

        newPassword:
            newPassword
    };


    // =================================================
    // SEND REQUEST
    // =================================================

    fetch(
		`${API_BASE_URL}/id/${customerId}/change-password`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(passwordData)
        }
    )

        .then(async response => {

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Password update failed."
                );
            }

            return data;
        })

        .then(data => {

            if (!data.success) {

                showPasswordMessage(
                    data.message ||
                    "Password update failed.",
                    "error"
                );

                return;
            }


            // =================================================
            // SUCCESS
            // =================================================

            showPasswordMessage(
                data.message ||
                "Password changed successfully!",
                "success"
            );


            // Clear form

            document.getElementById(
                "changePasswordForm"
            ).reset();


            // Close modal after 1.5 seconds

            setTimeout(() => {

                closeChangePassword();

            }, 1500);
        })

        .catch(error => {

            console.error(
                "Password update error:",
                error
            );

            showPasswordMessage(
                error.message ||
                "Password update request failed.",
                "error"
            );
        })

        .finally(() => {

            updateButton.disabled = false;

            updateButton.textContent =
                originalText;
        });
}


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


    localStorage.removeItem(
        "customerId"
    );

    localStorage.removeItem(
        "customerName"
    );

    localStorage.removeItem(
        "customerEmail"
    );

    localStorage.removeItem(
        "customerPhone"
    );


    window.location.href =
        "login.html";
}


// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "passwordModal"
            );

        if (!modal) {
            return;
        }


        if (
            event.target === modal
        ) {

            closeChangePassword();
        }
    }
);


// =====================================================
// ESC KEY CLOSE MODAL
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        const modal =
            document.getElementById(
                "passwordModal"
            );

        if (
            modal &&
            modal.classList.contains("show")
        ) {

            closeChangePassword();
        }
    }
);


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // LOAD CUSTOMER PROFILE
        loadProfile();


        // =================================================
        // SAVE CHANGES BUTTON
        // =================================================

        const saveButton =
            document.querySelector(
                ".save-btn"
            );

        if (saveButton) {

            saveButton.addEventListener(
                "click",
                function(event) {

                    updateProfile(event);

                }
            );

        }

    }
);