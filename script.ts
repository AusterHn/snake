//Author: HANOU Aristippe
//16/05/2025

const elemCanvas = <HTMLCanvasElement> document.getElementById("dessin")
const ctx = <CanvasRenderingContext2D> elemCanvas.getContext("2d")
const boutonStart = <HTMLButtonElement> document.getElementById("start")
const boutonStop = <HTMLButtonElement> document.getElementById("stop")
const boutonReset = <HTMLButtonElement> document.getElementById("reset")
const boutonHaut = <HTMLButtonElement> document.getElementById("up")
const boutonBas = <HTMLButtonElement> document.getElementById("down")
const boutonGauche = <HTMLButtonElement> document.getElementById("left")
const boutonDroit = <HTMLButtonElement> document.getElementById("right")
const champScore = <HTMLSpanElement> document.getElementById("scoreValue")
const champVitesse = <HTMLInputElement> document.getElementById("speed")

if (!ctx || !elemCanvas || !champScore || !boutonStart || !boutonStop || !boutonReset || !boutonHaut || !boutonBas || !boutonGauche || !boutonDroit || !champVitesse) {
    throw new Error("Certains éléments graphiques n'ont pas pu être trouvés sur la page !")
}

let enPause = false
function stopGame() {
    enPause = true
}
boutonStop.addEventListener("click", stopGame)

let currentDirection : string = "ArrowRight"
let food : {x: number, y: number} = {x: 0, y: 0}

function generateFood() {
    food.x = Math.floor(Math.random()*301) + 50
    food.y = Math.floor(Math.random()*301) + 50
}

function drawFood() {
    ctx.beginPath()
    ctx.arc(food.x, food.y, 10, 0, 2*Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.closePath()
}

const segmentSize : number = 20
let snake : {x: number, y: number}[] = [
    {x: 200, y: 200},
    {x: 180, y: 200},
    {x: 160, y: 200}
]

function drawSnake(){
    snake.forEach(segment => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x, segment.y, segmentSize, segmentSize);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(segment.x, segment.y, segmentSize, segmentSize);
    });
}

document.addEventListener("keydown", (e) => {
    if (
        (currentDirection ==="ArrowUp" && e.key === "ArrowDown") ||
        (currentDirection ==="ArrowDown" && e.key === "ArrowUp") ||
        (currentDirection ==="ArrowLeft" && e.key === "ArrowRight") ||
        (currentDirection ==="ArrowRight" && e.key === "ArrowLeft")
    ) {
        return
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) !== -1) {
        currentDirection = e.key
    }
})

boutonHaut.addEventListener("click", () => {
    if (currentDirection !== "ArrowDown") currentDirection = "ArrowUp"
})
boutonBas.addEventListener("click", () => {
    if (currentDirection !== "ArrowUp") currentDirection = "ArrowDown"
})
boutonGauche.addEventListener("click", () => {
    if (currentDirection !== "ArrowRight") currentDirection = "ArrowLeft"
})
boutonDroit.addEventListener("click", () => {
    if (currentDirection !== "ArrowLeft") currentDirection = "ArrowRight"
})
function resetGame() {
    snake = [
        {x: 200, y: 200},
        {x: 180, y: 200},
        {x: 160, y: 200}
    ]
    currentDirection = "ArrowRight"
    champScore.innerText = "0"
    generateFood()
    ctx.clearRect(0, 0, elemCanvas.width, elemCanvas.height)
    drawSnake()
    drawFood()
}
boutonReset.addEventListener("click", resetGame)
function play() {
    resetGame()
    enPause = false
    function gameLoop() {
        if (enPause) return

        ctx.clearRect(0, 0, elemCanvas.width, elemCanvas.height)
        drawFood()
        const head = { ...snake[0] }
        switch (currentDirection) {
            case "ArrowUp":
                head.y -= segmentSize
                break
            case "ArrowDown":
                head.y += segmentSize
                break
            case "ArrowLeft":
                head.x -= segmentSize
                break
            case "ArrowRight":
                head.x += segmentSize
        }
        if (
        head.x < 0 || 
        head.x >= elemCanvas.width || 
        head.y < 0 || 
        head.y >= elemCanvas.height 
        ) {
            enPause = true;
            alert("Game Over! Le serpent a touché les bordures. Score: "+champScore.innerText); // Affiche un message
            return;
        }
        for (let i = 1; i < snake.length; ++i) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                enPause = true
                alert("Game Over! Le serpent s'est mordu. Score: "+champScore.innerText)
                return
            }
        }
        snake.unshift(head)
        if (Math.abs(head.x - food.x) < segmentSize && Math.abs(head.y - food.y) < segmentSize) {
            champScore.innerText = String(parseInt(champScore.innerText) + 1)
            generateFood()
        }
        else {
            snake.pop()
        }
        drawSnake()
        setTimeout(gameLoop, parseInt(champVitesse.value))
    }
    gameLoop()
    
    
}
boutonStart.addEventListener("click", play)