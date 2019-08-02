//global variables

var userName = "";
var sender = "";
var messageText = "";
var timeSent = 0;
var score = 0;

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC7SjZGgTfEsSp37XjIY4S9pVHfoBzzlNM",
  authDomain: "rps-game-e277c.firebaseapp.com",
  databaseURL: "https://rps-game-e277c.firebaseio.com",
  projectId: "rps-game-e277c",
  storageBucket: "",
  messagingSenderId: "72373962536",
  appId: "1:72373962536:web:f617a4016adff89c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

var players = database.ref("/players");
var messages = database.ref("/messages");

var connectedRef = database.ref(".info/connected");
var con = "";
connectedRef.on("value", function (snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    con = players.push({
      userName: userName,
      score: score,
    });

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});


// onclick functions
$("#name-btn").click(function (event) {
  event.preventDefault();
  userName = $("#choose-name").val();
  $("#pick-name-box").addClass("hidden");

  con.update({
    userName: userName,
    score: score,
  })
})

$("#message-btn").click(function (event) {
  event.preventDefault();

  if (userName != "") {
    messageText = $("#message").val().trim();
    timeSent = moment().format("ddd h:mm A");

    $("#message").val("");

    messages.push({
      time: timeSent,
      sender: userName,
      message: messageText,
    })
  }
})

messages.on("child_added", function (snap) {
  messageText = snap.val().message;
  timeSent = snap.val().time;
  sender = snap.val().sender;
  updateMessageDisplay();
});




function updateMessageDisplay() {
  var senderInfo = $("<p>").html(sender + "  " + `<em class="timestamp"> ${timeSent} </em>`);
  var messageP = $("<p>").text(messageText);

  $("#display-messages").append(senderInfo);
  $("#display-messages").append(messageP);
}