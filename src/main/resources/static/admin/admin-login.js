async function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();


    // Check empty fields

    if (username === "" || password === "") {

        alert("Please enter username and password.");

        return;

    }


    try {

        const response = await fetch(
            `/api/admin/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            {
                method: "POST"
            }
        );


        if (response.ok) {

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } else {

            const message = await response.text();

            alert(message);

        }


    } catch (error) {

        console.error("Login error:", error);

        alert("Unable to connect to server.");

    }

}