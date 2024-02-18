const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');
const canvasWidth = 1400
const canvasHeight = 500
const RADIUS = 10;
let gameSpeed = 0
let posX = 350
let posY = 412
let g = 3
let count = 0
let countPoints = 0
let userName = ''
if (localStorage.getItem('nickname')) {
  userName = localStorage.getItem('nickname')
} else {
  userName = prompt('What is your Name?')
  localStorage.setItem('nickname', userName)
}




class MovingObject {
  constructor(x, y, width, height, color = 'grey') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color
  }

  renderImage(image) {
    if (this.x <= -100) {
      this.x = 1400
    }
    const img = new Image();
    img.src = image
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }

  renderTrap(image) {
    if (this.x <= -55) {
      this.x = 14000
      setTimeout(() => {
        this.x = 1400
      }, Math.random() * 5000) 
      
    }
    const img = new Image();
    img.src = image
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
}

  let upperFirst = new MovingObject(1400, 40, 180, 90)
  let upperSecond = new MovingObject(900, 40, 160, 70)
  let upperLast = new MovingObject(400, 40, 140, 80)
  let midFirst = new MovingObject(1300, 180, 150, 150)
  let midSecond = new MovingObject(600, 180, 80, 160)
  let botFirst = new MovingObject(1200, 220, 100, 200)
  let botSecond = new MovingObject(600, 220, 160, 160)
  let trapsOne = new MovingObject(900, 410, 50, 50)
  let trapsTwo = new MovingObject(1200, 410, 50, 50)
         

function restartGame() {
  trapsOne.x = 900
  trapsTwo.x = 1200
  gameSpeed = 0
  countPoints = 0
}

function renderImages() {
  upperFirst.renderImage('images/cloud.png')
  upperSecond.renderImage('images/cloud2.png')
  upperLast.renderImage('images/cloud3.png')
  upperFirst.x -= 2 + (gameSpeed / 700)
  upperSecond.x -= 2 + (gameSpeed / 700)
  upperLast.x -= 2 + (gameSpeed / 700)
  midFirst.renderImage('images/treeG.png')
  midSecond.renderImage('images/treeG2.png') 
  midFirst.x -= 3 + (gameSpeed / 500)
  midSecond.x -= 3 + (gameSpeed / 500)
  botFirst.renderImage('images/treeG3.png') 
  botSecond.renderImage('images/treeG4.png') 
  botFirst.x -= 9 + (gameSpeed / 350)
  botSecond.x -= 9 + (gameSpeed / 350)
  trapsOne.renderTrap('images/treeG5.png')  
  trapsTwo.renderTrap('images/treeG5.png')  
  trapsOne.x -= 10 + (gameSpeed / 100)
  trapsTwo.x -= 10 + (gameSpeed / 100)
}



function jump() {
  if (posY < 399) {
    g += 3
    posY = posY - 25 + g
  } else {
    posY = 412
    g = 3
  }
}


function startGame() {
  let interval = setInterval(() => {
    gameSpeed += 1
    renderBg()
    renderLine()
    renderImages()
    renderMeme(posX, posY)
    jump()
    if (posX+40 >= trapsOne.x - 1 && posX+40 <= trapsOne.x + 50 && posY+40 >= trapsOne.y -1 && posY+40 <= trapsOne.y + 50 || posX+40 >= trapsTwo.x - 1 && posX+40 <= trapsTwo.x + 50 && posY+40 >= trapsTwo.y -1 && posY+40 <= trapsTwo.y + 50) {
      clearInterval(interval)
      pauseGame()
    }
    if (posX+40 >= trapsOne.x - 1 && posX+40 <= trapsOne.x + 50 || posX+40 >= trapsTwo.x - 1 && posX+40 <= trapsTwo.x + 50) {
      countPoints += 1 + gameSpeed
    }
    renderPoints(countPoints)
  }, 15)
}


function pauseGame() {
  let interval = setInterval(() => {
    console.log('pause')
    count += 1
    renderBg()
    drawPouse(count)
    if (count === 3) {
      count = 0
      clearInterval(interval)
      restartGame()
      startGame()
    }
  }, 800)
}


function drawPouse(count) {
  ctx.fillStyle = 'black';
  ctx.font = "160px serif";
  ctx.fillText(`${count}`, 650, 300)
}


function renderPoints(points) {
  ctx.fillStyle = 'black';
  ctx.font = "40px serif";
  ctx.fillText(`${userName}: ${points}`, 620, 30)
}

// render rect
function renderLine() {
  ctx.strokeStyle = "grey";
  ctx.setLineDash([10, 0]);
  ctx.beginPath();
  ctx.moveTo(1400, 460);
  ctx.lineTo(0, 460);
  ctx.stroke();
}

function renderBg() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function renderMeme(x, y) {
  const img = new Image();
    img.src = 'images/meme.png'
    ctx.drawImage(img, x, y, 50, 50);
}



document.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === ' ') {
    posY = 394
  }
}, 
)


startGame()
