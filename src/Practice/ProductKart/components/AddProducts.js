import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';

import { addProduct, updateProduct, addCategory } from '../Redux/actions/action'
import { connect } from 'react-redux'


const mapDispatchToProps = (dispatch) => {
    return { 
        addProduct: (payload) => dispatch(addProduct(payload)), 
        updateProduct: (payload) => dispatch(updateProduct(payload)), 
        addCategory: (payload) => dispatch(addCategory(payload)), 
    };
}


const mapStateToProps = (state) => {
    return { 
        activeUpdate: state.getIn(['activeUpdate']), 
        productList: state.getIn(['productList']),
        categoryList: state.getIn(['categoryList'])
    };
}


const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? 'modalShow display-block' : 'modalShow display-none';

    return (
        <div className={showHideClassName}>
            <section className='modalShow-main'>
                {children}
                <button style={{ position: 'absolute', bottom: 10 + 'px', right: 10 + 'px' }} onClick={handleClose}>
                    Close
                </button>
            </section>
        </div>
    );
};

class AddProducts extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            updateKey: '',
            addCategory: '',
            pName: '',
            category: '',
            stockChecked: false,
        }
        this.pNameRef = React.createRef();
        this.categoryRef = React.createRef();
    }

    showModal = () => {
        (this.state.show === false) ? this.setState({ show: true }) : this.setState({ show: false });
    }


    addNewCategory = () => {

        // let newCategoryList = this.state.categoryList.push(this.state.addCategory)
        // this.setState({ categoryList: newCategoryList, addCategory: '' })

        this.props.addCategory(this.state.addCategory)
        this.setState({ addCategory: '' })

    }
    

    handleInputChange = (event) => {
        
        const target = event.target
        let tValue = ''
        const name = target.name
        if (target.type === 'text') {
            tValue = target.value
        }
        else if (target.type === 'select-one') {
            tValue = target.value
        }
        else {
            tValue = target.checked
        }
        
        const value = tValue

        this.setState({ [name]: value })

    }


    inputValidations = () => {
        if (!this.state.category || !this.state.pName) {
            return false
        }
        else{
            return true
        }
    }


    addNewProduct = () => {

        if (this.inputValidations()) {

            let newProductDetails = {
                pName: this.state.pName,
                category: this.state.category,
                stockChecked: this.state.stockChecked,
            }
            this.props.addProduct(newProductDetails)

            this.setState({
                pName: '', category: '', stockChecked: false,
            })

            this.pNameRef.current.style.border = ''
            this.categoryRef.current.style.border = ''

        }
        else{
            if (this.state.pName === '' && this.state.category === '') {
                // console.log(this.pNameRef);

                this.pNameRef.current.style.border = '1px solid red'
                this.categoryRef.current.style.border = '1px solid red'

                
            } else if(this.state.category === '') {
                console.log('category empty');

                this.pNameRef.current.style.border = ''
                this.categoryRef.current.style.border = '1px solid red'

            } else{
                console.log('pName empty');
                
                this.pNameRef.current.style.border = '1px solid red'
                this.categoryRef.current.style.border = ''

            }
        }
    }

    updateProductToRedux = () => {

        let ProductDetailsToUpdate = {
            pName: this.state.pName,
            category: this.state.category,
            stockChecked: this.state.stockChecked,
        }

        this.props.updateProduct(ProductDetailsToUpdate)

        this.setState({
            pName: '', category: '', stockChecked: false, updateKey: ''
        })
    }

    // randomId = () => {
    //     return 'xx-4yy-xy'.replace(/[xy]/g, () =>{
    //         return Math.trunc(Math.random()*16)
    //     })
    // }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeUpdate !== this.props.activeUpdate && this.props.activeUpdate !== null) {

            // var editableData = this.props.getIn(['productList', 'items', this.props.activeUpdate])
            // console.log(this.props.productList.getIn(['items', this.props.activeUpdate, 'pName']), this.props.activeUpdate);

            this.setState({
                updateKey: this.props.activeUpdate,
                pName: this.props.productList.getIn(['items', this.props.activeUpdate, 'pName']),
                category: this.props.productList.getIn(['items', this.props.activeUpdate, 'category']),
                stockChecked: this.props.productList.getIn(['items', this.props.activeUpdate, 'stockChecked'])
            })

        }
    }

    render() {
        

        let selectArr = []

        this.props.categoryList.toJS().forEach(element => {
            selectArr.push(<option value={element} key={element}>{element}</option>)
        });


        return (
            <div>

                <div>
                    <Row>

                        <Col>
                            <label> Product Name </label>
                            <input className="form-control" ref={this.pNameRef} type="text" name="pName" onChange={(e) => { this.handleInputChange(e, "pName") }} value={this.state.pName} />
                        </Col>

                        <Col>
                            <label> Category </label><br />

                            <select ref={this.categoryRef} className="form-control" id="sel1" name="category" value={this.state.category}
                                onChange={this.handleInputChange} style={{ float: 'left', width: 70 + '%' }}>
                                <option value="" disabled={true}></option>
                                {selectArr}
                            </select>

                            <div style={{ overflow: 'hidden', paddingRight: .5 + 'em' }}>
                                <button className="btn btn-primary" type="button" style={{ width: 100 + '%' }} onClick={this.showModal}>Add Category</button>
                            </div>


                        </Col>
                        <Col style={{ maxWidth: 100 + 'px' }}>

                            In Stock &nbsp; &nbsp; &nbsp;<br />
                            <input type="checkbox" id="stockCheck" name="stockChecked" onChange={this.handleInputChange} value={this.state.stockChecked} />
                        </Col>

                    </Row>
                    <Row>

                        <Col>
                            {(this.state.updateKey === '') ? (

                                <button className="btn btn-primary" style={{ marginTop: 20 + 'px' }} onClick={this.addNewProduct} type="submit">
                                    Add New Product
                                </button>

                            ) : (
                                    <button className="btn btn-primary" style={{ marginTop: 20 + 'px' }} onClick={this.updateProductToRedux} type="submit">
                                        Edit Product
                                </button>
                                )}

                        </Col>

                    </Row>

                    <Modal show={this.state.show} handleClose={this.showModal} >

                        <input className="form-control" type="text" name="addCategory" value={this.state.addCategory} onChange={this.handleInputChange} />

                        <button className="btn btn-primary" style={{ marginTop: 20 + 'px' }} onClick={this.addNewCategory}>
                            Add Category
                        </button>

                    </Modal>

                </div>

            </div>
        );
    }
}

const AddProductToRedux = connect(mapStateToProps, mapDispatchToProps)(AddProducts)

export default AddProductToRedux