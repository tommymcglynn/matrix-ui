import React from 'react';

import './Matrix.css';

const MAX_DATA_SIZE = 20;

class Matrix extends React.Component {

    constructor(props) {
        super(props);

        this.state = {data: Matrix.constructData(MAX_DATA_SIZE, MAX_DATA_SIZE)};

        this.onClickCell = this.onClickCell.bind(this);
    }

    static constructData(colCount, rowCount) {
        let newData = [];
        for (let row = 0; row < rowCount; row++) {
            let dataCols = [];
            for (let col = 0; col < colCount; col++) {
                dataCols.push(0);
            }
            newData.push(dataCols);
        }

        return newData;
    }

    onClickCell(col, row) {
        let data = this.state.data;
        let value = data[row][col];
        value = value !== undefined ? value === 1 : false;
        data[row][col] = value ? 0 : 1;
        this.setState({data: data});
    }

    render() {

        let colCount = this.props.cols;
        let rowCount = this.props.rows;
        let cellSize = this.props.cellSize;

        let data = this.state.data;

        let cellIndex = 0;
        let onClickCell = this.onClickCell;
        let rows = [];
        for (let row = 0; row < rowCount; row++) {
            let cols = [];
            for (let col = 0; col < colCount; col++) {
                let value = data[row][col];
                let cellClass = value > 0 ? "cell on" : "cell off";
                cols.push((
                    <td className={cellClass} width={cellSize} height={cellSize} key={cellIndex} onClick={() => onClickCell(col, row)}>&nbsp;</td>
                ));
                cellIndex++;
            }
            rows.push((
                <tr key={row}>
                    {cols}
                </tr>
            ));
        }

        return (
            <div className="Matrix" ref={this.matrix}>
                <table>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Matrix;
