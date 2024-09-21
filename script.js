let boxes = document.querySelectorAll(".box");
let msgContainer2 = document.querySelector(".msg-container2");
let msgContainer1 = document.querySelector(".msg-container1");
let msg = document.querySelector("#msg");
let newBtn = document.querySelector("#new-btn");
let choiceContainer = document.querySelector(".choice-container");
let standardBtn = document.querySelector("#standard-btn");
let disappearingBtn = document.querySelector("#disappearing-btn");
let gameContainer = document.querySelector(".game");
let turnDisplay = document.querySelector("#turn-display");
let turn = true;
let c = 0;
let gameMode = "standard";
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

let moves = { O: [], X: [] };

// Disable all boxes initially
boxes.forEach(box => {
    box.disabled = true;
});

function startGame(mode) {
    gameMode = mode;
    choiceContainer.classList.add("hide");
    msgContainer2.classList.remove("hide");
    gameContainer.classList.remove("hide");
    boxes.forEach(box => {
        box.classList.remove("hide");
        box.disabled = false;  // Enable the boxes after game mode is selected
    });
    resetGame();
}

newBtn.addEventListener("click", resetGame);
standardBtn.addEventListener("click", () => {
    startGame("standard");
    standardBtn.classList.add("selected");
    disappearingBtn.classList.remove("selected");
});
disappearingBtn.addEventListener("click", () => {
    startGame("disappearing");
    disappearingBtn.classList.add("selected");
    standardBtn.classList.remove("selected");
});

function resetGame() {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.style.backgroundColor = "";
        box.classList.remove("highlight");
    }
    c = 0;
    moves = { O: [], X: [] };
    turn = true;
    turnDisplay.innerText = "Turn: O";
    msgContainer1.classList.add("hide");
}

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        let currentPlayer = turn ? "O" : "X";
        box.innerText = currentPlayer;
        box.disabled = true;

        if (gameMode === "disappearing" && moves[currentPlayer].length == 3) {
            let oldMoveIndex = moves[currentPlayer].shift();
            boxes[oldMoveIndex].innerText = "";
            boxes[oldMoveIndex].disabled = false;
            boxes[oldMoveIndex].style.backgroundColor = "";
            boxes[oldMoveIndex].classList.remove("highlight");
        }

        moves[currentPlayer].push(index);
        if (gameMode === "disappearing") {
            highlightOldestMove(!turn ? "O" : "X");
        }
        turn = !turn;
        c++;

        let check = false;
        if (c >= 5)
            check = checkWinner();

        if (check) {
            disableBoxes();
        } else if (c == 9 && gameMode === "standard") {
            showDraw();
        }

        turnDisplay.innerText = `Turn: ${turn ? "O" : "X"}`;
    });
});

const highlightOldestMove = (player) => {
    if (moves[player].length == 3 && !checkWinner()) {
        let oldMoveIndex = moves[player][0];
        boxes[oldMoveIndex].classList.add("highlight");
    }
};

showDraw = () => {
    msg.innerText = "It's a draw!!";
    msgContainer1.classList.remove("hide");
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer1.classList.remove("hide");
};

checkWinner = () => {
    for (let p of winPatterns) {
        let p1 = boxes[p[0]].innerText;
        let p2 = boxes[p[1]].innerText;
        let p3 = boxes[p[2]].innerText;
        if (p1 !== "" && p2 !== "" && p3 !== "") {
            if (p1 === p2 && p2 === p3) {
                showWinner(p1);
                return true;
            }
        }
    }
    return false;
};
