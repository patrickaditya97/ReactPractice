import React from 'react'
import axios from 'axios';

export default class CropComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cropSelectionBox: {}, unCroppedBox: {}, cropBox: {}, cropImage: {}, image: null };
        this.moveSelection = this.moveSelection.bind(this);
        this.stopMove = this.stopMove.bind(this);
        this.resizeCropSelection = this.resizeCropSelection.bind(this);
        this.stopCropResize = this.stopCropResize.bind(this);
        this.resizeSelection = this.resizeSelection.bind(this);
        this.stopResize = this.stopResize.bind(this);
        this.getUnCroppedXY = this.getUnCroppedXY.bind(this);
        this.getMousePosition = this.getMousePosition.bind(this);
        this.getUnCroppedResizePosition = this.getUnCroppedResizePosition.bind(this);
        this.resetCrop = this.resetCrop.bind(this);
        this.mouseStartPosition = { x: null, y: null, offsetX: null, offsetY: null };
        this.lastDown = null;
        this.moved = false;
        this.xLocked = false;
        this.lockedX = null;
        this.yLocked = false;
        this.lockedY = null;
        this.heightLocked = false;
        this.lockedHeight = null;
        this.widthLocked = false;
        this.lockedWidth = null;
    }

    componentWillMount() {

        let stateToUpdate = {};
        let cropItem = this.props.cropItem, config = this.props.config;

        let cropX,
            cropY,
            cropWidth,
            cropHeight,
            selectionX,
            selectionY,
            selectionWidth,
            selectionHeight,
            imgSrc,
            angle = 0,
            unCroppedX,
            unCroppedY,
            cropImageX,
            cropImageY;

        if (this.props.isCropping || this.props.isFraming) {
            if (cropItem.get("isCropped")) {

                selectionX = cropItem.get("x") + cropItem.getIn(["original", "x"]) * cropItem.get("width");
                selectionY = cropItem.get("y") + cropItem.getIn(["original", "y"]) * cropItem.get("height");
                selectionWidth = cropItem.getIn(["original", "width"]) * cropItem.get("width");
                selectionHeight = cropItem.getIn(["original", "height"]) * cropItem.get("height");

                cropWidth = cropItem.get("width");
                cropHeight = cropItem.get("height");
                cropX = cropItem.get("x") - selectionX;
                cropY = cropItem.get("y") - selectionY;

                console.log({
                    selectionX, selectionY, selectionWidth, selectionHeight, cropWidth, cropHeight, cropX, cropY
                });
                

            } else if (this.props.isFraming){

                selectionX = cropItem.get("x") + cropItem.getIn(["original", "x"]) * cropItem.get("width");
                selectionY = cropItem.get("y") + cropItem.getIn(["original", "y"]) * cropItem.get("height");
                selectionWidth = cropItem.getIn(["original", "width"]) * cropItem.get("width");
                selectionHeight = cropItem.getIn(["original", "height"]) * cropItem.get("height");

                cropWidth = cropItem.get("width") * cropItem.getIn(['imgDetails', 'widthRatio']);
                cropHeight = cropItem.get("height") * cropItem.getIn(['imgDetails', 'heightRatio']);
                cropX = (cropItem.get("x") - selectionX) * cropItem.getIn(['imgDetails', 'widthRatio']);
                cropY = (cropItem.get("y") - selectionY) * cropItem.getIn(['imgDetails', 'heightRatio']);

                console.log({
                    selectionX, selectionY, selectionWidth, selectionHeight, cropWidth, cropHeight, cropX, cropY
                });

            } else {
                selectionX = cropItem.get("x");
                selectionY = cropItem.get("y");
                selectionWidth = cropItem.get("width");
                selectionHeight = cropItem.get("height");

                cropWidth = cropItem.get("width") * 0.75;
                cropHeight = cropItem.get("height") * 0.75;
                if (this.props.isFraming) {
                    cropWidth = cropItem.get("width");
                    cropHeight = cropItem.get("height");
                }
                cropX = ((cropItem.get("width") / 2) - (cropWidth / 2));
                cropY = ((cropItem.get("height") / 2) - (cropHeight / 2));
            }


            let dX = 0, dY = 0;
            if (cropItem.get("flipPosition") === 1) {
                dX = (cropX - (selectionWidth - (cropX + cropWidth)));
            } else if (cropItem.get("flipPosition") === 2) {
                dY = (cropY - (selectionHeight - (cropY + cropHeight)));
            } else if (cropItem.get("flipPosition") === 3) {
                dX = (cropX - (selectionWidth - (cropX + cropWidth)));
                dY = (cropY - (selectionHeight - (cropY + cropHeight)));
            }

            unCroppedX = dX; 
            unCroppedY = dY; 
            cropImageX = (-1 * cropX) + dX; 
            cropImageY = (-1 * cropY) + dY;

            if (this.props.isCropping) {
                // imgSrc = this.assetUrl + config[cropItem.get('type')][config[cropItem.get('type')][(cropItem.get('subType')) ? 'workspace_' + cropItem.get('subType') : 'workspace']] + cropItem.get("src");

                imgSrc = cropItem.get("src");

				if (cropItem.get('type') === "STOCKIMG")
					imgSrc = config[cropItem.get("type")][config[cropItem.get("type")]['workspace']] + cropItem.get("src");
                else if (cropItem.get('type') === "UPLOADS" && cropItem.get("subType") === "UPIMAGE") {

					if (cropItem.get('isBlob')) {
						imgSrc = cropItem.get("src");
					} else {
						imgSrc = config["UPLOADS"][config["UPLOADS"]["workspace_UPIMAGE"]] + cropItem.get("src");
					}

				} else if (cropItem.get('type') === 'IMG' && cropItem.get('subType') === 'OBGIMG') {
					imgSrc = this.assetUrl + config['BG']['obgsrc'] + cropItem.get('src');
                }
                
                imgSrc = cropItem.get('src')

			}
			else {
				if (this.props.cropItem.getIn(['imgDetails', 'src']) && this.props.cropItem.getIn(['imgDetails', 'src']) !== "") {
                    console.log(this.props.cropItem.getIn(['imgDetails', 'src']));
                    
                    // imgSrc = this.assetUrl + this.props.config[this.props.cropItem.get('imageType')][this.props.config[this.props.cropItem.get('imageType')][(this.props.cropItem.get('imageSubType')) ? 'workspace_' + this.props.cropItem.get('imageSubType') : 'workspace']] + this.props.cropItem.get('imageSource');
                    imgSrc = this.props.cropItem.getIn(['imgDetails', 'src'])
				} else {
					imgSrc = "/assets/maskcover.png";
				}
            }
            
            angle = cropItem.get("angle");
            stateToUpdate.type = cropItem.get("type");
        } else if (this.props.isBgCropping) {

            let workspaceBG = this.props.currentSceneItems.get("workspaceBG");
            selectionX = workspaceBG.get("x") * this.props.workspaceWidth;
            selectionY = workspaceBG.get("y") * this.props.workspaceHeight;
            selectionWidth = workspaceBG.get("width") * this.props.workspaceWidth;
            selectionHeight = workspaceBG.get("height") * this.props.workspaceHeight;

            cropWidth = this.props.workspaceWidth;
            cropHeight = this.props.workspaceHeight;
            cropX = - selectionX;
            cropY = - selectionY;

            unCroppedX = 0; unCroppedY = 0; cropImageX = (-1 * cropX); cropImageY = (-1 * cropY);
            let bgType = workspaceBG.get("type");

            if (bgType === "STOCKIMG") {
                imgSrc = workspaceBG.get("src");
            } else if (workspaceBG.get('type') === 'IMG' && workspaceBG.get('subType') === 'OBGIMG') {
                imgSrc = this.assetUrl + config['BG']['obgsrc'] + workspaceBG.get('src');
            }
            else if (bgType !== "UPLOADS") {
                if (bgType === 'UPIMAGE') {
                    if (workspaceBG.get('isBlob')) {
                        imgSrc = workspaceBG.get("src");
                    } else {
                        imgSrc = config["UPLOADS"][config["UPLOADS"]["workspace_UPIMAGE"]] + workspaceBG.get("src");
                    }
                }
                else
                    imgSrc = this.assetUrl + config[bgType][config[bgType]["workspace"]] + workspaceBG.get("src");
            }
            if (bgType === "BG")
                stateToUpdate.type = "BG";

        }


        stateToUpdate.cropSelectionBox = { 
            x: selectionX, 
            y: selectionY, 
            width: selectionWidth, 
            height: selectionHeight, 
            angle: angle 
        };

        stateToUpdate.cropBox = { 
            x: cropX, 
            y: cropY, 
            width: cropWidth, 
            height: cropHeight 
        };

        stateToUpdate.cropImage = { 
            x: cropImageX, 
            y: cropImageY, 
            width: selectionWidth, 
            height: selectionHeight 
        };

        stateToUpdate.unCroppedBox = { 
            x: unCroppedX, 
            y: unCroppedY, 
            width: selectionWidth, 
            height: selectionHeight 
        };

        stateToUpdate.image = imgSrc;

        this.setState(stateToUpdate);

    }

    updateCropToolBar() {

        var stageLeft = document.getElementsByClassName("app-lib-container")[0].offsetWidth + 10;

        if (document.getElementsByClassName("lib-showBlock").length > 0)
            stageLeft += document.getElementsByClassName("lib-showBlock")[0].offsetWidth;

        var stageTop = document.getElementsByClassName("app-menu")[0].offsetHeight + 25;
        var stageBottom = document.getElementsByClassName("player-control-container")[0].offsetTop - 25;
        var stageRight = document.documentElement.clientWidth - 10;

        let bounds = document.getElementsByClassName("unCroppedBox")[0].getBoundingClientRect();

        let toolBarX = bounds.x, toolBarY = (bounds.y), toolBar = document.getElementById("crop-handle-bar");
        if (toolBarX < stageLeft)
            toolBarX = stageLeft;

        if ((bounds.x + toolBar.offsetWidth) > stageRight)
            toolBarX = stageRight - toolBar.offsetWidth;

        if (toolBarY < stageTop) {

            toolBarY = (bounds.y + bounds.height + 42);//headerOffset - workspaceTop + 36;

            if (toolBarY > window.screen.height - stageBottom)
                toolBarY = stageTop + 42;
        }

        // let selectionBoxBounds = document.getElementsByClassName("unCroppedBox")[0].getBoundingClientRect();
        let getWorkspaceBounds = this.getWorkspaceBounds();
        let toolX = toolBarX - getWorkspaceBounds.x, toolY = toolBarY - getWorkspaceBounds.y;
        if (!this.props.isBgCropping) {
            document.getElementById("crop-handle-bar").style.left = toolX + "px";
            document.getElementById("crop-handle-bar").style.top = toolY - 60 + "px";
        }
        document.getElementById("crop-handle-bar").style.display = "block";
    }

    componentDidMount() {
        axios({
            method: 'GET',
            url: "/images/SVGs/Test.svg",
        }).then((response) => {

            this.setState({ 
                svgElement: <div dangerouslySetInnerHTML={{__html: response.data}}></div>
            })

        })
    }

    getWorkspaceBounds() {
        let workspace = document.getElementById('workspace');
        return { 
            x: workspace.offsetLeft, 
            y: workspace.offsetTop, 
            width: workspace.offsetWidth, 
            height: workspace.offsetHeight 
        };
    }

    setCursor(e, action) {

        // if(!this.selectionBox.get("transforming")){
        var cursor = "";
        // let task = this.getTransformTask(e);
        if (action === "move") {
            document.getElementById('workspace').style.cursor = 'url(/assets/icons/move.png) 12 12, auto';
        }
        else if (action === "resize" || action === "rotate") {
            var workspace_bounds = this.getWorkspaceBounds(), handle = e.target.getAttribute('data-handle'), x = e.pageX - workspace_bounds.x, y = e.pageY - workspace_bounds.y,
                cx = this.state.cropSelectionBox.x + (this.state.cropSelectionBox.width / 2) * this.props.zoomFactor,
                cy = this.state.cropSelectionBox.y + (this.state.cropSelectionBox.height / 2) * this.props.zoomFactor, dx = Math.abs(x - cx), dy = Math.abs(y - cy), angle = Math.abs(this.state.cropSelectionBox.angle);

            let closeX = dx < dy;
            let quarter = (x < cx && y < cy) ? 1 : (x > cx && y < cy) ? 2 : (x > cx && y > cy) ? 3 : 4;
            if (angle > 180)
                angle = angle % 180;
            let sloped = (angle >= 22.5 && angle <= 67.5) || (angle >= 122.5 && angle <= 150);

            var handle_for = "scale";
            if (action === "rotate")
                handle_for = "rotate";
            if (handle === "top-left" || handle === "top-right" || handle === "bottom-right" || handle === "bottom-left") {
                cursor = (quarter === 1) ? (sloped) ? (closeX) ? "-y-t" : "-x-l" : "-t-l" : (quarter === 2) ? (sloped) ? (closeX) ? "-y-t" : "-x-r" : "-t-r" : (quarter === 3) ? (sloped) ? (closeX) ? "-y-b" : "-x-r" : "-b-r" : (quarter === 4) ? (sloped) ? (closeX) ? "-y-b" : "-x-l" : "-b-l" : "";
                cursor = handle_for + cursor;
            }
            else if (handle === "top" || handle === "right" || handle === "bottom" || handle === "left") {
                cursor = (quarter === 2 || quarter === 4) ? (closeX) ? (sloped) ? "-t-r" : "-y-t" : (sloped) ? "-t-r" : "-x-r" : (!closeX) ? (sloped) ? "-t-l" : "-x-l" : (sloped) ? "-t-l" : "-y-b";
                cursor = "scale" + cursor;
            }

            document.getElementById('workspace').style.cursor = 'url(/assets/icons/' + cursor + '.png) 12 12, auto';
        }
        else {
            this.resetCursor(e);
        }
        // }
    }

    resetCursor(e) {
        // if (!this.selectionBox.get("transforming")){
        document.getElementById('workspace').style.cursor = 'default';
        // }
    }

    getMousePosition(e) {
        let currentX = e.clientX - document.getElementById('workspace').offsetLeft, 
            currentY = e.clientY - document.getElementById('workspace').offsetTop;
        return { 
            x: currentX, 
            y: currentY 
        };
    }

    initiateMove(e) {
        e.preventDefault();
        e.stopPropagation();
        this.lastDown = e.timeStamp;
        this.moved = false;
        let mouse_position = this.getMousePosition(e);
        this.mouseStartPosition = Object.assign(this.mouseStartPosition, { x: mouse_position.x, y: mouse_position.y });
        let unCroppedBox = { ...this.state.unCroppedBox };
        this.setState({
            unCroppedBox: Object.assign(unCroppedBox, { transforming: true })
        });
        window.addEventListener('mousemove', this.moveSelection, false);
        window.addEventListener('mouseup', this.stopMove, false);
    }

    getUnCroppedXY(e) {
        let mouse_position = this.getMousePosition(e);
        let x = this.state.unCroppedBox.x - ((this.mouseStartPosition.x - mouse_position.x) / this.props.zoomFactor);
        let y = this.state.unCroppedBox.y - ((this.mouseStartPosition.y - mouse_position.y) / this.props.zoomFactor);

        if (x >= this.state.cropBox.x && this.props.isCropping)
            x = this.state.cropBox.x;
        if (y >= this.state.cropBox.y && this.props.isCropping)
            y = this.state.cropBox.y;
        if ((x + this.state.unCroppedBox.width) <= (this.state.cropBox.x + this.state.cropBox.width) && (this.props.isCropping))
            x = (this.state.cropBox.x + this.state.cropBox.width) - this.state.unCroppedBox.width;
        if ((y + this.state.unCroppedBox.height) <= (this.state.cropBox.y + this.state.cropBox.height) && this.props.isCropping)
            y = (this.state.cropBox.y + this.state.cropBox.height) - this.state.unCroppedBox.height;

        if (x >= this.state.cropBox.x + this.state.cropBox.width) {
            x = this.state.cropBox.x + this.state.cropBox.width;
        }
        if ((x + this.state.unCroppedBox.width) <= this.state.cropBox.x) {
            x = this.state.cropBox.x - this.state.unCroppedBox.width;
        }
        if (y >= this.state.cropBox.y + this.state.cropBox.height) {
            y = this.state.cropBox.y + this.state.cropBox.height;
        }
        if ((y + this.state.unCroppedBox.height) <= this.state.cropBox.y) {
            y = this.state.cropBox.y - this.state.unCroppedBox.height;
        }
        return { x: x, y: y };
    }

    moveSelection(e) {
        if (this.lastDown + 10 < e.timeStamp) {
            if (!this.moved)
                this.moved = true;
            e.preventDefault();
            let XY = this.getUnCroppedXY(e);
            this.unCroppedBoxElement.style.transform = "translate(" + XY.x * this.props.zoomFactor + "px, " + XY.y * this.props.zoomFactor + "px)";
            let flip = this.getFlipPosition();
            let angle = this.getAngle();
            if (this.state.type !== "BG")
                this.cropImageElem.style.transform = "translate(" + (this.state.cropImage.x + (XY.x - this.state.unCroppedBox.x)) * this.props.zoomFactor + "px, " + (this.state.cropImage.y + (XY.y - this.state.unCroppedBox.y)) * this.props.zoomFactor + "px) rotate(" + angle + "deg)" + flip;
            else {
                document.getElementById("crop-bg" + this.props.selectedScene + "inner").style.transform = "translate(" + (this.state.cropImage.x + (XY.x - this.state.unCroppedBox.x)) * this.props.zoomFactor + "px, " + (this.state.cropImage.y + (XY.y - this.state.unCroppedBox.y)) * this.props.zoomFactor + "px) rotate(" + angle + "deg)" + flip;
            }

            // if(document.querySelector(".unCroppedBox-wrapper")){
            //   updateTourArea()
            // }
        }
    }

    stopMove(e) {

        e.preventDefault();
        e.stopPropagation();
        let unCroppedBox = { ...this.state.unCroppedBox };
        let cropImage = { ...this.state.cropImage };
        if (this.moved) {
            let XY = this.getUnCroppedXY(e);
            cropImage = Object.assign(cropImage, { x: (this.state.cropImage.x + (XY.x - this.state.unCroppedBox.x)), y: (this.state.cropImage.y + (XY.y - this.state.unCroppedBox.y)) });
            unCroppedBox = Object.assign(unCroppedBox, { x: XY.x, y: XY.y });
        }
        unCroppedBox.transforming = false;

        this.setState({
            unCroppedBox: unCroppedBox,
            cropImage: cropImage
        });
        // this.updateCropToolBar();
        window.removeEventListener('mousemove', this.moveSelection, false);
        window.removeEventListener('mouseup', this.stopMove, false);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.unCroppedBox.transforming !== this.state.unCroppedBox.transforming) {
            if (document.querySelector(".unCroppedBox-wrapper")) {
                // this.props.updateTourArea();
            }
        }
    }

    getCropBoxPosition(e) {
        let mouse_position = this.getMousePosition(e);

        let dx = (mouse_position.x - this.mouseStartPosition.x) / this.props.zoomFactor, 
            dy = (mouse_position.y - this.mouseStartPosition.y) / this.props.zoomFactor;
        let cropX, cropY, cropWidth, cropHeight;

        if (this.state.cropBox.handle === "top-left") {
            cropX = this.state.cropBox.x + dx;
            cropY = this.state.cropBox.y + dy;
            cropWidth = this.state.cropBox.width - dx;
            cropHeight = this.state.cropBox.height - dy;
        }
        else if (this.state.cropBox.handle === "top-right") {
            cropX = this.state.cropBox.x;
            cropY = this.state.cropBox.y + dy;
            cropWidth = this.state.cropBox.width + dx;
            cropHeight = this.state.cropBox.height - dy;
        }
        else if (this.state.cropBox.handle === "bottom-right") {
            cropX = this.state.cropBox.x;
            cropY = this.state.cropBox.y;
            cropWidth = this.state.cropBox.width + dx;
            cropHeight = this.state.cropBox.height + dy;
        }
        else if (this.state.cropBox.handle === "bottom-left") {
            cropX = this.state.cropBox.x + dx;
            cropY = this.state.cropBox.y;
            cropWidth = this.state.cropBox.width - dx;
            cropHeight = this.state.cropBox.height + dy;
        }
        else if (this.state.cropBox.handle === "left") {
            cropX = this.state.cropBox.x + dx;
            cropWidth = this.state.cropBox.width - dx;
            cropY = this.state.cropBox.y;
            cropHeight = this.state.cropBox.height;
        }
        else if (this.state.cropBox.handle === "top") {
            cropX = this.state.cropBox.x;
            cropY = this.state.cropBox.y + dy;
            cropWidth = this.state.cropBox.width;
            cropHeight = this.state.cropBox.height - dy;
        }
        else if (this.state.cropBox.handle === "right") {
            cropX = this.state.cropBox.x;
            cropY = this.state.cropBox.y;
            cropWidth = this.state.cropBox.width + dx;
            cropHeight = this.state.cropBox.height;
        }
        else if (this.state.cropBox.handle === "bottom") {
            cropX = this.state.cropBox.x;
            cropY = this.state.cropBox.y;
            cropWidth = this.state.cropBox.width;
            cropHeight = this.state.cropBox.height + dy;
        }

        if (cropX <= this.state.unCroppedBox.x) {
            cropWidth -= this.state.unCroppedBox.x - cropX;
            cropX = this.state.unCroppedBox.x;
        }
        if (cropY <= this.state.unCroppedBox.y) {
            cropHeight -= this.state.unCroppedBox.y - cropY;
            cropY = this.state.unCroppedBox.y;
        }

        if (((cropX + cropWidth - this.state.unCroppedBox.width) >= this.state.unCroppedBox.x)) {
            cropWidth -= (cropX + cropWidth - this.state.unCroppedBox.width) - this.state.unCroppedBox.x;
        }

        if ((cropY + cropHeight - this.state.unCroppedBox.height) >= this.state.unCroppedBox.y) {
            cropHeight -= (cropY + cropHeight - this.state.unCroppedBox.height) - this.state.unCroppedBox.y;
        }

        if (cropWidth < 50) {
            if (!this.xLocked)
                this.lockedX = cropX;
            cropX -= cropX - this.lockedX;
            this.xLocked = true;
            cropWidth = 50;
        } else {
            if (this.xLocked)
                this.xLocked = false;
        }

        if (cropHeight < 50) {
            if (!this.yLocked)
                this.lockedY = cropY;
            cropY -= cropY - this.lockedY;
            this.yLocked = true;
            cropHeight = 50;
        } else {
            if (this.yLocked)
                this.yLocked = false;
        }

        return { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
    }

    initiateCropResize(e) {
        e.preventDefault();
        e.stopPropagation();

        let handle = e.target.getAttribute("data-handle");

        let mouse_position = this.getMousePosition(e);
        this.mouseStartPosition = Object.assign(this.mouseStartPosition, { x: mouse_position.x, y: mouse_position.y });
        let cropBox = { ...this.state.cropBox };
        this.setState({
            cropBox: Object.assign(cropBox, { "handle": handle })
        });
        window.addEventListener('mousemove', this.resizeCropSelection, false);
        window.addEventListener('mouseup', this.stopCropResize, false);
    }

    resizeCropSelection(e) {
        e.preventDefault();
        e.stopPropagation();
        let crop = this.getCropBoxPosition(e);
        let cropBoxElement = this.cropBoxElement;
        cropBoxElement.style.transform = "translate(" + parseFloat(crop.x * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat(crop.y * this.props.zoomFactor).toFixed(2) + "px)";
        cropBoxElement.style.width = crop.width * this.props.zoomFactor + "px";
        cropBoxElement.style.height = crop.height * this.props.zoomFactor + "px";
        if (this.props.isCropping) {
            let cropHandles = this.cropHandles;
            cropHandles.style.transform = "translate(" + parseFloat(crop.x * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat(crop.y * this.props.zoomFactor).toFixed(2) + "px)";
            cropHandles.style.width = crop.width * this.props.zoomFactor + "px";
            cropHandles.style.height = crop.height * this.props.zoomFactor + "px";
        }
        let flip = this.getFlipPosition();
        let angle = this.getAngle();
        if (this.state.type !== "BG")
            this.cropImageElem.style.transform = "translate(" + parseFloat((this.state.cropImage.x - (crop.x - this.state.cropBox.x)) * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat((this.state.cropImage.y - (crop.y - this.state.cropBox.y)) * this.props.zoomFactor).toFixed(2) + "px) rotate(" + angle + "deg)" + flip;
        else {
            document.getElementById("crop-bg" + this.props.selectedScene + "inner").style.transform = "translate(" + parseFloat((this.state.cropImage.x - (crop.x - this.state.cropBox.x)) * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat((this.state.cropImage.y - (crop.y - this.state.cropBox.y)) * this.props.zoomFactor).toFixed(2) + "px) rotate(" + angle + "deg)" + flip;
        }
    }

    stopCropResize(e) {
        e.preventDefault();
        e.stopPropagation();
        let crop = this.getCropBoxPosition(e);

        let cropImage = { ...this.state.cropImage };
        let cropBox = { ...this.state.cropBox };

        cropImage = Object.assign(cropImage, { x: (this.state.cropImage.x - (crop.x - this.state.cropBox.x)), y: (this.state.cropImage.y - (crop.y - this.state.cropBox.y)) });
        cropBox = Object.assign(cropBox, { x: crop.x, y: crop.y, width: crop.width, height: crop.height });

        this.setState({
            cropImage: cropImage,
            cropBox: cropBox
        });

        window.removeEventListener('mousemove', this.resizeCropSelection, false);
        window.removeEventListener('mouseup', this.stopCropResize, false);
    }

    getUnCroppedResizePosition(e) {
        let mouse_position = this.getMousePosition(e);

        let mouseX = this.state.unCroppedBox.x - (this.mouseStartPosition.x - mouse_position.x), mouseY = this.state.unCroppedBox.x - (this.mouseStartPosition.y - mouse_position.y);

        let unCropX, unCropY, unCropWidth, unCropHeight;

        if (this.state.unCroppedBox.handle === "top-left") {
            unCropWidth = this.state.unCroppedBox.width - (mouseX - this.state.unCroppedBox.x);
            unCropHeight = this.state.unCroppedBox.height - (mouseY - this.state.unCroppedBox.y);
            unCropX = mouseX;
            unCropY = mouseY - ((unCropWidth / this.state.unCroppedBox.width * this.state.unCroppedBox.height) - unCropHeight);
        }
        else if (this.state.unCroppedBox.handle === "top-right") {
            unCropWidth = mouseX - this.state.unCroppedBox.x + this.state.unCroppedBox.width;
            unCropHeight = this.state.unCroppedBox.height - (mouseY - this.state.unCroppedBox.y);
            unCropX = this.state.unCroppedBox.x;
            unCropY = mouseY - ((unCropWidth / this.state.unCroppedBox.width * this.state.unCroppedBox.height) - unCropHeight);
        }
        else if (this.state.unCroppedBox.handle === "bottom-right") {
            unCropWidth = mouseX - this.state.unCroppedBox.x + this.state.unCroppedBox.width;
            unCropHeight = mouseY - this.state.unCroppedBox.y + this.state.unCroppedBox.height;
            unCropX = this.state.unCroppedBox.x;
            unCropY = this.state.unCroppedBox.y;
        }
        else {
            unCropWidth = this.state.unCroppedBox.width - (mouseX - this.state.unCroppedBox.x);
            unCropHeight = mouseY - this.state.unCroppedBox.y;
            unCropX = mouseX;
            unCropY = this.state.unCroppedBox.y;
        }

        unCropHeight = unCropWidth / this.state.unCroppedBox.width * this.state.unCroppedBox.height;

        let projectType = this.props.projectType;
        if (projectType === "sqr")
            projectType = this.state.unCroppedBox.width.toFixed(2) > this.state.unCroppedBox.height.toFixed(2) ? "ver" : this.state.unCroppedBox.width.toFixed(2) < this.state.unCroppedBox.height.toFixed(2) ? "hor" : "sqr";

        let dW, dH;
        if (this.state.unCroppedBox.handle === "top-left") {
            if (this.props.isCropping) {
                if (unCropX >= this.state.cropBox.x) {
                    dW = this.state.cropBox.x - unCropX;
                    unCropWidth -= dW;
                    unCropHeight -= dW / this.state.unCroppedBox.width * this.state.unCroppedBox.height;
                    unCropX = this.state.cropBox.x;
                    unCropY = this.props.workspaceBounds.get("cy") - (unCropHeight - this.state.unCroppedBox.dB) - (this.props.workspaceBounds.get("cy") - this.props.workspaceHeight / 2);
                }
            }
            if (this.props.isCropping) {
                if (unCropY >= this.state.cropBox.y) {
                    dH = this.state.cropBox.y - unCropY;
                    unCropHeight -= dH;
                    unCropY = this.state.cropBox.y;
                    unCropWidth -= dH / this.state.unCroppedBox.height * this.state.unCroppedBox.width;
                    unCropX = this.props.workspaceBounds.get("cx") - (unCropWidth - this.state.unCroppedBox.dR) - (this.props.workspaceBounds.get("cx") - this.props.workspaceWidth / 2);
                }
            }
        }
        else if (this.state.unCroppedBox.handle === "top-right") {
            if (this.props.isCropping) {
                if (this.state.cropBox.x - unCropX + this.state.cropBox.width >= unCropWidth) {
                    dW = unCropWidth - (this.state.cropBox.x - unCropX + this.state.cropBox.width);
                    unCropWidth -= dW;
                    unCropHeight -= dW / this.state.unCroppedBox.width * this.state.unCroppedBox.height;
                    unCropY = this.props.workspaceBounds.get("cy") - (unCropHeight - this.state.unCroppedBox.dB) - (this.props.workspaceBounds.get("cy") - this.props.workspaceHeight / 2);
                }
            }
            if (this.props.isCropping) {
                if (unCropY >= this.state.cropBox.y) {
                    dH = this.state.cropBox.y - unCropY;
                    unCropHeight -= dH;
                    unCropWidth -= dH / this.state.unCroppedBox.height * this.state.unCroppedBox.width;
                    unCropY = this.state.cropBox.y;
                }
            }
        }
        else if (this.state.unCroppedBox.handle === "bottom-right") {

            if (this.props.isCropping) {
                if (this.state.cropBox.x - unCropX + this.state.cropBox.width >= unCropWidth) {
                    dW = unCropWidth - (this.state.cropBox.x - unCropX + this.state.cropBox.width);
                    unCropWidth -= dW;
                    unCropHeight -= dW / this.state.unCroppedBox.width * this.state.unCroppedBox.height;
                }
            }
            if (this.props.isCropping) {
                if (this.state.cropBox.y - unCropY + this.state.cropBox.height >= unCropHeight) {
                    dH = unCropHeight - (this.state.cropBox.y - unCropY + this.state.cropBox.height);
                    unCropHeight -= dH;
                    unCropWidth -= dH / this.state.unCroppedBox.height * this.state.unCroppedBox.width;
                }
            }
        } else {
            if (this.props.isCropping) {
                if (unCropX >= this.state.cropBox.x) {
                    dW = this.state.cropBox.x - unCropX;
                    unCropWidth -= this.state.cropBox.x - unCropX;
                    unCropX = this.state.cropBox.x;
                    unCropHeight -= dW / this.state.unCroppedBox.width * this.state.unCroppedBox.height;
                }
            }
            if (this.props.isCropping) {
                if (this.state.cropBox.y - unCropY + this.state.cropBox.height >= unCropHeight) {
                    dH = unCropHeight - (this.state.cropBox.y - unCropY + this.state.cropBox.height);
                    unCropHeight -= dH;
                    unCropWidth -= dH / this.state.unCroppedBox.height * this.state.unCroppedBox.width;
                    unCropX = this.props.workspaceBounds.get("cx") - (unCropWidth - this.state.unCroppedBox.dR) - (this.props.workspaceBounds.get("cx") - this.props.workspaceWidth / 2);
                }
            }
        }

        return { x: unCropX, y: unCropY, width: unCropWidth, height: unCropHeight };
    }

    initiateResize(e) {
        e.preventDefault();
        e.stopPropagation();
        let handle = e.target.getAttribute("data-handle");
        let mouse_position = this.getMousePosition(e);
        this.mouseStartPosition = Object.assign(this.mouseStartPosition, { x: mouse_position.x, y: mouse_position.y });

        let unCroppedBox = { ...this.state.unCroppedBox };
        unCroppedBox = Object.assign(unCroppedBox, { "handle": handle, transforming: true, dR: (((this.props.workspaceBounds.get("cx") - this.props.workspaceWidth / 2) + this.state.unCroppedBox.x + this.state.unCroppedBox.width) - this.props.workspaceBounds.get("cx")), dB: (((this.props.workspaceBounds.get("cy") - this.props.workspaceHeight / 2) + this.state.unCroppedBox.y + this.state.unCroppedBox.height) - this.props.workspaceBounds.get("cy")) });

        this.setState({
            unCroppedBox: unCroppedBox
        });

        // document.getElementById("crop-handle-bar").style.display = "none";
        window.addEventListener('mousemove', this.resizeSelection, false);
        window.addEventListener('mouseup', this.stopResize, false);
    }

    resizeSelection(e) {
        e.preventDefault();
        e.stopPropagation();

        let unCrop = this.getUnCroppedResizePosition(e);

        let unCroppedBoxElement = this.unCroppedBoxElement;
        unCroppedBoxElement.style.transform = "translate(" + parseFloat(unCrop.x * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat(unCrop.y * this.props.zoomFactor).toFixed(2) + "px)";
        unCroppedBoxElement.style.width = unCrop.width * this.props.zoomFactor + "px";
        unCroppedBoxElement.style.height = unCrop.height * this.props.zoomFactor + "px";
        let flip = this.getFlipPosition();
        let angle = this.getAngle();

        let nextBtn = document.querySelector('.next_step');
        if (nextBtn) {
            nextBtn.classList.remove('disable');
        }
        if (this.state.type !== "BG") {
            this.cropImageElem.style.transform = "translate(" + (this.state.cropImage.x + (unCrop.x - this.state.unCroppedBox.x)) * this.props.zoomFactor + "px, " + (this.state.cropImage.y + (unCrop.y - this.state.unCroppedBox.y)) * this.props.zoomFactor + "px) rotate(" + angle + "deg)" + flip;
            this.cropImageElem.style.width = (this.state.cropImage.width + (unCrop.width - this.state.unCroppedBox.width)) * this.props.zoomFactor + "px";
            this.cropImageElem.style.height = (this.state.cropImage.height + (unCrop.height - this.state.unCroppedBox.height)) * this.props.zoomFactor + "px";
        }
        else {
            document.getElementById("crop-bg" + this.props.selectedScene + "inner").style.transform = "translate(" + (this.state.cropImage.x + (unCrop.x - this.state.unCroppedBox.x)) * this.props.zoomFactor + "px, " + (this.state.cropImage.y + (unCrop.y - this.state.unCroppedBox.y)) * this.props.zoomFactor + "px) rotate(" + angle + "deg)" + flip;
            document.getElementById("crop-bg" + this.props.selectedScene + "inner").style.width = (this.state.cropImage.width + (unCrop.width - this.state.unCroppedBox.width)) * this.props.zoomFactor + "px";
            document.getElementById("crop-bg" + this.props.selectedScene + "inner").style.height = (this.state.cropImage.height + (unCrop.height - this.state.unCroppedBox.height)) * this.props.zoomFactor + "px";
        }

        // if(document.querySelector(".unCroppedBox-wrapper")){
        //   updateTourArea()
        // }
    }

    stopResize(e) {
        e.preventDefault();
        e.stopPropagation();
        let unCrop = this.getUnCroppedResizePosition(e);
        this.isLocked = false;

        let unCroppedBox = { ...this.state.unCroppedBox };
        let cropImage = { ...this.state.cropImage };
        
        cropImage = Object.assign(cropImage, { x: (this.state.cropImage.x + (unCrop.x - this.state.unCroppedBox.x)), y: (this.state.cropImage.y + (unCrop.y - this.state.unCroppedBox.y)), width: (this.state.cropImage.width + (unCrop.width - this.state.unCroppedBox.width)), height: (this.state.cropImage.height + (unCrop.height - this.state.unCroppedBox.height)) });
        
        unCroppedBox = Object.assign(unCroppedBox, { x: unCrop.x, y: unCrop.y, width: unCrop.width, height: unCrop.height, transforming: false });

        this.setState({
            unCroppedBox: unCroppedBox,
            cropImage: cropImage
        });


        // this.updateCropToolBar();
        window.removeEventListener('mousemove', this.resizeSelection, false);
        window.removeEventListener('mouseup', this.stopResize, false);
        this.resetCursor(e);
    }



    handleCropClick(e) {
        let oX = this.state.cropSelectionBox.x + this.state.unCroppedBox.x;
        let oY = this.state.cropSelectionBox.y + this.state.unCroppedBox.y;
        let oWidth = this.state.unCroppedBox.width;
        let oHeight = this.state.unCroppedBox.height;

        let cX = (this.state.cropSelectionBox.x + this.state.cropBox.x);
        let cY = (this.state.cropSelectionBox.y + this.state.cropBox.y);
        let cWidth = this.state.cropBox.width;
        let cHeight = this.state.cropBox.height;
        let cropItem = this.props.cropItem;

        let xDiff = ((oWidth - (cWidth + cX - oX))) - (oWidth - cWidth), yDiff = ((oHeight - (cHeight + cY - oY))) - (oHeight - cHeight);

        if (this.props.isCropping || this.props.isFraming) {
            if (cropItem.get("flipPosition") === 1) {
                xDiff = 0 - ((oWidth - (cWidth + cX - oX)));
            }
            else if (cropItem.get("flipPosition") === 2) {
                yDiff = 0 - ((oHeight - (cHeight + cY - oY)));
            }
            else if (cropItem.get("flipPosition") === 3) {
                xDiff = 0 - ((oWidth - (cWidth + cX - oX)));
                yDiff = 0 - ((oHeight - (cHeight + cY - oY)));
            }

            let cropData = { 
                selectedScene: this.props.selectedScene, 
                selectedItems: this.props.selectedItems, 
                original: { 
                    x: xDiff / cWidth, 
                    y: yDiff / cHeight, 
                    width: oWidth / cWidth, 
                    height: oHeight / cHeight 
                }, 
                crop: { 
                    x: cX, 
                    y: cY, 
                    width: cWidth, 
                    height: cHeight 
                }, 
                isCropping: this.props.isCropping 
            };

            this.props.cropImage(cropData, this.props.socket);

        } else {
            this.props.cropBG({ 
                selectedScene: this.props.selectedScene, 
                selectedItems: this.props.selectedItems, 
                bgScales: { 
                    x: xDiff / cWidth, 
                    y: yDiff / cHeight, 
                    width: oWidth / cWidth, 
                    height: oHeight / cHeight 
                }, 
            }, this.props.socket);

            let nextBtn = document.querySelector('.next_step');
            if (nextBtn) {
                this.props.nextBtnClicked(true);
                nextBtn.classList.remove('disable');
                nextBtn.click();
            }
        }
    }

    cancelCrop(e) {
        if (this.props.isCropping || this.isFraming)
            this.props.toggleCrop();
        else
            this.props.toggleBgCrop();

        let nextBtn = document.querySelector('.next_step');
        if (nextBtn) {
            this.props.nextBtnClicked(true);
            nextBtn.classList.remove('disable');
            nextBtn.click();
        }
    }

    getAngle() {
        // return 0;
        if ((this.props.isBgCropping) && this.props.currentSceneItems.getIn(["workspaceBG", "angle"]) !== undefined) {
            return this.props.currentSceneItems.getIn(["workspaceBG", "angle"]);
        }
        else {
            return 0;
        }
    }

    getFlipPosition() {
        if (!this.props.isBgCropping) {
            let flipValue = this.props.cropItem.get("flipPosition");
            return (flipValue === 1) ? " scaleX(-1)" : (flipValue === 2) ? " scaleY(-1)" : (flipValue === 3) ? " scaleX(-1) scaleY(-1)" : "";
        }
        else if (this.props.currentSceneItems.getIn(["workspaceBG", "flipPosition"]) !== undefined) {
            let flipValue = this.props.currentSceneItems.getIn(["workspaceBG", "flipPosition"]);
            return (flipValue === 1) ? " scaleX(-1)" : (flipValue === 2) ? " scaleY(-1)" : (flipValue === 3) ? " scaleX(-1) scaleY(-1)" : "";
        }
        else {
            return "";
        }
    }

    resetCrop() {
        var stateToUpdate = {};


        stateToUpdate.cropSelectionBox = { 
            x: this.props.cropItem.get("x"), 
            y: this.props.cropItem.get("y"), 
            width: this.props.cropItem.get("width"), 
            height: this.props.cropItem.get("height"), 
            angle: this.props.cropItem.get("angle") 
        };

        stateToUpdate.cropBox = { 
            x: 0, 
            y: 0, 
            width: this.state.cropSelectionBox.width, 
            height: this.state.cropSelectionBox.height, 
            angle: this.props.cropItem.get("angle") 
        };

        stateToUpdate.cropImage = { 
            x: 0, 
            y: 0, 
            width: this.state.cropSelectionBox.width, 
            height: this.state.cropSelectionBox.height, 
            angle: this.props.cropItem.get("angle") 
        };

        stateToUpdate.unCroppedBox = { 
            x: 0, 
            y: 0, 
            width: this.state.cropSelectionBox.width, 
            height: this.state.cropSelectionBox.height, 
            angle: this.props.cropItem.get("angle") 
        };

        this.setState(stateToUpdate);
    }



    render() {

        let flip = this.getFlipPosition();
        let selectionStyles = { 
            transform: "translate(" + parseFloat(this.state.cropSelectionBox.x * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat(this.state.cropSelectionBox.y * this.props.zoomFactor).toFixed(2) + "px) rotateZ(" + this.state.cropSelectionBox.angle + "deg)", 
            width: parseFloat(this.state.cropSelectionBox.width * this.props.zoomFactor).toFixed(2) + "px", 
            height: parseFloat(this.state.cropSelectionBox.height * this.props.zoomFactor).toFixed(2) + "px" 
        };

        let cropStyles = { 
            transform: "translate(" + parseFloat(this.state.cropBox.x * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat(this.state.cropBox.y * this.props.zoomFactor).toFixed(2) + "px)", 
            width: parseFloat(this.state.cropBox.width * this.props.zoomFactor).toFixed(2) + "px", 
            height: parseFloat(this.state.cropBox.height * this.props.zoomFactor).toFixed(2) + "px" 
        };

        let unCroppedStyle = { 
            transform: "translate(" + parseFloat(this.state.unCroppedBox.x * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat(this.state.unCroppedBox.y * this.props.zoomFactor).toFixed(2) + "px)", 
            width: parseFloat(this.state.unCroppedBox.width * this.props.zoomFactor).toFixed(2) + "px", 
            height: parseFloat(this.state.unCroppedBox.height * this.props.zoomFactor).toFixed(2) + "px" 
        };

        let unCroppedImageStyle = {};

        let cropImageStyle = { transform: "translate(" + parseFloat(this.state.cropImage.x * this.props.zoomFactor).toFixed(2) + "px, " + parseFloat(this.state.cropImage.y * this.props.zoomFactor).toFixed(2) + "px) rotate(" + this.getAngle() + "deg)" + flip, width: parseFloat(this.state.unCroppedBox.width * this.props.zoomFactor).toFixed(2) + "px", height: parseFloat(this.state.unCroppedBox.height * this.props.zoomFactor).toFixed(2) + "px" };
        let svgElement = null, filterValue = {};

        unCroppedImageStyle.transform = "rotate(" + this.getAngle() + "deg)" + flip;

        if (this.props.isFraming) {
            cropStyles.WebkitClipPath = "url(#clip-" + this.props.selectedItems.get(0) + ")";
            cropStyles.clipPath = "url(#clip-" + this.props.selectedItems.get(0) + ")";
            // svgElement = <RenderSvg id = {this.props.selectedItems.get(0)} data = {this.props.cropItem} config = {this.props.config}></RenderSvg>
        }
        let cropImgElem, unCropImgElem;

        cropImgElem   = <img alt="img" ref={(instance) => this.cropImageElem = instance} src={this.state.image} style = {cropImageStyle}/>;
        let filterId = !this.props.isBgCropping ? this.props.cropItem.get("filter") : this.props.currentSceneItems.getIn(["workspaceBG", "bgFilter"]);
        let selectedId = !this.props.isBgCropping ? this.props.selectedItems.get(0) : this.props.currentSceneItems.get("id");
        cropImgElem = <div className="crop-imgHolder tintCls" style={{ ...filterValue, overflow: "hidden" }}><div id={"crop-vignette-" + this.props.selectedScene} className="vignette"></div>
            {
                // (this.props.isBgCropping && this.props.currentSceneItems.getIn(["workspaceBG", "type"]) === "BG") ? <CustomBGRender completeWorkspaceItems={this.props.currentSceneItems} assetType="BG" proxyImg={this.assetUrl+config["BG"][config["BG"].onload] + this.props.currentSceneItems.getIn(["workspaceBG", "thumbnail"])} data_id={"crop-bg" + this.props.selectedScene} bgImgStyles = {{...cropImageStyle, filter: `url(#filter_${selectedId}_${filterId})`}}  isPlay={false} isPlayAll={false} key={"bg-crop"} src={this.assetUrl+config["BG"][config["BG"].workspace] + this.props.currentSceneItems.getIn(["workspaceBG", "src"])} colors={this.props.currentSceneItems.getIn(["workspaceBG", "bgColor"])} hasGradient={this.props.currentSceneItems.getIn(["workspaceBG", "hasGradient"])}/> :
                <img alt="cropImageElem" ref={(instance) => this.cropImageElem = instance} src={this.state.image} style = {{...cropImageStyle, filter: `url(#filter_${selectedId}_${filterId})`}}/>
            }

        </div>;
        unCropImgElem = <div className="crop-imgHolder tintCls" style={{ ...filterValue, overflow: "hidden" }}><div id={"uncrop-vignette-" + this.props.selectedScene} className="vignette"></div>
            {/* {(this.props.isBgCropping && this.props.currentSceneItems.getIn(["workspaceBG", "type"]) === "BG") ? <CustomBGRender completeWorkspaceItems={this.props.currentSceneItems} assetType="BG" proxyImg={this.assetUrl+config["BG"][config["BG"].onload] + this.props.currentSceneItems.getIn(["workspaceBG", "thumbnail"])} data_id={"uncrop-bg" + this.props.selectedScene} bgImgStyles = {{...unCroppedImageStyle, filter: `url(#filter_${selectedId}_${filterId})`}}  isPlay={false} isPlayAll={false} key={"bg-crop"} src={this.assetUrl+config["BG"][config["BG"].workspace] + this.props.currentSceneItems.getIn(["workspaceBG", "src"])} colors={this.props.currentSceneItems.getIn(["workspaceBG", "bgColor"])} hasGradient={this.props.currentSceneItems.getIn(["workspaceBG", "hasGradient"])}/> : */}
            <img alt="unCroppedImageElem" ref={(instance) => this.unCroppedImageElem = instance} src={this.state.image} style={{...unCroppedImageStyle, filter: `url(#filter_${selectedId}_${filterId})`}}/>
            {/* } */}
            <img alt="unCroppedImageElem" ref={(instance) => this.unCroppedImageElem = instance} src={this.state.image} style={unCroppedImageStyle}/>
        </div>;
        unCropImgElem = <img alt="img" ref={(instance) => this.unCroppedImageElem = instance} src={this.state.image} style={unCroppedImageStyle}/>;
        

        let top = this.props.workspaceHeight * this.props.zoomFactor + 20;

        let workspaceX = this.props.workspaceBounds.get("cx") - (this.props.workspaceWidth * this.props.zoomFactor) / 2, workspaceY = this.props.workspaceBounds.get("cy") - (this.props.workspaceHeight * this.props.zoomFactor) / 2,
            workspaceWidth = this.props.workspaceWidth * this.props.zoomFactor, workspaceHeight = this.props.workspaceHeight * this.props.zoomFactor;

        if (Math.round(workspaceHeight) > this.props.workspaceBounds.get("height")) {
            workspaceY = this.props.workspaceBounds.get("cy") - this.props.workspaceBounds.get("height") / 2;
            workspaceHeight = this.props.workspaceBounds.get("height");
        }

        if (Math.round(workspaceWidth) > this.props.workspaceBounds.get("width")) {
            workspaceX = this.props.workspaceBounds.get("cx") - this.props.workspaceBounds.get("width") / 2;
            workspaceWidth = this.props.workspaceBounds.get("width");
        }

        return (
            <React.Fragment>
                <div className="crop-workspace" style={{ position: "absolute", left: workspaceX.toFixed(2) + "px", top: workspaceY.toFixed(2) + "px", width: workspaceWidth.toFixed(2) + "px", height: workspaceHeight.toFixed(2) + "px", zIndex: 5 }}>
                    <div className="cropSelectionBox" style={selectionStyles} data-html2canvas-ignore="true">
                        <div className="cropBox" ref={(instance) => this.cropBoxElement = instance} style={cropStyles} onMouseDown={this.initiateMove.bind(this)} onMouseEnter={(e) => this.setCursor(e, "move")} onMouseLeave={(e) => this.resetCursor(e)}>
                            {cropImgElem}
                            <div className="crop-inner-box">
                            </div>
                            {/* {(this.props.isCropping)?<div className = "crop-box-handles">
                <span className = "crop-handle top-left" data-handle = "top-left" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}></span>
                <span className = "crop-handle top-right" data-handle = "top-right" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}></span>
                <span className = "crop-handle bottom-left" data-handle = "bottom-left" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}></span>
                <span className = "crop-handle bottom-right" data-handle = "bottom-right" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}></span>
              </div>:null} */}
                            {svgElement}
                        </div>
                        {(this.props.isCropping) ? <div ref={(instance) => this.cropHandles = instance} className="crop-handles" style={cropStyles}>
                            <span className="crop-handle top-left" data-handle="top-left" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}><svg data-handle="top-left" width="14" height="14"><path data-handle="top-left" d="M.75,.75 H13.25, V4, H4, V13.25, H.75z" fill="#000000" stroke="#ffffff" strokeWidth=".75"></path></svg></span>
                            <span className="crop-handle top" data-handle="top" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}><svg data-handle="top" width="14" height="5"><path data-handle="top" d="M.75,.75 H13.25, V4, H.75z" fill="#000000" stroke="#ffffff" strokeWidth=".75"></path></svg></span>
                            <span className="crop-handle top-right" data-handle="top-right" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}><svg data-handle="top-right" width="14" height="14"><path data-handle="top-right" d="M.75,.75 H13.25, V4, H4, V13.25, H.75z" fill="#000000" stroke="#ffffff" strokeWidth=".75"></path></svg></span>
                            <span className="crop-handle right" data-handle="right" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}><svg data-handle="right" width="5" height="14"><path data-handle="right" d="M.75,.75 H4, V13.25, H.75z" fill="#000000" stroke="#ffffff" strokeWidth=".75"></path></svg></span>
                            <span className="crop-handle bottom-left" data-handle="bottom-left" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}><svg data-handle="bottom-left" width="14" height="14"><path data-handle="bottom-left" d="M.75,.75 H13.25, V4, H4, V13.25, H.75z" fill="#000000" stroke="#ffffff" strokeWidth=".75"></path></svg></span>
                            <span className="crop-handle bottom" data-handle="bottom" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}><svg data-handle="bottom" width="14" height="5"><path data-handle="bottom" d="M.75,.75 H13.25, V4, H.75z" fill="#000000" stroke="#ffffff" strokeWidth=".75"></path></svg></span>
                            <span className="crop-handle bottom-right" data-handle="bottom-right" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}><svg data-handle="bottom-right" width="14" height="14"><path data-handle="bottom-right" d="M.75,.75 H13.25, V4, H4, V13.25, H.75z" fill="#000000" stroke="#ffffff" strokeWidth=".75"></path></svg></span>
                            <span className="crop-handle left" data-handle="left" onMouseDown={this.initiateCropResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.setCursor(e, "move")}><svg data-handle="left" width="5" height="14"><path data-handle="left" d="M.75,.75 H4, V13.25, H.75z" fill="#000000" stroke="#ffffff" strokeWidth=".75"></path></svg></span>
                        </div> : null}
                        <div className="unCroppedBox pre_tour_action" ref={(instance) => this.unCroppedBoxElement = instance} style={unCroppedStyle} onMouseDown={this.initiateMove.bind(this)} onMouseEnter={(e) => this.setCursor(e, "move")} onMouseLeave={(e) => this.resetCursor(e)}>
                            <div className="unCroppedBox-wrapper" style={{ position: "absolute", top: "-10px", right: "-10px", bottom: "-10px", left: "-10px", pointerEvents: "none", outline: "none", outlineOffset: 0, animation: "unset" }}></div>
                            <div className="uncrop-inner-box" style={{ width: "100%", height: "100%", position: "absolute" }} onMouseDown={this.initiateMove.bind(this)} onMouseEnter={(e) => this.setCursor(e, "move")} onMouseLeave={(e) => this.resetCursor(e)}>
                            </div>
                            <div className="uncrop-box-handles">
                                <span className="resize-handle top-left" data-handle="top-left" onMouseDown={this.initiateResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
                                <span className="resize-handle top-right" data-handle="top-right" onMouseDown={this.initiateResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
                                <span className="resize-handle bottom-right" data-handle="bottom-right" onMouseDown={this.initiateResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
                                <span className="resize-handle bottom-left" data-handle="bottom-left" onMouseDown={this.initiateResize.bind(this)} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
                            </div>
                            {this.state.svgElement}
                            {/* {unCropImgElem} */}
                        </div>
                    </div>
                    <div className="multimove-controls confirm-tool-bar" style={{ top: top + "px", position: "absolute", width: (this.props.workspaceWidth * this.props.zoomFactor) + "px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                        <div className="preview" style={{ display: "none" }}>
                            <span className="preview-text" style={{ cursor: "pointer" }} onClick={this.resetCrop}>
                                Reset
                            </span>    
                        </div>
                        <div className="confirmation" style={{ marginLeft: "auto" }}>
                            <span className="confirmation-icon pre_tour_action" onClick={this.cancelCrop.bind(this)}></span>
                            <span className="confirmation-text pre_tour_action" onClick={this.handleCropClick.bind(this)}>
                                Apply
                            </span>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
