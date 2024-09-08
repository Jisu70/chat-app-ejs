
const modal = document.querySelector("#add-conversation-modal");
// typing detector
let typingTimer;
const doneTypingInterval = 500;
const input = document.querySelector("input#user");
const conversation_list = document.querySelector("#conversation-list");
let users_placeholder = document.querySelector(".search_users");

// conversation created failure toast
const conversationFailureToast = Toastify({
    text: "Error creating a conversation!",
    duration: 1000,
});

// Custom toastify message
const showErrorToast = (message) => {
    return Toastify({
        text: message,
        duration: 1000,
    });
}

function closeModal() {
    modal.style.display = "none";
    // reset
    users_placeholder.style.display = "none";
    input.value = "";
}
function openModal() {
    modal.style.display = "block";
}

//on keyup, start the countdown
input.addEventListener("keyup", function () {
    clearTimeout(typingTimer);
    // reset
    users_placeholder.style.display = "none";

    if (input.value) {
        typingTimer = setTimeout(searchUsers, doneTypingInterval);
    }
});

//on keydown, clear the countdown
input.addEventListener("keydown", function () {
    clearTimeout(typingTimer);
});

// send request for search
async function searchUsers() {
    let response = await fetch(`/users/search-user?input=${input.value}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });

    // get response
    let result = await response.json();
    // handle error and response
    if (result.errors) {
        const errorplaceholder = document.querySelector("p.error");
        errorplaceholder.textContent = result.errors.common.msg;
        errorplaceholder.style.display = "block";
    } else {
        if (result.data.length > 0) {
            let generatedHtml = "<ul>";
            result.data.forEach((user) => {
                const avatar = user.avatar
                    ? "./uploads/avatars/" + user.avatar
                    : "./images/nophoto.png";

                generatedHtml += `<li onclick="createConversation('${user._id}', '${user.name}', '${user.avatar}')">
            <div class="user">
              <div class="avatar">
                <img src="${avatar}" />
                <div class="username">${user.name}</div>
              </div>
            </div>
          </li>`;
            });
            generatedHtml += "</ul>";
            users_placeholder.innerHTML = generatedHtml;
            users_placeholder.style.display = "block";
        }
    }
}