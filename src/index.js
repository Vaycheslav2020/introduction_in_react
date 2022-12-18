import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const listBoard = [];
    let count = 0;
    for (let i = 0; i < 3; i++) {
      const listSquare = [];
      for (let t = 0; t < 3; t++) {
        listSquare.push(this.renderSquare(count));
        count += 1;
      }
      listBoard.push(
        <div key={i} className="board-row">
          {listSquare}
        </div>
      );
    }
    return <div>{listBoard}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  getCol(index) {
    let posCol;
    const col = [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];

    for (let i = 0; i < col.length; i++) {
      const el = col[i];
      for (let j = 0; j < el.length; j++) {
        const [a, b, c] = el;
        if (index === a || index === b || index === c) {
          posCol = i + 1;
        }
      }
    }
    return posCol
  }

  getRow(index) {
    let posRow;
    const row = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];

    for (let i = 0; i < row.length; i++) {
      const el = row[i];
      for (let j = 0; j < el.length; j++) {
        const [a, b, c] = el;
        if (index === a || index === b || index === c) {
          posRow = i + 1;
        }
      }
    }
    return posRow
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
    document.querySelectorAll(".square").forEach((sqr) => {
      sqr.style.background = "none";
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Перейти к ходу" + " " + move : "К началу игры";
      const pos = "колонка: " + this.getCol() + ", ряд: " + this.getRow();
      return (
        <li key={move}>
          <button
            className={`sidebar ${
              this.state.stepNumber === move ? "active" : ""
            }`}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
          <span>{pos}</span>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Выиграл" + winner;
    } else {
      status = "Следующий ход:" + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const linesItem = lines[i]
      for (let i = 0; i < linesItem.length; i++) {
        const sqr = linesItem[i]
        let list = document.querySelectorAll(".square")
        list[sqr].style.background = "red"
      }
      return squares[a];
    }
  }
  return null;
}
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
