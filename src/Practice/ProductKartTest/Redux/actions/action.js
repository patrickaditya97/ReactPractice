import {ADD_PRODUCTS} from '../constants/actions-types'

export default function addProduct(payload) {
    return { type: ADD_PRODUCTS, payload }
}