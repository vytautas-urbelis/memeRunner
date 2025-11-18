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
let jumpCount = 0
let canDoubleJump = true
let animationFrame = 0
let lastSpacePress = 0
let ammunition = 3
let lastAmmoRegenTime = Date.now()
let bullets = []
let explosions = []
let shootingAnimation = 0
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
    this.destroyed = false
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
    if (this.destroyed) {
      return
    }
    if (this.x <= -55) {
      this.x = 14000
      this.destroyed = false
      setTimeout(() => {
        this.x = 1400
      }, Math.random() * 5000) 
      
    }
    const img = new Image();
    img.src = image
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 10
    this.height = 5
    this.speed = 15
    this.active = true
  }

  update() {
    this.x += this.speed
    if (this.x > canvasWidth) {
      this.active = false
    }
  }

  render() {
    if (!this.active) return
    // Cyberpunk bullet with neon glow
    ctx.shadowColor = 'rgba(0, 255, 255, 0.9)'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#00FFFF'
    ctx.strokeStyle = '#0080FF'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Add electric trail
    ctx.fillStyle = 'rgba(255, 0, 255, 0.6)'
    ctx.shadowColor = 'rgba(255, 0, 255, 0.8)'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(this.x - 3, this.y, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // Energy core
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowColor = 'rgba(255, 255, 255, 1)'
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.shadowBlur = 0
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.frame = 0
    this.maxFrames = 20
    this.particles = []
    
    // Create cyberpunk explosion particles
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        size: Math.random() * 8 + 2,
        color: ['#00FFFF', '#FF00FF', '#0080FF', '#FF0080'][Math.floor(Math.random() * 4)]
      })
    }
  }

  update() {
    this.frame++
    this.particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.3 // gravity
      p.size *= 0.95
    })
  }

  render() {
    const alpha = 1 - (this.frame / this.maxFrames)
    this.particles.forEach(p => {
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 10
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(this.x + p.x, this.y + p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  }

  isFinished() {
    return this.frame >= this.maxFrames
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
  let trapsThree = new MovingObject(1600, 410, 50, 50)
  let trapsFour = new MovingObject(2000, 410, 50, 50)
         

function restartGame() {
  trapsOne.x = 900
  trapsTwo.x = 1200
  trapsThree.x = 1600
  trapsFour.x = 2000
  trapsOne.destroyed = false
  trapsTwo.destroyed = false
  trapsThree.destroyed = false
  trapsFour.destroyed = false
  gameSpeed = 0
  countPoints = 0
  jumpCount = 0
  canDoubleJump = true
  ammunition = 3
  bullets = []
  explosions = []
  lastAmmoRegenTime = Date.now()
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
  trapsThree.renderTrap('images/treeG3.png')
  trapsFour.renderTrap('images/treeG4.png')
  trapsOne.x -= 10 + (gameSpeed / 100)
  trapsTwo.x -= 10 + (gameSpeed / 100)
  trapsThree.x -= 10 + (gameSpeed / 100)
  trapsFour.x -= 10 + (gameSpeed / 100)
}

function jump() {
  if (posY < 399) {
    g += 3
    posY = posY - 25 + g
  } else {
    posY = 412
    g = 3
    jumpCount = 0
    canDoubleJump = true
  }
}

function shoot() {
  if (ammunition > 0) {
    ammunition--
    const bullet = new Bullet(posX + 45, posY + 25)
    bullets.push(bullet)
    shootingAnimation = 10 // Show shooting animation for 10 frames
  }
}

function regenerateAmmo() {
  const currentTime = Date.now()
  if (ammunition < 3 && currentTime - lastAmmoRegenTime >= 3000) {
    ammunition++
    lastAmmoRegenTime = currentTime
  }
}

function updateBullets() {
  bullets.forEach(bullet => bullet.update())
  bullets = bullets.filter(b => b.active)
}

function renderBullets() {
  bullets.forEach(bullet => bullet.render())
}

function checkBulletCollisions() {
  const obstacles = [trapsOne, trapsTwo, trapsThree, trapsFour]
  
  bullets.forEach(bullet => {
    if (!bullet.active) return
    
    obstacles.forEach(obstacle => {
      if (obstacle.destroyed) return
      
      // Check collision
      if (bullet.x >= obstacle.x && bullet.x <= obstacle.x + obstacle.width &&
          bullet.y >= obstacle.y && bullet.y <= obstacle.y + obstacle.height) {
        bullet.active = false
        obstacle.destroyed = true
        explosions.push(new Explosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2))
        
        // Move obstacle off screen and reset after delay
        obstacle.x = 14000
        setTimeout(() => {
          obstacle.x = 1400
          obstacle.destroyed = false
        }, Math.random() * 5000 + 2000)
        
        // Award points for destroying obstacle
        countPoints += 50
      }
    })
  })
}

function updateExplosions() {
  explosions.forEach(exp => exp.update())
  explosions = explosions.filter(exp => !exp.isFinished())
}

function renderExplosions() {
  explosions.forEach(exp => exp.render())
}

function startGame() {
  let interval = setInterval(() => {
    gameSpeed += 1
    animationFrame += 1
    renderBg()
    renderLine()
    renderImages()
    renderMeme(posX, posY)
    jump()
    
    // Update and render ammunition system
    regenerateAmmo()
    renderAmmo()
    
    // Update and render bullets
    updateBullets()
    renderBullets()
    
    // Check bullet collisions
    checkBulletCollisions()
    
    // Update and render explosions
    updateExplosions()
    renderExplosions()
    
    if (posX+40 >= trapsOne.x - 1 && posX+40 <= trapsOne.x + 50 && posY+40 >= trapsOne.y -1 && posY+40 <= trapsOne.y + 50 && !trapsOne.destroyed || 
        posX+40 >= trapsTwo.x - 1 && posX+40 <= trapsTwo.x + 50 && posY+40 >= trapsTwo.y -1 && posY+40 <= trapsTwo.y + 50 && !trapsTwo.destroyed ||
        posX+40 >= trapsThree.x - 1 && posX+40 <= trapsThree.x + 50 && posY+40 >= trapsThree.y -1 && posY+40 <= trapsThree.y + 50 && !trapsThree.destroyed ||
        posX+40 >= trapsFour.x - 1 && posX+40 <= trapsFour.x + 50 && posY+40 >= trapsFour.y -1 && posY+40 <= trapsFour.y + 50 && !trapsFour.destroyed) {
      clearInterval(interval)
      pauseGame()
    }
    if (posX+40 >= trapsOne.x - 1 && posX+40 <= trapsOne.x + 50 && !trapsOne.destroyed || 
        posX+40 >= trapsTwo.x - 1 && posX+40 <= trapsTwo.x + 50 && !trapsTwo.destroyed ||
        posX+40 >= trapsThree.x - 1 && posX+40 <= trapsThree.x + 50 && !trapsThree.destroyed ||
        posX+40 >= trapsFour.x - 1 && posX+40 <= trapsFour.x + 50 && !trapsFour.destroyed) {
      countPoints += 1 + gameSpeed
    }
    renderPoints(countPoints)
  }, 16)
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
  ctx.shadowColor = 'rgba(255, 0, 255, 0.9)'
  ctx.shadowBlur = 20
  ctx.fillStyle = '#FF00FF'
  ctx.font = "bold 160px 'Courier New', monospace"
  ctx.fillText(`${count}`, 650, 300)
  ctx.shadowColor = 'rgba(0, 255, 255, 0.9)'
  ctx.shadowBlur = 15
  ctx.fillStyle = '#00FFFF'
  ctx.font = "bold 60px 'Courier New', monospace"
  ctx.fillText(`POINTS: ${countPoints}`, 450, 450)
  ctx.shadowBlur = 0
}

function renderPoints(points) {
  ctx.shadowColor = 'rgba(0, 255, 255, 0.8)'
  ctx.shadowBlur = 8
  ctx.fillStyle = '#00FFFF'
  ctx.font = "bold 40px 'Courier New', monospace"
  ctx.fillText(`${userName}: ${points}`, 620, 30)
  ctx.shadowBlur = 0
}

function renderAmmo() {
  ctx.shadowColor = 'rgba(255, 0, 255, 0.8)'
  ctx.shadowBlur = 8
  ctx.fillStyle = '#FF00FF'
  ctx.font = "bold 30px 'Courier New', monospace"
  ctx.fillText('AMMO:', 20, 35)
  ctx.shadowBlur = 0
  
  // Draw cyberpunk ammunition bullets
  for (let i = 0; i < 3; i++) {
    if (i < ammunition) {
      // Active ammunition - neon glow
      ctx.fillStyle = '#00FFFF'
      ctx.strokeStyle = '#0080FF'
      ctx.shadowColor = 'rgba(0, 255, 255, 0.9)'
      ctx.shadowBlur = 10
    } else {
      // Empty ammunition - dimmed
      ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'
      ctx.strokeStyle = 'rgba(0, 128, 255, 0.3)'
      ctx.shadowBlur = 0
    }
    
    ctx.lineWidth = 2
    const x = 130 + (i * 30)
    const y = 25
    
    // Draw bullet shape
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
  ctx.shadowBlur = 0
}

function renderLine() {
  // Neon ground line
  ctx.strokeStyle = "#00FFFF"
  ctx.shadowColor = 'rgba(0, 255, 255, 0.8)'
  ctx.shadowBlur = 10
  ctx.setLineDash([10, 5])
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(1400, 460)
  ctx.lineTo(0, 460)
  ctx.stroke()
  ctx.setLineDash([]) // Reset dash
  ctx.shadowBlur = 0
}

function renderBg() {
  // Cyberpunk gradient background (dark with neon undertones)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
  gradient.addColorStop(0, '#0A0A1A')
  gradient.addColorStop(0.5, '#1A0A2E')
  gradient.addColorStop(1, '#16213E')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // Add subtle neon grid effect
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
  ctx.lineWidth = 1
  // Vertical lines
  for (let i = 0; i < canvasWidth; i += 50) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, canvasHeight)
    ctx.stroke()
  }
  // Horizontal lines
  for (let i = 0; i < canvasHeight; i += 50) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(canvasWidth, i)
    ctx.stroke()
  }
}

function renderMeme(x, y) {
  const img = new Image();
  img.src = 'images/meme.png'
  // Create running animation by alternating the meme position
  const bounce = Math.abs(Math.sin(animationFrame * 0.2)) * 3
  const tilt = Math.sin(animationFrame * 0.15) * 0.1
  ctx.save()
  ctx.translate(x + 25, y + 25)
  ctx.rotate(tilt)
  
  // Draw character body with cyberpunk neon glow
  ctx.shadowColor = 'rgba(0, 255, 255, 0.6)'
  ctx.shadowBlur = 15
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.drawImage(img, -25, -25 - bounce, 50, 50)
  
  // Add neon outline to character
  ctx.strokeStyle = '#00FFFF'
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.6
  ctx.strokeRect(-25, -25 - bounce, 50, 50)
  ctx.globalAlpha = 1
  
  // Reset shadow for other elements
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  // Draw cyberpunk legs with neon accents
  const legSwing = Math.sin(animationFrame * 0.3) * 8
  ctx.fillStyle = '#1A1A2E'
  ctx.strokeStyle = '#FF00FF'
  ctx.lineWidth = 2.5
  
  // Back leg with glow
  ctx.shadowColor = 'rgba(255, 0, 255, 0.8)'
  ctx.shadowBlur = 5
  ctx.beginPath()
  ctx.moveTo(-5, 20)
  ctx.lineTo(-5 - legSwing, 35)
  ctx.stroke()
  
  // Front leg with glow
  ctx.beginPath()
  ctx.moveTo(5, 20)
  ctx.lineTo(5 + legSwing, 35)
  ctx.stroke()
  
  ctx.shadowBlur = 0
  
  // Draw futuristic Blade Runner-style shotgun
  const gunRecoil = shootingAnimation > 0 ? -5 : 0
  
  // Main shotgun body - sleek metallic
  const gradient = ctx.createLinearGradient(8, -8, 40 + gunRecoil, 5)
  gradient.addColorStop(0, '#1C1C1C')
  gradient.addColorStop(0.5, '#4A4A4A')
  gradient.addColorStop(1, '#2C2C2C')
  ctx.fillStyle = gradient
  ctx.fillRect(20 + gunRecoil, -8, 22, 14)
  
  // Neon energy core running along barrel
  ctx.strokeStyle = '#00FFFF'
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(0, 255, 255, 0.9)'
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.moveTo(20 + gunRecoil, -1)
  ctx.lineTo(42 + gunRecoil, -1)
  ctx.stroke()
  
  // Cyberpunk barrel accents
  ctx.strokeStyle = '#FF0080'
  ctx.lineWidth = 1
  ctx.shadowColor = 'rgba(255, 0, 128, 0.7)'
  ctx.shadowBlur = 5
  for (let i = 0; i < 3; i++) {
    const xPos = 24 + gunRecoil + (i * 5)
    ctx.beginPath()
    ctx.moveTo(xPos, -7)
    ctx.lineTo(xPos, 5)
    ctx.stroke()
  }
  
  ctx.shadowBlur = 0
  
  // Metallic border for shotgun
  ctx.strokeStyle = '#666666'
  ctx.lineWidth = 2
  ctx.strokeRect(20 + gunRecoil, -8, 22, 14)
  
  // Futuristic grip with glowing elements
  ctx.fillStyle = '#0F0F0F'
  ctx.fillRect(12 + (gunRecoil * 0.5), -7, 10, 12)
  ctx.strokeStyle = '#00FF00'
  ctx.lineWidth = 1.5
  ctx.shadowColor = 'rgba(0, 255, 0, 0.7)'
  ctx.shadowBlur = 6
  ctx.strokeRect(12 + (gunRecoil * 0.5), -7, 10, 12)
  
  // Grip detail lines
  ctx.strokeStyle = '#00FF00'
  ctx.lineWidth = 1
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(13 + (gunRecoil * 0.5), -5 + (i * 3))
    ctx.lineTo(21 + (gunRecoil * 0.5), -5 + (i * 3))
    ctx.stroke()
  }
  
  ctx.shadowBlur = 0
  
  // Stock with neon accent
  ctx.fillStyle = '#1A1A1A'
  ctx.fillRect(8, -6, 8, 14)
  ctx.strokeStyle = '#FF00FF'
  ctx.lineWidth = 1.5
  ctx.shadowColor = 'rgba(255, 0, 255, 0.7)'
  ctx.shadowBlur = 5
  ctx.strokeRect(8, -6, 8, 14)
  ctx.shadowBlur = 0
  
  // Trigger guard with glow
  ctx.strokeStyle = '#00FFFF'
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(0, 255, 255, 0.8)'
  ctx.shadowBlur = 5
  ctx.beginPath()
  ctx.arc(18, 2, 3, 0, Math.PI)
  ctx.stroke()
  ctx.shadowBlur = 0
  
  // Enhanced Blade Runner-style muzzle flash when shooting
  if (shootingAnimation > 0) {
    // Outer electric flash (cyan/magenta)
    ctx.fillStyle = `rgba(0, 255, 255, ${shootingAnimation / 8})`
    ctx.shadowColor = 'rgba(0, 255, 255, 1)'
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(44, -1, 14, 0, Math.PI * 2)
    ctx.fill()
    
    // Middle flash (magenta)
    ctx.fillStyle = `rgba(255, 0, 255, ${shootingAnimation / 10})`
    ctx.shadowColor = 'rgba(255, 0, 255, 1)'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(44, -1, 10, 0, Math.PI * 2)
    ctx.fill()
    
    // Inner bright core (white-cyan)
    ctx.fillStyle = `rgba(255, 255, 255, ${shootingAnimation / 12})`
    ctx.shadowColor = 'rgba(255, 255, 255, 1)'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(44, -1, 6, 0, Math.PI * 2)
    ctx.fill()
    
    // Energy discharge particles
    ctx.shadowBlur = 8
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI / 4) * (i - 2) // Wider spread
      const dist = 10 + Math.random() * 6
      const px = 44 + Math.cos(angle) * dist
      const py = -1 + Math.sin(angle) * dist
      ctx.fillStyle = i % 2 === 0 ? `rgba(0, 255, 255, ${shootingAnimation / 15})` : `rgba(255, 0, 255, ${shootingAnimation / 15})`
      ctx.shadowColor = i % 2 === 0 ? 'rgba(0, 255, 255, 1)' : 'rgba(255, 0, 255, 1)'
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.shadowBlur = 0
    shootingAnimation--
  }
  
  ctx.restore()
}

document.addEventListener('keydown', (event) => {
  const key = event.key
  if (key === ' ') {
    event.preventDefault() // Prevent space from triggering button clicks
    const currentTime = Date.now()
    // Check if space was pressed within 300ms for double jump
    if (currentTime - lastSpacePress < 300 && jumpCount === 1 && canDoubleJump) {
      posY = 350
      g = 3
      jumpCount = 2
      canDoubleJump = false
    } else if (jumpCount === 0) {
      posY = 394
      jumpCount = 1
    }
    lastSpacePress = currentTime
  } else if (key === 'Enter') {
    event.preventDefault() // Prevent Enter from triggering button clicks
    shoot()
  }
}, 
)

function jumpOnClick() {
  const currentTime = Date.now()
  // Check if space was pressed within 300ms for double jump
  if (currentTime - lastSpacePress < 300 && jumpCount === 1 && canDoubleJump) {
    posY = 350
    g = 3
    jumpCount = 2
    canDoubleJump = false
  } else if (jumpCount === 0) {
    posY = 394
    jumpCount = 1
  }
  lastSpacePress = currentTime
}


startGame()
