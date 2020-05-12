    /* TransformManagerComponent */

export const updateTransformStatus = (data, socket) => ({
    type: "UPDATE_TRANSFORM_STATUS",
    data
})

export const resizeUpdate = (data, socket) => ({
    type: "RESIZE_UPDATE",
    data
})

export const moveUpdate = (data, socket) => ({
    type: "MOVE_UPDATE",
    data
})

export const rotateUpdate = (data, socket) => ({
    type: "ROTATE_UPDATE",
    data
})

export const  setCurrentPosition = (data) => ({
    type : "SET_CURRENT_POSITION",
    data
})

    /* TransformManagerComponent */


    /* CropComponent */

export const toggleCrop = () => ({
    type: "TOGGLE_CROP"
})

export const toggleBgCrop = () => ({
    type: "TOGGLE_BG_CROP"
})

export const toggleFrame = () => ({
    type: "TOGGLE_FRAME"
})

export const cropImage = (data, socket) => ({
    type: 'CROP_IMAGE',
    data, socket
})

export const cropBG = (data, socket) => ({
    type: 'CROP_BG',
    data, socket
})
    /* CropComponent */