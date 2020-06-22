export function calculateAspectRatio(Frame, Image, clip){
    
    let selectedItem = Frame

    let clipWidth  = selectedItem.getIn(['clipDetails', clip, 'clipWidth'])
    let clipHeight = selectedItem.getIn(['clipDetails', clip, 'clipHeight'])
    let frameHeight = selectedItem.get('height')
    let frameWidth = selectedItem.get('width')
    let imageWidth
    let imageHeight

    let width, height, type, X, Y
    
    if (Image !== null) {
        const selectedImage = Image
        imageWidth  = selectedImage.get('width')
        imageHeight = selectedImage.get('height')
    } else {
        imageWidth  = selectedItem.getIn(['clipDetails', clip, 'imgDetails', 'width'])
        imageHeight = selectedItem.getIn(['clipDetails', clip, 'imgDetails', 'height'])
    }

    X = selectedItem.getIn(['clipDetails', clip, 'clipX'])
    Y = selectedItem.getIn(['clipDetails', clip, 'clipY'])

    let imageAspectRatio = imageWidth / imageHeight
    let frameAspectRatio = clipWidth / clipHeight
        
    if (imageAspectRatio < frameAspectRatio) {

        width = clipWidth
        height = (clipWidth * (imageHeight / imageWidth))

        Y = (Y + clipHeight / 2) - height / 2

        type = 1

    } else if(imageAspectRatio > frameAspectRatio){

        width = clipHeight * (imageWidth / imageHeight)
        height = clipHeight

        X = (X + clipWidth / 2) - width / 2

        type = 2

    } else if(imageAspectRatio === frameAspectRatio) {

        width = clipWidth
        height = clipHeight

        X = (X + clipWidth / 2) - width / 2
        Y = (Y + clipHeight / 2) - height / 2

        type = 0

    }

    width = width / frameWidth
    height = height / frameHeight
    X = X / frameWidth
    Y = Y / frameHeight

    return { width, height, X, Y, type }
}
