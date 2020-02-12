import { ADD_ARTICLE } from '../constants/action-types'

const initialState = {
    pName: '',
    category: '',
    addCategory: '',
    stockChecked: false,
    productList: Map({ 'items': Map({}) }),
    categoryList: List(['Electronics', 'Sports Equipment', 'Food', 'Clothes']),
}

function rootReducer(state = initialState, action) {
    if (action.type === ADD_ARTICLE) {

        return Object.assign({}, state, { articles: state.articles.concat(action.payload) })

        // state.articles.push(action.payload) 
        //(is not used due to the mutability issue state management should be immutable)
    }
    return state
}

export default rootReducer