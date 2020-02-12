import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import {Form, Button} from 'react-bootstrap';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }

        this.onInputSearchTermChanged = this.onInputSearchTermChanged.bind(this);
    }

    onInputSearchTermChanged(e) {
        // console.log(e.target.value); 

        this.setState({ inputValue: e.target.value })

        this.props.Search(e.target.value)
    }

    render() {
        return (
            <div style={{ width: 200 + 'px', margin: 'auto' }}>
                <input className="form-control" type="text" name="searchTerm" id="searchTerm" value={this.state.inputValue} onChange={this.onInputSearchTermChanged} /><br />
                <input type="checkbox" id="stockCheck" onClick={this.props.onClickStock} /> In stock items only<br />
            </div>
        )
    }
}

export default SearchBar