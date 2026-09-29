function registerCustomer() {

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (
        fullName === "" ||
        email === "" ||
        phone === "" ||
        address === "" ||
        password === "" ||
        confirmPassword === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const customer = {
        fullName: fullName,
        email: email,
        phone: phone,
        address: address,
        password: password
    };

    fetch("http://localhost:8080/customer/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(customer)

    })

    .then(response => response.text())

    .then(data => {

        alert(data);

        window.location.href = "login.html";

    })

    .catch(error => {

        alert("Registration Failed");

        console.error(error);

    });

}