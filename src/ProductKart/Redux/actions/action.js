import {ADD_PRODUCTS, UPDATE_PRODUCT_DETAILS, EDIT_PRODUCT_DETAILS, DELETED_PRODUCT, ADD_CATEGORY} from '../constants/actions-types'

export function addProduct(payload) {
    return { type: ADD_PRODUCTS, payload }
}


export function editProduct(payload) {
    return { type: EDIT_PRODUCT_DETAILS, payload }
}


export function updateProduct(payload) {
    return { type: UPDATE_PRODUCT_DETAILS, payload }
}


export function deleteProduct(payload) {
    return { type: DELETED_PRODUCT, payload }
}


export function addCategory(payload) {
    return { type: ADD_CATEGORY, payload }
}