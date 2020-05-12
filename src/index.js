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

// import store from './ProductKart/Redux/ReduxStore'
// import {Provider} from 'react-redux'
// import ProductKartContainer from './ProductKart/components/Container'
// ReactDOM.render(<Provider store={store}><ProductKartContainer/></Provider>, document.getElementById('root'));

// import SliderContainer from './Slider/Slidercontainer'
// ReactDOM.render(<SliderContainer />, document.getElementById('root'))

// import TodoList from "./Mobx/todoList";
// import store from "./Mobx/todoStore";
// ReactDOM.render(<TodoList store={store}/>, document.getElementById('root'))

// import PutThisOnScreen from "./Test";
// ReactDOM.render(<PutThisOnScreen/>, document.getElementById('root'))

// import Frames from "./Frames/Frames"
// ReactDOM.render(<Frames/>, document.getElementById('root'))

import {Provider} from 'react-redux'
import store from "./Work/TransformManager/redux/store"
import Workspace from "./Work/TransformManager/containers/Workspace";
ReactDOM.render(<Provider store={store}><Workspace style={{ width: 800, height: 500 }} /></Provider>, document.getElementById('root'));