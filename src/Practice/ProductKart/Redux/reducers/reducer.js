import { ADD_PRODUCTS, ADD_CATEGORY, UPDATE_PRODUCT_DETAILS, EDIT_PRODUCT_DETAILS, DELETED_PRODUCT } from '../constants/actions-types'
import { fromJS } from 'immutable';
const { Map, List } = require('immutable');


let initialState = Map({
    'categoryList': List(['Electronics', 'Sports Equipment', 'Food', 'Clothes']),
    'productList': Map({ 'items': Map({}) }),
    'activeUpdate': null,
    'updateKey': '',
})

const randomId = () => {
    return 'xx-4xy-yy'.replace(/[xy]/g, () =>{
        return Math.trunc(Math.random()*16)
    })
}

function rootReducer(state = initialState, action) {

    switch (action.type) {
        case ADD_PRODUCTS:
            
            return state.setIn(['productList', 'items', randomId()], fromJS(action.payload))

        case ADD_CATEGORY:
            return  state.updateIn(['categoryList'], function (newCategory) {
                return newCategory.push(action.payload)
            })

        case EDIT_PRODUCT_DETAILS:
            
            return state.setIn(['activeUpdate'], fromJS(action.payload))

        case UPDATE_PRODUCT_DETAILS:
            
            return state.setIn(['productList', 'items', state.getIn(['activeUpdate'])], fromJS(action.payload)).setIn(['activeUpdate'], null)

        case DELETED_PRODUCT:
            
            return state.removeIn(['productList', 'items', action.payload])

        default:
            break;
    }


    return state
}

export default rootReducer