import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 函数组件
function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}>
        {props.value}
    </button>
  )
}

/**
 * class 组件
 * 渲染了 9 个方块
 */
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}/>
    );
  }

  render() {
    let total = this.props.total;
    let row = Math.sqrt(total)
    // 使用两个循环来渲染出棋盘的格子
    let outerDiv = [];
    for(let i = 0; i < total ; i+=row) {
      let squares = [];
      for(let j = i; j < i + row; j = j + 1) {
        let square = this.renderSquare(j)
        squares.push(square)
      }
      outerDiv.push(
        <div key={i} className="board-row">{squares}</div>
      )
    }
    return (
      <div>
        {outerDiv}
      </div>
    );
  }
}

/**
 * 棋盘
 */
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0, // 当前正在查看哪一项历史记录
      xIsNext: true,
      desc:false, // 降序
      total: 9 // 格子数
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      // 在历史记录列表中加粗显示当前选择的项目
      let className = this.state.stepNumber === move ? 'bold' : '';
      return (
        <li key={move}>
          <button className={ className } onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner:' + winner;
    } else if (this.state.stepNumber === this.state.total) { // 当无人获胜时，显示一个平局的消息。
      status = 'It ends in a draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            total={this.state.total}
            squares={current.squares} 
            onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{ this.state.desc ? moves.reverse() : moves}</ol>
        </div>
        <div>
          <button onClick={() => this.historySort()}>排序</button>
        </div>
      </div>
    );
  }
  // 升序或降序显示历史记录
  historySort() {
    this.setState({
      desc: !this.state.desc
    })
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // 调用了 .slice() 方法创建了 squares 数组的一个副本
    // 当有玩家胜出时，或者某个 Square 已经被填充时，直接返回
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
}

// 判断出胜者
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
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; 
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
