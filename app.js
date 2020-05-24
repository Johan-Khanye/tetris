document.addEventListener("DOMContentLoaded", () => {
  // Variables
  const grid = document.querySelector(".grid")
  let squares = Array.from(document.querySelectorAll(".grid div"))
  const startBtn = document.querySelector("#start-button")
  const width = 10
  let nextRandom = 0
  
  // Tetrominoes
  const lTetromino = [  
    [0, 1, width, width*2],
    [0, 1, 2, width+2],
    [1, width+1, width*2+1, width*2],
    [0, width, width+1, width+2]
  ]
  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2+1, width*2],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2+1, width*2],
  ]
  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]
  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]
  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
  
  //Tetromino colors
  const tetrominoColors = [
    "orange",
    "red",
    "purple",
    "green",
    "blue"
  ]

  let currentPosition = 4
  let currentRotation = 0
  // randomly choose random tetromino
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]
  
  // draw the tetromino.
  function drawTetromino(){
    current.forEach(index => {
      squares[currentPosition+index].classList.add("tetromino")
      squares[currentPosition+index].style.backgroundColor = tetrominoColors[random]
    })
  }
  
  // erase tetromino.
  function eraseTetromino(){
    current.forEach(index => {
      squares[currentPosition+index].classList.remove("tetromino")
      squares[currentPosition+index].style.backgroundColor = ""
    })
  }
  
  // controls
  function control(e){
    if(e.keyCode === 37){
      moveTetrominoLeft()
    } else if (e.keyCode === 39){
      // move right
      moveTetrominoRight()
    } else if (e.keyCode === 38){
      // rotate
      rotateTetromino()
    } else if (e.keyCode === 40){
      // drop quicker
      moveTetrominoDown()
    }
  }
  document.addEventListener('keydown', control)
  
  function moveTetrominoDown(){
    eraseTetromino()
    currentPosition += width
    drawTetromino()
    freezeTetromino()
  }
  
  // freeze tetromino
  function freezeTetromino(){
    if(current.some(index => squares[currentPosition+index+width].classList.contains("taken"))){
      current.forEach(index => squares[currentPosition+index].classList.add("taken"))
      // start dropping a new tetromino.
      random = nextRandom 
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      drawTetromino()
      displayTetromino()
      addScore()
      GameOver()
    }
  }
  
  // add & limit horizontal movement.
  // left movement
  function moveTetrominoLeft(){
    eraseTetromino()
    const isAtLeftEdge = current.some(index => (currentPosition + index)%width == 0)
    
    if(!isAtLeftEdge) currentPosition -=1
    
    if(current.some(index => squares[currentPosition +index].classList.contains("taken"))) {
      currentPosition +=1
    }
    drawTetromino()
  }
  
  // right movement.
  function moveTetrominoRight(){
    eraseTetromino()
    const isAtRightEdge = current.some(index => (currentPosition+index)%width === width -1)
    
    if(!isAtRightEdge) currentPosition +=1
    
    if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
      currentPosition -=1
    }
    drawTetromino()
  }
  
  // rotation movement.
  function rotateTetromino(){
    eraseTetromino()
    currentRotation ++
    if(currentRotation === current.length){
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    drawTetromino()
  }
  
  //  Show up-next tetromino in mini-grid display.
  const displaySquares = document.querySelectorAll(".mini-grid div")
  const displayWidth = 4
  let displayIndex = 0
  
  // The Tetromino without rotation
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], // lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino,
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]
  
  // display up next 
  function displayTetromino() {
    displaySquares.forEach(square => {
      square.classList.remove("tetromino")
      square.style.backgroundColor = ""
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex+index].classList.add("tetromino")
      displaySquares[displayIndex+index].style.backgroundColor = tetrominoColors[nextRandom]
    })
  }
  
  // add functionality to button
  let timerId
  startBtn.addEventListener('click', () => {
    // move tetromino down every second. only if start button is pressed.
    if (timerId){
      clearInterval(timerId)
      timerId = null
    } else {
      drawTetromino()
      timerId = setInterval(moveTetrominoDown, 1000)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayTetromino()
    }
  })
  
  // Scoring system for the game.
  // Score component.
  const scoreDisplay = document.querySelector("#score")
  let score = parseInt(scoreDisplay.textContent)

  // Scoring function.
  function addScore() {
    for(let i = 0; i < 199; i+=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      
      if(row.every(index => squares[index].classList.contains("taken"))){
    
        score+=10
        scoreDisplay.innerHTML = score

        // remove row
        row.forEach(index => {
          squares[index].classList.remove("taken")
          squares[index].style.backgroundColor = ""
        })

        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))

      }
    }
  }


  // game over functionality.
  function GameOver() {
    if(current.some(index => squares[currentPosition+index].classList.contains("taken"))) {
      scoreDisplay.innerHTML = "Game Over!"
      clearInterval(timerId)
    }
  }
})
