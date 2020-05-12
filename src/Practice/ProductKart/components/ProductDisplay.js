import React from 'react';
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import { editProduct, deleteProduct } from '../Redux/actions/action'
// import store from '../Redux/ReduxStore';

const mapStateToProps = (state) => {
    // console.log(state.productList);
    return { productList: state.getIn(['productList']) }
}


const mapDispatchToProps = (dispatch) => {
    return { editProduct: (payload) => dispatch(editProduct(payload)), deleteProduct: (payload) => dispatch(deleteProduct(payload))}
}


class ProductDisplay extends React.Component {

    randomId = () => {
        return 'xx-4yy-xy'.replace(/[xy]/g, () => {
            return Math.trunc(Math.random() * 16)
        })
    }

    Edit = (key) => {

        this.props.editProduct(key)

    }
    
    Delete = (key) => {
        this.props.deleteProduct(key)
    }

    render() {

        // store.subscribe(()=>{
        //     console.log(store.getState());
            
        // })
        
        // console.log(this.props);
        

        let productRowArr = []
        let count = 1
        this.props.productList.getIn(['items']).forEach((item, Key) => {
            // console.log(Key, item);
            
            productRowArr.push(
                <tr key={this.randomId()}>
                    <td key={this.randomId()}>{count++}</td> 
                    <td key={this.randomId()}>{item.getIn(['pName'])}</td>
                    <td key={this.randomId()}>{item.getIn(['category'])}</td>
                    <td key={this.randomId()}>{(item.getIn(['stockChecked'])) ? 'yes' : 'no'}</td>
                    <td key={this.randomId()}>
                        <button className="btn btn-primary" onClick={() => this.Edit(Key)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => this.Delete(Key)}>Delete</button>
                    </td>
                </tr>
            )

        })



        return (
            <div style={{ marginTop: 50 + 'px' }}>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Availability</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productRowArr}
                    </tbody>
                </Table>
            </div>
        );
    }
}

const DisplayProducts = connect(mapStateToProps, mapDispatchToProps)(ProductDisplay)

export default DisplayProducts