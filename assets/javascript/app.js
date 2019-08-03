//generic global variables

var userName = "";
var sender = "";
var messageText = "";
var timeSent = 0;
var score = 0;
var wins = 0;
var loses = 0;

//###################### Firebase config and Firebase variable ########################################
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
var games = database.ref("/games");

var connectedRef = database.ref(".info/connected");

var con = null;  // empty variable will hold reference to a firebase object under the players directory. represents user by connection


// Keeps track of players who are connected and removes when they disconnect
connectedRef.on("value", function (snap) {
  if (snap.val()) {

    con = players.push({
      userName: userName,
      score: score,
    });

    con.onDisconnect().remove();
  }
});


//######################### functions for the messenger ###############################################

//sign in before playing updates player info in DB. after sign-in messenger and game appear
$("#name-btn").click(function (event) {
  event.preventDefault();

  userName = $("#choose-name").val();
  $("#pick-name-box").addClass("hidden");
  $("#main-game").removeClass("hidden");

  buttomScroll();

  con.update({
    userName: userName,
    score: score,
  })
})

//checks to make sure user has signed in.  Takes input from form and creates message object which is pushed to the DB
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


//updates messages window when new message added to DB
messages.on("child_added", function (snap) {
  messageText = snap.val().message;
  timeSent = snap.val().time;
  sender = snap.val().sender;
  updateMessageDisplay();
  buttomScroll();
});


//updates messages in html
function updateMessageDisplay() {
  var senderInfo = $("<p class='sender'>").html(sender + "  " + `<em class="timestamp"> ${timeSent} </em>`);
  var messageP = $("<p>").text(messageText);

  $("#display-messages").append(senderInfo);
  $("#display-messages").append(messageP);
}

//keeps messenger window scrolled to bottom
function buttomScroll() {
  var d = $('#display-messages');
  console.log(d.prop("scrollHeight"));
  d.scrollTop(d.prop("scrollHeight"));
}

//################################# Game Logic ####################################################

//Join game
$("#play-rps").click(function () {
  
});

$("document").on("click", ".pic", function () {

});