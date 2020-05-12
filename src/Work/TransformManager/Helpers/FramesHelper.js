export function calculateAspectRatio(Frame){

    let selectedItem = Frame

    let clipWidth  = selectedItem.getIn(['frameDetails', 'clipWidth'])
    let clipHeight = selectedItem.getIn(['frameDetails', 'clipHeight'])
    let frameHeight = selectedItem.get('height')
    let frameWidth = selectedItem.get('width')
    let imageWidth  = selectedItem.getIn(['imgDetails', 'width'])
    let imageHeight = selectedItem.getIn(['imgDetails', 'height'])
    
    let imageAspectRatio = imageWidth / imageHeight
    let frameAspectRatio = clipWidth / clipHeight
    
    let width, height, imageX, imageY, X, Y, type

    imageX = selectedItem.get('width') / 2 - clipWidth / 2
    imageY = selectedItem.get('height') / 2 - clipHeight / 2

    if (imageAspectRatio < frameAspectRatio) {

        width = clipWidth
        height = (clipWidth * (imageHeight / imageWidth))

        X = imageX
        Y = (frameHeight / 2 - height / 2)

        type = 1

    } else if(imageAspectRatio > frameAspectRatio){

        width = clipHeight * (imageWidth / imageHeight)
        height = clipHeight

        X = (frameWidth / 2 - width / 2)
        Y = imageY

        type = 2

    } else if(imageAspectRatio === frameAspectRatio) {

        width = clipWidth
        height = clipHeight

        X = (frameWidth / 2 - width / 2)
        Y = frameHeight / 2 - height / 2

        type = 0

    }

    width = width / imageWidth
    height = height / imageHeight
    X = X / imageWidth
    Y = Y / imageHeight

    return { width, height, X, Y, type }
}
