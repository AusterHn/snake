"use strict";
//Author: HANOU Aristippe
//16/05/2025
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var elemCanvas = document.getElementById("dessin");
var ctx = elemCanvas.getContext("2d");
var boutonStart = document.getElementById("start");
var boutonStop = document.getElementById("stop");
var boutonReset = document.getElementById("reset");
var boutonHaut = document.getElementById("up");
var boutonBas = document.getElementById("down");
var boutonGauche = document.getElementById("left");
var boutonDroit = document.getElementById("right");
var champScore = document.getElementById("scoreValue");
var champVitesse = document.getElementById("speed");
if (!ctx || !elemCanvas || !champScore || !boutonStart || !boutonStop || !boutonReset || !boutonHaut || !boutonBas || !boutonGauche || !boutonDroit || !champVitesse) {
    throw new Error("Certains éléments graphiques n'ont pas pu être trouvés sur la page !");
}
var enPause = false;
function stopGame() {
    enPause = true;
}
boutonStop.addEventListener("click", stopGame);
var currentDirection = "ArrowRight";
var food = { x: 0, y: 0 };
function generateFood() {
    food.x = Math.floor(Math.random() * 301) + 50;
    food.y = Math.floor(Math.random() * 301) + 50;
}
function drawFood() {
    ctx.beginPath();
    ctx.arc(food.x, food.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}
var segmentSize = 20;
var snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];
function drawSnake() {
    snake.forEach(function (segment) {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x, segment.y, segmentSize, segmentSize);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(segment.x, segment.y, segmentSize, segmentSize);
    });
}
document.addEventListener("keydown", function (e) {
    if ((currentDirection === "ArrowUp" && e.key === "ArrowDown") ||
        (currentDirection === "ArrowDown" && e.key === "ArrowUp") ||
        (currentDirection === "ArrowLeft" && e.key === "ArrowRight") ||
        (currentDirection === "ArrowRight" && e.key === "ArrowLeft")) {
        return;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) !== -1) {
        currentDirection = e.key;
    }
});
boutonHaut.addEventListener("click", function () {
    if (currentDirection !== "ArrowDown")
        currentDirection = "ArrowUp";
});
boutonBas.addEventListener("click", function () {
    if (currentDirection !== "ArrowUp")
        currentDirection = "ArrowDown";
});
boutonGauche.addEventListener("click", function () {
    if (currentDirection !== "ArrowRight")
        currentDirection = "ArrowLeft";
});
boutonDroit.addEventListener("click", function () {
    if (currentDirection !== "ArrowLeft")
        currentDirection = "ArrowRight";
});
function resetGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];
    currentDirection = "ArrowRight";
    champScore.innerText = "0";
    generateFood();
    ctx.clearRect(0, 0, elemCanvas.width, elemCanvas.height);
    drawSnake();
    drawFood();
}
boutonReset.addEventListener("click", resetGame);
function play() {
    resetGame();
    enPause = false;
    function gameLoop() {
        if (enPause)
            return;
        ctx.clearRect(0, 0, elemCanvas.width, elemCanvas.height);
        drawFood();
        var head = __assign({}, snake[0]);
        switch (currentDirection) {
            case "ArrowUp":
                head.y -= segmentSize;
                break;
            case "ArrowDown":
                head.y += segmentSize;
                break;
            case "ArrowLeft":
                head.x -= segmentSize;
                break;
            case "ArrowRight":
                head.x += segmentSize;
        }
        if (head.x < 0 ||
            head.x >= elemCanvas.width ||
            head.y < 0 ||
            head.y >= elemCanvas.height) {
            enPause = true;
            alert("Game Over! Le serpent a touché les bordures. Score: " + champScore.innerText); // Affiche un message
            return;
        }
        for (var i = 1; i < snake.length; ++i) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                enPause = true;
                alert("Game Over! Le serpent s'est mordu. Score: " + champScore.innerText);
                return;
            }
        }
        snake.unshift(head);
        if (Math.abs(head.x - food.x) < segmentSize && Math.abs(head.y - food.y) < segmentSize) {
            champScore.innerText = String(parseInt(champScore.innerText) + 1);
            generateFood();
        }
        else {
            snake.pop();
        }
        drawSnake();
        setTimeout(gameLoop, parseInt(champVitesse.value));
    }
    gameLoop();
}
boutonStart.addEventListener("click", play);
