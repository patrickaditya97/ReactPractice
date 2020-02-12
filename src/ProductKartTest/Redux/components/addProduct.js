import React from 'react';
import {connect, dispatch} from 'react-redux';
import addProduct from '../actions/action'
import store from '../ReduxStore'

function mapDispatchToProps(dispatch) {
    return {addProduct: (payload) => dispatch(addProduct(payload))}
}

class SampleForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            category: '',
            pName: ''
        }
    }


    inputOnChange = (e) => {

        if (e.target.name === 'category') {
            // console.log('cat');
            this.setState({ category: e.target.value })
        }
        else if (e.target.name === 'pName') {
            // console.log('p');
            this.setState({ pName: e.target.value })

        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        this.props.addProduct({ pName: this.state.pName, category : this.state.category });
    }
    
    render() {
        
        store.subscribe(()=>{
            console.log(store.getState())
        })

        return (
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input type="text" name="category" placeholder="category" value={this.state.category} onChange={this.inputOnChange} />
                    <input type="text" name="pName" placeholder="pName" value={this.state.pName} onChange={this.inputOnChange} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

const ReduxForm = connect(null, mapDispatchToProps)(SampleForm)

export default ReduxForm