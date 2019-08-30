import React from 'react';
import './App.css';
import Matrix from "./Matrix";

const MIN_SIZE = 2;
const MAX_SIZE = 10;
const DEFAULT_SIZE = 5;
const MAX_CELL_SIZE = 60;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {cols: DEFAULT_SIZE, rows: DEFAULT_SIZE, cellSize: MAX_CELL_SIZE, showSettings: false};

        this.onColCountChange = this.onColCountChange.bind(this);
        this.onRowCountChange = this.onRowCountChange.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize() {
        let maxWidth = window.innerWidth * 0.8;
        let cellSize = Math.min(Math.floor(maxWidth / this.state.cols / 10) * 10, MAX_CELL_SIZE);
        this.setState({ cellSize: cellSize });
    }

    onColCountChange(e) {
        var cols = e.target.value;
        cols = (cols === undefined) ? MIN_SIZE : parseInt(cols);
        cols = isNaN(cols) ? MIN_SIZE : cols;
        cols = cols > MAX_SIZE ? MAX_SIZE : cols;
        this.setState({cols: cols})
    }

    onRowCountChange(e) {
        var rows = e.target.value;
        rows = (rows === undefined) ? MIN_SIZE : parseInt(rows);
        rows = isNaN(rows) ? MIN_SIZE : rows;
        rows = rows > MAX_SIZE ? MAX_SIZE : rows;
        this.setState({rows: rows})
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
                    <Matrix cols={this.state.cols} rows={this.state.rows} cellSize={this.state.cellSize} />
                    <div className="submitButton">Submit</div>
                    <div className="statusMessage">
                        {this.state.cols}x{this.state.rows} Status message
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
