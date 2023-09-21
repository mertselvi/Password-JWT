const socket = io();
const chatForm = document.getElementById('chat-form')
const chatmessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userNames = document.getElementById('users')

//Get username and room from URL

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})

// Join chat room 
socket.emit('joinRoom', {username,room})

// Get Rooms and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName (room)
    outputUsers(users)
})

socket.on('message', (message) => {
    outputMessage(message);

    //scroll Down 
    chatmessages.scrollTop = chatmessages.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value //inputtaki değerin id'si üzerinden alıyoruz.
    socket.emit('chatMessage', msg)

    //Clear İnput

    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
})

function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
    <p class="text"> ${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div)

}

function outputUsers (users) {
    console.log(users)
    userNames.innerHTML = `
    ${users.map(user => `<li> ${user.username} </li>`).join('')}`
    users.username
}

//Add room to the DOM 
function outputRoomName (room) {
    roomName.innerText = room
}