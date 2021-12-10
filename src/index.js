const canvas = document.getElementById('chess');
const context = canvas.getContext('2d');
const winner = document.querySelector('.winner');
let chessBoard = [];
let player1_arr = [],
  player2_arr = [],
  p1_return_arr = [],
  p2_return_arr = [];
let p1 = true;

for (let i = 0; i < 15; i++) {
  chessBoard[i] = [];
  for (let j = 0; j < 15; j++) {
    chessBoard[i][j] = 0
  }
}


let drawChessBoard = () => {
  for (let i = 0; i < 20; i++) {
    context.strokeStyle = '#666';
    context.moveTo(15, 15 + 30 * i);
    context.lineTo(435, 15 + 30 * i);
    context.stroke();
    context.moveTo(15 + 30 * i, 15);
    context.lineTo(15 + 30 * i, 435);
  }
}

let isWin = (args) => {
  if (args[2].length < 5){return false}
  return horizontal_win(...args) || vertical_win(...args) || cross_win(...args)
}

// 下棋
let handleClick = (e) => {
  let offsetX = e.offsetX, offsetY = e.offsetY;
  let [x, y] = [Math.floor(offsetX / 30), Math.floor(offsetY / 30)];

  if (chessBoard[x][y] === 1) { return; }

  if (p1) {
    drawPieces(x, y, p1)
  } else {
    drawPieces(x, y)
  }
  chessBoard[x][y] = 1;

  if (p1 && player1_arr.length < 1) {p1_return_arr.push({ x, y});}

  p1 ? player1_arr.push({ x, y }) : player2_arr.push({ x, y });
  
  let win = isWin([x, y, p1 ? player1_arr : player2_arr]) || false;
  if (win) {
    console.log(`${p1 ? 'Player1' : 'Player2'} Win !!!`);
    winner.textContent = `${p1 ? 'Player1' : 'Player2'} Win !!!`;
    winner.style.display = "block";
    winner.style.top = "50%";
    canvas.removeEventListener('click', handleClick);
  }
  p1 = !p1
}

Array.prototype.hasItem = function (item) {
  let arr = this;
  for (let i of arr) {
    if (i.x === item.x && i.y === item.y) { return true }
  }
  return false
}


// 横线赢法
let horizontal_win = (x, y, arr) => {
  let len = 1;
  for (let i = x - 1; i >= 0; i--) {
    if (arr.hasItem({ x: i, y })) {
      len += 1;
      if (len >= 5) {
        return true
      }
    } else {
      break
    }
  }
  for (let j = x + 1; j <= chessBoard.length; j++) {
    if (arr.hasItem({ x: j, y })) {
      len += 1;
      if (len >= 5) {
        return true
      }
    } else {
      break
    }
  }
}

// 竖线赢法
let vertical_win = (x, y, arr) => {
  let len = 1;
  for (let i = y - 1; i >= 0; i--) {
    if (arr.hasItem({ x, y: i })) {
      len += 1;
      if (len >= 5) {
        return true
      }
    } else {
      break
    }
  }
  for (let j = y + 1; j <= chessBoard.length; j++) {
    if (arr.hasItem({ x, y: j })) {
      len += 1;
      if (len >= 5) {
        return true
      }
    } else {
      break
    }
  }
}

// 斜线赢法
let cross_win = (x, y, arr) => {
  let len = 1, idx = 1;
  for (let i = x - 1; i >= 0; i--) {
    if (y - idx >= 0 && arr.hasItem({ x: i, y: y - idx })) {
      len += 1;
      idx += 1;
      if (len >= 5) { return true }
    } else {
      idx = 1;
      break
    }
  }
  for (let i = x + 1; i <= chessBoard.length; i++) {
    if (y + idx >= 0 && arr.hasItem({ x: i, y: y + idx })) {
      len += 1;
      idx += 1;
      if (len >= 5) { return true }
    } else {
      idx = 1;
      break
    }
  }

  for (let i = x - 1; i >= 0; i--) {
    if (y + idx <= chessBoard.length && arr.hasItem({ x: i, y: y + idx })) {
      len += 1;
      idx += 1;
      if (len >= 5) { return true }
    } else {
      idx = 1;
      break
    }
  }
  for (let i = x + 1; i <= chessBoard.length; i++) {
    if (y - idx >= 0 && arr.hasItem({ x: i, y: y - idx })) {
      len += 1;
      idx += 1;
      if (len >= 5) { return true }
    } else {
      idx = 1;
      break
    }
  }
}

// 悔棋
let toBack = () => {
  let player_arr = !p1 ? player1_arr.slice(-1) : player2_arr.slice(-1);
  console.log(player_arr);
  if (player_arr.length > 0) {
    let [{x, y}] = player_arr;
    context.clearRect((x) * 30, (y) * 30, 30, 30);
    // 重画该圆周围的格子
    context.strokeStyle = '#666';
    context.beginPath();
    context.moveTo(15 + x * 30, y * 30);
    context.lineTo(15 + x * 30, y * 30 + 30);
    context.moveTo(x * 30, y * 30 + 15);
    context.lineTo((x + 1) * 30, y * 30 + 15);

    context.stroke();
    chessBoard[x][y] = 0;
    !p1 ? p1_return_arr.push(player1_arr) : p1_return_arr.push(player1_arr);
    !p1 ? player1_arr.splice(-1) : player2_arr.splice(-1);

    p1 =  !p1
  } else {
    alert('没有可悔的棋')
  }
}

let drawPieces = (x, y, p1) => {
  // 创建路径
  context.beginPath();
  // 绘制圆(棋子)
  context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI);
  context.closePath();
  // 阴影位置
  let gradient = context.createRadialGradient(15 + x * 30 + 2, 15 + y * 30 - 2, 13, 15 + x * 30 + 2, 15 + y * 30 - 2, 0);

  if (p1) {
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#f9f9f9')
  } else {
    gradient.addColorStop(0, '#d1d1d1');
    gradient.addColorStop(1, '#f9f9f9');
  }
  context.fillStyle = gradient;
  context.fill()
}


let init = () => {
  drawChessBoard();
  restart.addEventListener('click', () => window.location.reload())
  canvas.addEventListener('click', handleClick)
  goback.addEventListener('click', () => {
    toBack()
  })
}

window.onload = init()
