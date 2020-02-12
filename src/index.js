import ReactDOM from 'react-dom'
import React from 'react'


// import store from './ReduxPractice/ReduxStore'
// import { addArticle } from './ReduxPractice/actions/action'
// window.addArticle = addArticle

// import DragBoard from './Immutable'
// ReactDOM.render(<DragBoard style={{ width: 500, height: 500 }} />, document.getElementById('root'));

// import ProductTableContainer from './ProductTable'
// ReactDOM.render(<ProductTableContainer/>, document.getElementById('root'));

// import Container from './ProductCatalog/Container'
// ReactDOM.render(<Container/>, document.getElementById('root'));

// import store from './ProductKartTest/Redux/ReduxStore'
// import {Provider} from 'react-redux'
// import ReduxForm from './ProductKartTest/Redux/components/addProduct'
// ReactDOM.render(<Provider store={store}><ReduxForm/></Provider>, document.getElementById('root'));

import store from './ProductKart/Redux/ReduxStore'
import {Provider} from 'react-redux'
import ProductKartContainer from './ProductKart/components/Container'
ReactDOM.render(<Provider store={store}><ProductKartContainer/></Provider>, document.getElementById('root'));