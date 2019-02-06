import React from "react";

function Square(props) {
    return (
        <button
            className="square"
            style={props.highlighted ? {backgroundColor:"yellow"} : null}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export default class Board extends React.Component {
    renderSquare(i) {        
        var isHighlighted = this.props.winningFields && this.props.winningFields.includes(i);
        return <Square
            key={i}
            highlighted={isHighlighted}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    renderRow(row) {
        var cols = [];
        for (let col = 0; col < 3; col++) {
            cols.push(this.renderSquare(3 * row + col));
        };

        return (
            <div key={row} className="board-row">
                {cols}
            </div>
        );
    }

    renderRows() {
        var rows = [];
        for (let row = 0; row < 3; row++) {
            rows.push(this.renderRow(row));
        };
        return rows;
    }

    render() {
        return (
            <div>
                {this.renderRows()}
            </div>
        );
    }
}