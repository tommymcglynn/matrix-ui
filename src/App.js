import React from 'react';
import './App.css';
import Matrix from "./Matrix";

const axios = require('axios');

const MIN_SIZE = 2;
const MAX_SIZE = 20;
const DEFAULT_SIZE = 5;
const MAX_CELL_SIZE = 60;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {cols: DEFAULT_SIZE, rows: DEFAULT_SIZE, cellSize: MAX_CELL_SIZE, showSettings: false, statusMessage: "", matrixData: this.constructData(DEFAULT_SIZE, DEFAULT_SIZE, null)};

        this.onColCountChange = this.onColCountChange.bind(this);
        this.onRowCountChange = this.onRowCountChange.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onMatrixDataChange = this.onMatrixDataChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    constructData(colCount, rowCount, data) {
        let newData = [];
        for (let row = 0; row < rowCount; row++) {
            let dataCols = [];
            for (let col = 0; col < colCount; col++) {
                let value = data != null && data[row] != null && data[row][col] ? data[row][col] : 0;
                dataCols.push(value);
            }
            newData.push(dataCols);
        }

        return newData;
    }

    calculateCellSize() {
        let maxWidth = window.innerWidth * 0.6;
        return Math.min(Math.floor(maxWidth / this.state.cols / 10) * 10, MAX_CELL_SIZE);
    }

    onWindowResize() {
        this.setState({ cellSize: this.calculateCellSize() });
    }

    onColCountChange(e) {
        let cols = e.target.value;
        cols = (cols === undefined) ? MIN_SIZE : parseInt(cols);
        cols = isNaN(cols) ? MIN_SIZE : cols;
        cols = cols > MAX_SIZE ? MAX_SIZE : cols;
        this.setState({
            cols: cols,
            matrixData: this.constructData(cols, this.state.rows, this.state.matrixData),
            statusMessage: "",
            cellSize: this.calculateCellSize()
        });
    }

    onRowCountChange(e) {
        let rows = e.target.value;
        rows = (rows === undefined) ? MIN_SIZE : parseInt(rows);
        rows = isNaN(rows) ? MIN_SIZE : rows;
        rows = rows > MAX_SIZE ? MAX_SIZE : rows;
        this.setState({
            rows: rows,
            matrixData: this.constructData(this.state.cols, rows, this.state.matrixData),
            statusMessage: "",
            cellSize: this.calculateCellSize()
        });
    }

    onMatrixDataChange(data) {
        this.setState({matrixData: data});
    }

    onSubmit() {
        let data = this.constructData(this.state.cols, this.state.rows, this.state.matrixData);
        let self = this;
        axios.post('/matrix', {
            data: data
        })
        .then(function (response) {
            self.setState({statusMessage: response.data.message});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    onClear() {
        this.setState({
            matrixData: this.constructData(this.state.cols, this.state.rows, null),
            statusMessage: ""
        });
    }

    render() {
        let settingsButton = (
            <div className="menu"><i onClick={() => this.setState({showSettings: true})} className="settingsButton lnr lnr-cog"/></div>
        );
        let settings = (
            <div className="settingsPanel">
                <form>
                    <div>
                        <label>Columns</label>
                        <input value={this.state.cols} type="number" name="columns" min={MIN_SIZE} max={MAX_SIZE} size="2" onChange={this.onColCountChange}/>
                    </div>
                    <div>
                        <label>Rows</label>
                        <input value={this.state.rows} type="number" name="rows" min={MIN_SIZE} max={MAX_SIZE} onChange={this.onRowCountChange}/>
                    </div>
                </form>
            </div>
        );
        let overlay = (
            <div className="overlay" onClick={() => this.setState({showSettings: false})}>&nbsp;</div>
        );

        return (
            <div className="App">
                {settingsButton}
                {(this.state.showSettings ? settings : null)}
                {(this.state.showSettings ? overlay : null)}
                <div className="mainContainer">
                    <Matrix cols={this.state.cols} rows={this.state.rows} cellSize={this.state.cellSize} data={this.state.matrixData} onChange={this.onMatrixDataChange} />
                    <div>
                        <div className="button clear" onClick={() => this.onClear()}>Clear</div>
                        <div className="button submit" onClick={() => this.onSubmit()}>Submit</div>
                    </div>
                    <div className="statusMessage">
                        {this.state.cols}x{this.state.rows} {this.state.statusMessage}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
