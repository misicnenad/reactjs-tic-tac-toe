import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: { x: null, y: null }
            }],
            stepNumber: 0,
            xIsNext: true,
            timeTravelAscending: true,
            winningFields: null,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0,
            this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || this.isDraw() || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: { x: i % 3, y: Math.floor(i / 3) }
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    isDraw() {
        return this.state.stepNumber === 9;
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reverseTimeTravel() {
        this.setState({ timeTravelAscending: !this.state.timeTravelAscending });
    }

    isButtonBold(move) {
        return this.state.stepNumber === move ? { fontWeight: "bold" } : { fontWeight: "normal" };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winningFields = calculateWinner(current.squares);

        let moves = history.map((value, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={this.isButtonBold(move)}>
                        {desc}
                    </button>
                    <span>  ({value.location.x}{value.location.x !== null ? "," : ""} {value.location.y})</span>
                </li>
            )
        });
        if (!this.state.timeTravelAscending) {
            moves.reverse();
        }

        let status;
        if (winningFields) {
            this.setState({
                winningFields: winningFields,
            })
            status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
        } else if (this.isDraw()) {
            status = 'Draw';
        } else {
            status = 'Next player: ' +
                (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningFields={this.state.winningFields}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>
                        <li key="toggle">
                            <button onClick={() => this.reverseTimeTravel()}>Toggle asc/desc</button>
                        </li>
                        {moves}
                    </ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
        if (squares[a] && squares[a] === squares[b]
            && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}