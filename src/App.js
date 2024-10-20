import { useState } from 'react';

function Square({key, value, onSquareClick, className }) {
  return <button
          key={key}
          className={className}
          onClick={onSquareClick}
         >
            { value }
         </button>;
}

function Board({xIsNext, currentMove, squares, onPlay}) {
  function handeClick(i) {
    if (calculateWinRow(squares)) {
      return;
    }

    if (squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares, i);
  }

  const winRow = calculateWinRow(squares);
  const winner = winRow ? squares[winRow[0]] : null;

  let status = winner ? `Winner: ${winner}` : "Next player: " + (xIsNext ? "X" : "O");
  if (currentMove == 9 && !winner) {
    status = 'draw';
  }

  const table = [];
  for (let i = 0; i < 3; i++) {
    const squareArr = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const className = winRow && (winRow[0] == index || winRow[1] == index || winRow[2] == index) ? "light-square" : "square";
      squareArr.push(
        <Square key={index} className={className} value={squares[index]} onSquareClick={() => handeClick(index)}/>
      )
    }

    table.push(
      <div key={'row' + i} className="board-row">
        {squareArr}
      </div>
    );
  }  
  
  return (
      <>
        <div className="status">{status}</div>
        {table}
      </>
    );
}

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), location: null}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [toggle, setToggle] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquare = history[currentMove].squares;

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, location: index}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((square, move) => {
    let description = move > 0 ? `Go to move #${move}` : "Go to game start";
    const location = {x: Math.floor(square?.location), y: square?.location % 3};
    return (
      move != currentMove ? (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      ) : 
      (
        <li key={move}>
          <div >You are at move #{move} ({location.x}, {location.y})</div>
        </li>
      )
    );
  });

  if (!toggle) {
    moves.reverse();
  }

  const sort = <button onClick={() => setToggle(!toggle)}>sort</button>

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} currentMove={currentMove} squares={currentSquare} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div>{sort}</div>
    </div>
  );
}

function calculateWinRow(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] == squares[b] && squares[b] == squares[c]) {
      return lines[i];
    }
  }

  return null;
}