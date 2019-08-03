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
var moves = database.ref("/moves");

var connectedRef = database.ref(".info/connected");

var connectedUser = null;  // empty variable will hold reference to a firebase object under the players directory. represents user by connection


// Keeps track of players who are connected and removes when they disconnect
connectedRef.on("value", function (snap) {
  if (snap.val()) {

    connectedUser = players.push({
      userName: userName,
      score: score,
    });

    connectedUser.onDisconnect().remove();
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

  connectedUser.update({
    userName: userName,
    score: score,
  })
})

//checks to make sure user has signed in.  Takes input from form and creates message object which is pushed to the DB
$("#message-btn").click(function (event) {
  event.preventDefault();

  if (userName != "") {
    messageText = $("#message").val().trim();

    addMessagetoDB(messageText, userName);

    $("#message").val("");

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

//takes in message text and sender and pushes messages to firebase
function addMessagetoDB(message, from) {
  timeSent = moment().format("ddd h:mm A");
  messages.push({
    time: timeSent,
    sender: from,
    message: message,
  })
}

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
//RPS buttons onclick
$(document).on("click", ".rps-choice", function () {
  var choice = $(this).data("name");
  var display = $(this).data("display");

  addMessagetoDB(`${userName} picked...`, "God");
  $(".rps-choice").addClass("unclickable");

  moves.push({
    playerId: connectedUser.key,
    player: userName,
    move: choice,
    mov: display
  });
});

//Updates winner score on win
function playerWin(playerName, mov1, mov2) {
  if (playerName === userName) {
    addMessagetoDB(`${playerName} WON! HOly Crud! ${mov1} beats ${mov2}`, "God");
    score++;

    connectedUser.update({
      score: score
    });
  }

  moves.remove();
  $(".rps-choice").removeClass("unclickable");
}

moves.on("value", function (snapshot) {
 
  if (snapshot.numChildren() >= 2) {
    var lastMoves = Object.values(snapshot.val());

    var move1 = lastMoves[0];
    var move2 = lastMoves[1];

    if (move1.move === move2.move) {
      if (userName === move2.player) {
        addMessagetoDB(`${move1.player}, ${move2.player}, Yall some mindreading mothers! Yall tied! Too bad that doesn't win you any points`, "God");
      }
      moves.remove();
    }
    else if (move1.move === 'r') {
      if (move2.move === 's') {
        // Move 1 wins
        playerWin(move1.player, move1.mov, move2.mov);
      }
      else {
        playerWin(move2.player, move2.mov, move1.mov);
      }
    }
    else if (move1.move === 'p') {
      if (move2.move === 'r') {
        playerWin(move1.player, move1.mov, move2.mov);
      }
      else {
        playerWin(move2.player, move2.mov, move1.mov);
        // Move 2 wins
      }
    }
    else if (move1.move === 's') {
      if (move2.move === 'p') {
        playerWin(move1.player, move1.mov, move2.mov);
      }
      else {
        playerWin(move2.player, move2.mov, move1.mov);
        // Move 2 wins
      }
    }
    else {
      //fuck
    }
  }
});

players.on("value", function (snap) {
  $("#scoreboard tbody").empty();
  snap.forEach(function (snip) {
    var player = snip.val().userName;
    var currentScore = snip.val().score;

    var row = $("<tr>");

    var playerCol = $("<td>").text(player);
    var currentScoreCol = $("<td>").text(currentScore);


    row.append(playerCol, currentScoreCol);
    $("#scoreboard tbody").append(row);
  });
  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});