// =====================================================
// RYTHUFRESH_SEC CUSTOMER LOGIN
// =====================================================

const API_URL = "/customer";


// =====================================================
// LOGIN CUSTOMER
// =====================================================

function loginCustomer() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const error =
        document.getElementById("errorMessage");

    error.innerHTML = "";


    // =================================================
    // VALIDATION
    // =================================================

    if (email === "" || password === "") {

        error.innerHTML =
            "Please enter Email and Password";

        return;
    }


    // =================================================
    // LOGIN API
    // =================================================

    fetch(API_URL + "/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })
    })

    .then(async response => {

        const data = await response.json();

        return data;
    })

    .then(data => {

        console.log("Login Response:", data);


        // =================================================
        // LOGIN SUCCESS
        // =================================================

        if (data.success === true) {

            localStorage.setItem(
                "customerId",
                data.id
            );

            localStorage.setItem(
                "customerName",
                data.fullName || ""
            );

            localStorage.setItem(
                "customerEmail",
                data.email || ""
            );

            localStorage.setItem(
                "customerPhone",
                data.phone || ""
            );

            localStorage.setItem(
                "customerAddress",
                data.address || ""
            );


            alert("Login Successful!");


            // Go to customer home page
            window.location.href =
                "/customer/index.html";
        }


        // =================================================
        // LOGIN FAILED
        // =================================================

        else {

            error.innerHTML =
                data.message ||
                "Invalid Email or Password";
        }
    })


    // =================================================
    // SERVER ERROR
    // =================================================

    .catch(err => {

        console.error("Login Error:", err);

        error.innerHTML =
            "Server Error. Please try again.";
    });
}


// =====================================================
// OPEN FORGOT PASSWORD
// =====================================================

function openForgotPassword() {

    const modal =
        document.getElementById("forgotPasswordModal");

    if (modal) {
        modal.style.display = "flex";
    }
}


// =====================================================
// CLOSE FORGOT PASSWORD
// =====================================================

function closeForgotPassword() {

    const modal =
        document.getElementById("forgotPasswordModal");

    if (modal) {
        modal.style.display = "none";
    }


    const error =
        document.getElementById("forgotPasswordError");

    if (error) {
        error.innerHTML = "";
    }
}


// =====================================================
// RESET / FORGOT PASSWORD
// =====================================================

function resetPassword() {

    const email =
        document.getElementById("forgotEmail")
            .value.trim();

    const newPassword =
        document.getElementById("forgotNewPassword")
            .value;

    const confirmPassword =
        document.getElementById("forgotConfirmPassword")
            .value;

    const error =
        document.getElementById("forgotPasswordError");

    error.innerHTML = "";


    // =================================================
    // VALIDATION
    // =================================================

    if (
        email === "" ||
        newPassword === "" ||
        confirmPassword === ""
    ) {

        error.innerHTML =
            "Please fill all fields";

        return;
    }


    if (newPassword.length < 6) {

        error.innerHTML =
            "Password must contain at least 6 characters";

        return;
    }


    if (newPassword !== confirmPassword) {

        error.innerHTML =
            "Passwords do not match";

        return;
    }


    // =================================================
    // RESET PASSWORD API
    // =================================================

    fetch(API_URL + "/forgot-password", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            newPassword: newPassword
        })
    })

    .then(async response => {

        const data =
            await response.json();

        return data;
    })

    .then(data => {

        console.log(
            "Reset Password Response:",
            data
        );


        // =================================================
        // RESET SUCCESS
        // =================================================

        if (data.success === true) {

            alert(
                "Password reset successfully! Please login with your new password."
            );

            closeForgotPassword();

            // Clear password fields
            document.getElementById(
                "forgotNewPassword"
            ).value = "";

            document.getElementById(
                "forgotConfirmPassword"
            ).value = "";
        }


        // =================================================
        // RESET FAILED
        // =================================================

        else {

            error.innerHTML =
                data.message ||
                "Password reset failed";
        }
    })


    // =================================================
    // SERVER ERROR
    // =================================================

    .catch(err => {

        console.error(
            "Forgot Password Error:",
            err
        );

        error.innerHTML =
            "Server Error. Please try again.";
    });
}