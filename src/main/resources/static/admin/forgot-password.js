function sendResetRequest() {

    const email =
        document.getElementById("email")
            .value
            .trim();


    if (email === "") {

        alert(
            "Please enter your email."
        );

        return;
    }


    // Ask for new password
    const newPassword =
        prompt(
            "Enter your new password (minimum 6 characters):"
        );


    if (newPassword === null) {
        return;
    }


    if (newPassword.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;
    }


    // Confirm password
    const confirmPassword =
        prompt(
            "Confirm your new password:"
        );


    if (confirmPassword === null) {
        return;
    }


    if (newPassword !== confirmPassword) {

        alert(
            "Passwords do not match."
        );

        return;
    }


    fetch(
        "/api/admin/forgot-password" +
        "?email=" +
        encodeURIComponent(email) +
        "&newPassword=" +
        encodeURIComponent(newPassword),
        {
            method: "PUT"
        }
    )


    .then(response => {

        if (!response.ok) {

            return response.text()
                .then(message => {

                    throw new Error(
                        message ||
                        "Password reset failed"
                    );

                });
        }

        return response.text();
    })


    .then(message => {

        alert(
            message
        );

        // Go back to admin login
        window.location.href =
            "admin-login.html";
    })


    .catch(error => {

        console.error(
            "Admin password reset error:",
            error
        );

        alert(
            error.message ||
            "Unable to reset password."
        );
    });

}