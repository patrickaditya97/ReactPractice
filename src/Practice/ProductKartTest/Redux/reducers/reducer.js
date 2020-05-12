import {ADD_PRODUCTS} from '../constants/actions-types'

const initialState = {
    category: '',
    pName: ''
}

function rootReducer(state = initialState, action) {

    switch (action.type) {
        case ADD_PRODUCTS:
            
            return Object.assign({}, state, { category: state.category.concat(action.payload.category), pName: state.category.concat(action.payload.pName) })
    
        default:
            break;
    }


    // if(action.type === ADD_PRODUCTS) {
    //     Object.assign({}, state, { products: action.payload.concat(action.payload)})
    // }


    return state
}

export default rootReducer