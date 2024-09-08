$('#login_form_data').submit(function (event) {
    event.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
        type: "POST",
        url: "/",
        data: formData,
        processData: true,
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
            Toastify({
                text: response.message,
                duration: 3000
            }).showToast();
            window.location.href = "/inbox";
        },
        error: function (requestObject, error, errorThrown) {
            $('.error').text(''); // previous error

            // Display new errors
            var errors = requestObject.responseJSON;
            console.log("Error Is :", errors);
            errors.forEach(function (error) {
                if (error.username) {
                    $('#username_error').text(error.username);
                }
                if (error.password) {
                    $('#password_error').text(error.password);
                }
                if (error.message) {
                    $('#api_error').text(error.message);
                }
            });
        }
    });
});

// Toast message for log out ;
const logoutToast = Toastify({
    text: "You are being logged out...",
    duration: 1000
});

// For logout
function logOut() {
    if (confirm("Really want to log out?")) {
        fetch("/", {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    logoutToast.showToast();
                } else {
                    console.log("Logout failed. Status code:", response.status);
                }
            })
            .catch((error) => {
                console.error("An error occurred during logout:", error);
            });
    } else {
        console.log("Logout canceled by the user.");
    }
}

// Function to set the active class on the current menu item
function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item a');

    // Iterate over each menu item and set active class if href matches the current path
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Run the function on page load
window.onload = setActiveMenuItem;