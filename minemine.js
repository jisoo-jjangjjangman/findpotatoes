document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const flagsLeft = document.querySelector('#flags-left')
  const result = document.querySelector('#result')
  let width = 10
  let bombAmount = 10
  let flags = 0
  let squares = []
  let isGameOver = false

  //보드 생성하기 
  function createBoard() {
    flagsLeft.innerHTML = bombAmount

    //랜덤 폭탄 생성, 게임 셔플
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)

    for(let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)

      //일반적인 클릭 
      square.addEventListener('click', function(e) {
        click(square)
      })

      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
    }

    //숫자 더해가기
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0) //10, 20, 30.. 같은 맨 왼쪽 블럭 지정
      const isRightEdge = (i % width === width -1) // 9, 19, 29..같은 맨 오른쪽 블럭 지정

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
        if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
        if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
        if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
        if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
        if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
        if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
        squares[i].setAttribute('data', total)
      }
    }
  }
  createBoard()

  //오른쪽 마우스로 깃발 생성 
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = '🌱'
        flags ++
        flagsLeft.innerHTML = bombAmount- flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags --
        flagsLeft.innerHTML = bombAmount- flags
      }
    }
  }

  //블럭을 눌렀을 때
  function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total !=0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }


  //블럭을 눌렀을 때 주변 블럭들도 체크하기
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1].id
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId -width)].id
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) +width].id
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

  //게임 실패
  function gameOver(square) {
    result.innerHTML = '실수로 감자를 눌러 감자가 터졌습니다.\n 당신의 등짝도 터져버렸습니다.. '
    isGameOver = true

    //이후 모든 지뢰 위치 보여주기
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '🥔'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }

  //이겼을 때
  function checkForWin() {
  
  let matches = 0

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches ++
      }
      if (matches === bombAmount) {
        result.innerHTML = '모든 감자의 위치를 찾아 농부의 사랑을 받았습니다!!'
        isGameOver = true
      }
    }
  }
})
