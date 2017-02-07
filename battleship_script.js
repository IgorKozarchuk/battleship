// Representation object

var view = {
    displayMessage: function(msg) {
        var msgArea = document.getElementById("messageArea");
        msgArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },
    setFocus: function() {
        document.getElementById("guessInput").focus();
    },
    setDisabled: function() {
        var input = document.getElementById("guessInput");
        input.setAttribute("disabled", "disabled");
    }
};

// Model object

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships : [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],
    generateShipLocation: function() {
        var locs;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locs = this.generateShip();
            } while (this.collision(locs));
            this.ships[i].locations = locs;
        }
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2); // 0 or 1
        var row, col;
        if (direction === 1) { // horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else { // vertical ship
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locs) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locs.length; j++) {
                if (ship.locations.indexOf(locs[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (ship.hits[index] === "hit") {
                view.displayMessage("You already hit that location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    this.shipsSunk++;
                    view.displayMessage("You sank my battleship!");
                }
                view.setFocus();
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("MISS!");
        view.setFocus();
        return false;
    },
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
};

// Controller object

var controller = {
    guesses: 0,
    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all battleships in " + this.guesses + " guesses<br>" + "Accuracy: " + Math.round(model.numShips * model.shipLength / this.guesses * 100) + "%");
                view.setDisabled();
            }
        }
    }
};

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Invalid input!");
    } else {
        var firstChar = guess.charAt(0).toUpperCase();
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Invalid input!");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Invalid input!");
        } else {
            return row + column;
        }
    }
    return null;
}

// Event handler

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handlerFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handlerKeyPress;
    model.generateShipLocation();
    view.setFocus();
}

function handlerFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handlerKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;
