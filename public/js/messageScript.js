const chat_form = document.getElementById("chat-form");
const chatTitleContainer = document.querySelector("#chat-message-list");
const loggedinUserId = "<%= loggedinUserId %>";
let current_conversation_id;
// Connect to the server
const socket = io('<%=process.env.APP_URL%>');
// Function to join a conversation room
function joinConversation(conversation_id) {
    if (current_conversation_id) {
        socket.emit("leave_room", { conversation_id: current_conversation_id });
    }
    current_conversation_id = conversation_id;
    socket.emit("join_room", { conversation_id });
}
// create Conversation
async function createConversation(participant_id) {
    try {
        const response = await fetch("/inbox/create-conversation", {
            method: "POST",
            body: JSON.stringify({
                id: participant_id,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });

        const result = await response.json();

        if (!result.errors) {
            // reset
            users_placeholder.style.display = "none";
            input.value = name;
            // reload the page after 1 second
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            throw new Error(result.errors.common.msg);
        }
    } catch (err) {
        const toastObject = showErrorToast(err);
        toastObject.showToast();
    }
}
// To ACtive the slected chat
document.addEventListener("DOMContentLoaded", function () {
    var conversations = document.querySelectorAll(".conversation");

    conversations.forEach(function (conversation) {
        conversation.addEventListener("click", function () {
            // Remove 'active' class from all conversations
            conversations.forEach(function (conv) {
                conv.classList.remove("active");
            });
            // Add 'active' class to the clicked conversation
            conversation.classList.add("active");
            chat_form.style.visibility = "visible";
        });
    });
});

// Listen for new messages emitted by the server
socket.on("new_message", (data) => {
    // only respond if current conversation is open in any client
    if (data.conversation_id === current_conversation_id) {
        // message class
        const messageClass = data.sender.id === loggedinUserId ? "you-message" : "other-message";

        const senderAvatar = data.sender.avatar ? `<img src="./uploads/avatars/${data.sender.avatar}" alt="${data.sender.name}" />` : `<img src="./images/nophoto.png" alt="${data.sender.name}" />`;

        // message attachments
        let attachments = '<div class="attachments">';

        if (data.attachment && data.attachment.length > 0) {
            data.attachment.forEach((attachment) => {
                attachments += `<img src="./uploads/attachments/${attachment}" /> `;
            });
        }

        attachments += "</div>";

        let messageHTML;

        // do not show avatar for loggedin user
        if (data.sender.id === loggedinUserId) {
            messageHTML = `<div class="message-row ${messageClass}"><div class="message-content">
              <div class="message-text">${data.message}</div>
              ${attachments}
              <div class="message-time">${moment(data.date_time).fromNow()}</div>
            </div></div>`;
        } else {
            messageHTML = `<div class="message-row ${messageClass}"><div class="message-content">
            ${senderAvatar}
            <div class="message-text">${data.message}</div>
            ${attachments}
            <div class="message-time">${moment(data.date_time).fromNow()}</div>
            </div></div>`;
        }

        // append the inoming message to message area as last item
        document.querySelector("#chat-message-list > .message-row:first-child").insertAdjacentHTML("beforeBegin", messageHTML);
    }
});

// Get message of the chats
async function getMessages(conversation_id) {
    try {
        const conversationIdInput = document.getElementById("conversation_id");
        conversationIdInput.value = conversation_id;
        current_conversation_id = conversation_id;
        joinConversation(conversation_id);
        const response = await fetch(`/inbox/get-message/${conversation_id}`, {
            method: "GET",
        });
        const result = await response.json();
        
        if (result && result.data) {
            chat_form.style.visibility = "visible";
            const { data, loggedinUserId } = result;
            if (data) {
                let allMessages = "";
                data.forEach((message) => {
                    let senderAvatar = message.sender.avatar ? `./uploads/avatars/${message.sender.avatar}` : "./images/nophoto.png";
                    const messageClass = message.sender.id === loggedinUserId ? "you-message" : "other-message";
                    const showAvatar = message.sender.id === loggedinUserId ? "" : `<img src="${senderAvatar}" alt="${message.sender.name}" />`;

                    // message attachments
                    let attachments = '<div class="attachments">';

                    if (message.attachment && message.attachment.length > 0) {
                        message.attachment.forEach((attachment) => {
                            attachments += `<img src="./uploads/attachments/${attachment}" /> `;
                        });
                    }

                    attachments += "</div>";

                    // final message html
                    let messageHTML = `<div class="message-row ${messageClass}"><div class="message-content">
                      ${showAvatar}
                      <div class="message-text">${message.text}</div>
                      ${attachments}
                      <div class="message-time">${moment(message.date_time).fromNow()}</div>
                    </div></div>`;

                    allMessages += messageHTML;
                });
                chatTitleContainer.innerHTML = allMessages;
            }
        } else {
            const messagesFailureToast = Toastify({
                text: "Error loading messages!",
                duration: 1000,
            });
            messagesFailureToast.showToast();
        }
    } catch (error) {
        console.log(error);
    }
}

// Message submit
chat_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form_data = new FormData(chat_form);
    const response = await fetch("/inbox/submit-message", {
        method: "POST",
        body: form_data,
    });
    if (response.status === 201) {
        chat_form.reset();
    }
});
