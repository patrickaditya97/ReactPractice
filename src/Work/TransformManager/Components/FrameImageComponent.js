import React, { Component } from 'react';
import {calculateAspectRatio} from "../Helpers/FramesHelper"

class FrameImageComponent extends Component{
    
    constructor(props) {
        super(props);

        this.state = { 
            cropSelectionBox: {}, 
            unCroppedBox: {}, 
            cropBox: {}, 
            cropImage: {}, 
            image: null 
        };

        this.moveSelection = this.moveSelection.bind(this);
        this.stopMove = this.stopMove.bind(this);
        this.resizeSelection = this.resizeSelection.bind(this);
        this.stopResize = this.stopResize.bind(this);
        this.getUnCroppedXY = this.getUnCroppedXY.bind(this);
        this.getMousePosition = this.getMousePosition.bind(this);
        this.getUnCroppedResizePosition = this.getUnCroppedResizePosition.bind(this);
        this.resetCrop = this.resetCrop.bind(this);

        this.mouseStartPosition = { 
            x: null, 
            y: null, 
            offsetX: null, 
            offsetY: null 
        };

        this.cropItem = null;
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

        this.frameImage = React.createRef();
		
		this.cropItem = props.workspaceItems.get(props.selectedItems.get(0))
    }

	componentWillMount() {

		let stateToUpdate = {};
		this.cropItem = this.props.workspaceItems.get(this.props.selectedItems.get(0))
	
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
	
	
		let aspectRatio = calculateAspectRatio(this.cropItem)
	
		let frameX = (this.cropItem.get('width') * this.cropItem.getIn(['imgDetails', 'xRatio']))
		let frameY = (this.cropItem.get('height') * this.cropItem.getIn(['imgDetails', 'yRatio']))
		let frameWidth = (this.cropItem.get('width') * this.cropItem.getIn(['imgDetails', 'widthRatio']))
		let frameHeight = (this.cropItem.get('height') * this.cropItem.getIn(['imgDetails', 'heightRatio']))
		
		selectionX = (this.cropItem.get("x") + this.cropItem.getIn(["original", "x"]) * this.cropItem.get("width"));
		selectionY = (this.cropItem.get("y") + this.cropItem.getIn(["original", "y"]) * this.cropItem.get("height"));
	
		selectionWidth = this.cropItem.getIn(["original", "width"]) * this.cropItem.get("width")
		selectionHeight = this.cropItem.getIn(["original", "height"]) * this.cropItem.get("height")
	
		cropWidth = frameWidth;
		cropHeight = frameHeight;
		cropX = ((this.cropItem.get("x")  - selectionX) + frameX)//((this.cropItem.get("x")) * this.cropItem.getIn(['imgDetails', 'xRatio']));
		cropY = ((this.cropItem.get("y")  - selectionY) + frameY) //((this.cropItem.get("y")) * this.cropItem.getIn(['imgDetails', 'yRatio']));
		
		// let frameWidth = aspectRatio.width
		// let frameheight = aspectRatio.height
	
		// let frameX = aspectRatio.X
		// let frameY = aspectRatio.Y
	
		// selectionX 		= (this.cropItem.get("x") + this.cropItem.getIn(["original", "x"]) * this.cropItem.get("width")) + frameX;
		// selectionY 		= (this.cropItem.get("y") + this.cropItem.getIn(["original", "y"]) * this.cropItem.get("height") )+ frameY;
	
		// selectionWidth 	= frameWidth
		// selectionHeight = frameheight
	
		// cropWidth 	= this.cropItem.getIn(['frameDetails', 'clipWidth']);
		// cropHeight 	= this.cropItem.getIn(['frameDetails', 'clipHeight']);
		// cropX 		= (this.cropItem.get("x")) * this.cropItem.getIn(["original", "x"]) * this.cropItem.getIn(['imgDetails', 'xRatio']);
		// cropY 		= (this.cropItem.get("y")) * this.cropItem.getIn(["original", "x"]) * this.cropItem.getIn(['imgDetails', 'yRatio']);		
	
	
	
	
	
	
	
	
	
		let dX = 0,
			dY = 0;
		// if (this.cropItem.get("flipPosition") === 1) {
		//     dX = (cropX - (selectionWidth - (cropX + cropWidth)));
		// } else if (this.cropItem.get("flipPosition") === 2) {
		//     dY = (cropY - (selectionHeight - (cropY + cropHeight)));
		// } else if (this.cropItem.get("flipPosition") === 3) {
		//     dX = (cropX - (selectionWidth - (cropX + cropWidth)));
		//     dY = (cropY - (selectionHeight - (cropY + cropHeight)));
		// }
	
	
		if (aspectRatio.type === 1) {
			cropImageX = (-1 * cropX) + dX;
			cropImageY = (-1 * cropY) + dY + aspectRatio.Y;
	
			unCroppedX = dX;
			unCroppedY = dY + aspectRatio.Y;
		} else if (aspectRatio.type === 2) {
			cropImageX = (-1 * cropX) + dX + aspectRatio.X;
			cropImageY = (-1 * cropY) + dY;
	
			unCroppedX = dX + aspectRatio.X;
			unCroppedY = dY;
		} else if (aspectRatio.type === 0) {
			cropImageX = (-1 * cropX) + dX;
			cropImageY = (-1 * cropY) + dY;
	
			unCroppedX = dX;
			unCroppedY = dY;
		}
	
		imgSrc = this.cropItem.getIn(["imgDetails", "src"]);
	
		angle = this.cropItem.get("angle");
		stateToUpdate.type = this.cropItem.get("type");
	
		
		stateToUpdate.frameX = frameX;
		stateToUpdate.frameY = frameY;

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

		var cursor = "";

		if (action === "move") {
			document.getElementById('workspace').style.cursor = 'url(/assets/icons/move.png) 12 12, auto';

		} else if (action === "resize" || action === "rotate") {
			
			var workspace_bounds = this.getWorkspaceBounds(), 
				handle = e.target.getAttribute('data-handle'), 
				x = e.pageX - workspace_bounds.x, 
				y = e.pageY - workspace_bounds.y,
				cx = this.state.cropSelectionBox.x + (this.state.cropSelectionBox.width / 2) * this.props.zoomFactor,
				cy = this.state.cropSelectionBox.y + (this.state.cropSelectionBox.height / 2) * this.props.zoomFactor, 
				dx = Math.abs(x - cx), 
				dy = Math.abs(y - cy), 
				angle = Math.abs(this.state.cropSelectionBox.angle);

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
	}

	resetCursor(e) {
		document.getElementById('workspace').style.cursor = 'default';
	}

	getMousePosition(e) {
		let currentX = e.clientX - document.getElementById('workspace').offsetLeft, 
			currentY = e.clientY - document.getElementById('workspace').offsetTop;

		return { x: currentX, y: currentY };
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

		if (x >= this.state.cropBox.x)
            x = this.state.cropBox.x;
            
		if (y >= this.state.cropBox.y)
            y = this.state.cropBox.y;
            
		if ((x + this.state.unCroppedBox.width) <= (this.state.cropBox.x + this.state.cropBox.width))
            x = (this.state.cropBox.x + this.state.cropBox.width) - this.state.unCroppedBox.width;
            
		if ((y + this.state.unCroppedBox.height) <= (this.state.cropBox.y + this.state.cropBox.height))
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
			
			// let frameX = (this.cropItem.get('width') * this.cropItem.getIn(['imgDetails', 'xRatio']))
			// let frameY = (this.cropItem.get('height') * this.cropItem.getIn(['imgDetails', 'yRatio']))

			let unCroppedX = (XY.x * this.props.zoomFactor)
			let unCroppedY = (XY.y * this.props.zoomFactor)
			
            this.unCroppedBoxElement.style.transform = "translate(" + unCroppedX + "px, " + unCroppedY + "px)";
            
			let flip = this.getFlipPosition();
			let angle = this.getAngle();
			
			
			let croppedX = (this.state.cropImage.x + (XY.x - this.state.unCroppedBox.x)) * this.props.zoomFactor
			let croppedY = (this.state.cropImage.y + (XY.y - this.state.unCroppedBox.y)) * this.props.zoomFactor
			
			this.cropImageElem.style.transform = "translate(" + croppedX + "px, " + croppedY + "px) rotate(" + angle + "deg)" + flip;
		}
	}

	stopMove(e) {

		e.preventDefault();
		e.stopPropagation();
		let unCroppedBox = { ...this.state.unCroppedBox };
		let cropImage = { ...this.state.cropImage };
		if (this.moved) {

			let XY = this.getUnCroppedXY(e);
			
			cropImage = Object.assign(cropImage, { 
										x: (this.state.cropImage.x + (XY.x - this.state.unCroppedBox.x)), 
										y: (this.state.cropImage.y + (XY.y - this.state.unCroppedBox.y)) 
									});

			unCroppedBox = Object.assign(unCroppedBox, { 
											x: XY.x, 
											y: XY.y 
										});
		}
		unCroppedBox.transforming = false;

		this.setState({
			unCroppedBox: unCroppedBox,
			cropImage: cropImage
		});
		window.removeEventListener('mousemove', this.moveSelection, false);
		window.removeEventListener('mouseup', this.stopMove, false);
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

	getUnCroppedResizePosition(e) {
		let mouse_position = this.getMousePosition(e);

		let mouseX = this.state.unCroppedBox.x - (this.mouseStartPosition.x - mouse_position.x), 
			mouseY = this.state.unCroppedBox.x - (this.mouseStartPosition.y - mouse_position.y);

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


		let dW

		if (this.state.unCroppedBox.handle === "top-left") {
			if (unCropX >= this.state.cropBox.x) {
				dW = this.state.cropBox.x - unCropX;
				unCropWidth -= dW;
				unCropHeight -= dW / this.state.unCroppedBox.width * this.state.unCroppedBox.height;
				unCropX = this.state.cropBox.x;
				unCropY = this.props.workspaceBounds.get("cy") - (unCropHeight - this.state.unCroppedBox.dB) - (this.props.workspaceBounds.get("cy") - this.props.workspaceHeight / 2);
			}
		}
		else if (this.state.unCroppedBox.handle === "top-right") {
			if (this.state.cropBox.x - unCropX + this.state.cropBox.width >= unCropWidth) {
				dW = unCropWidth - (this.state.cropBox.x - unCropX + this.state.cropBox.width);
				unCropWidth -= dW;
				unCropHeight -= dW / this.state.unCroppedBox.width * this.state.unCroppedBox.height;
				unCropY = this.props.workspaceBounds.get("cy") - (unCropHeight - this.state.unCroppedBox.dB) - (this.props.workspaceBounds.get("cy") - this.props.workspaceHeight / 2);
			}
		}
		else if (this.state.unCroppedBox.handle === "bottom-right") {
			if (this.state.cropBox.x - unCropX + this.state.cropBox.width >= unCropWidth) {
				dW = unCropWidth - (this.state.cropBox.x - unCropX + this.state.cropBox.width);
				unCropWidth -= dW;
				unCropHeight -= dW / this.state.unCroppedBox.width * this.state.unCroppedBox.height;
			}
		}
		else {
			if (unCropX >= this.state.cropBox.x) {
				dW = this.state.cropBox.x - unCropX;
				unCropWidth -= this.state.cropBox.x - unCropX;
				unCropX = this.state.cropBox.x;
				unCropHeight -= dW / this.state.unCroppedBox.width * this.state.unCroppedBox.height;
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
		unCroppedBox = Object.assign(unCroppedBox, { 
                            "handle": handle, 
                            transforming: true, 
                            dR: (((this.props.workspaceBounds.get("cx") - this.props.workspaceWidth / 2) + this.state.unCroppedBox.x + this.state.unCroppedBox.width) - this.props.workspaceBounds.get("cx")), 
                            dB: (((this.props.workspaceBounds.get("cy") - this.props.workspaceHeight / 2) + this.state.unCroppedBox.y + this.state.unCroppedBox.height) - this.props.workspaceBounds.get("cy")) 
                        });

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

		unCroppedBoxElement.style.transform = `translate(${parseFloat(unCrop.x * this.props.zoomFactor).toFixed(2)}px, ${parseFloat(unCrop.y * this.props.zoomFactor).toFixed(2)}px)`;

		unCroppedBoxElement.style.width = unCrop.width * this.props.zoomFactor + "px";
		unCroppedBoxElement.style.height = unCrop.height * this.props.zoomFactor + "px";

		let flip = this.getFlipPosition();
		let angle = this.getAngle();
		
		this.cropImageElem.style.transform = `translate(${(this.state.cropImage.x + (unCrop.x - this.state.unCroppedBox.x)) * this.props.zoomFactor}px, ${(this.state.cropImage.y + (unCrop.y - this.state.unCroppedBox.y)) * this.props.zoomFactor}px) rotate(${angle}deg) ${flip}`;

		this.cropImageElem.style.width = `${(this.state.cropImage.width + (unCrop.width - this.state.unCroppedBox.width)) * this.props.zoomFactor}px`;

		this.cropImageElem.style.height = `${(this.state.cropImage.height + (unCrop.height - this.state.unCroppedBox.height)) * this.props.zoomFactor}px`;

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

		let xDiff = ((oWidth - (cWidth + cX - oX))) - (oWidth - cWidth), yDiff = ((oHeight - (cHeight + cY - oY))) - (oHeight - cHeight);

		if (this.cropItem.get("flipPosition") === 1) {
			xDiff = 0 - ((oWidth - (cWidth + cX - oX)));
		}
		else if (this.cropItem.get("flipPosition") === 2) {
			yDiff = 0 - ((oHeight - (cHeight + cY - oY)));
		}
		else if (this.cropItem.get("flipPosition") === 3) {
			xDiff = 0 - ((oWidth - (cWidth + cX - oX)));
			yDiff = 0 - ((oHeight - (cHeight + cY - oY)));
		}

		let cropData = {
			selectedItems: this.props.selectedItems, 
			original: { 
				x: (this.state.cropImage.x + this.state.frameX) / this.cropItem.get("width"), 
				y: (this.state.cropImage.y + this.state.frameY) / this.cropItem.get("height"), 
				width: this.state.cropImage.width / this.cropItem.get("width"), 
				height: this.state.cropImage.height / this.cropItem.get("height")
			}, 
			crop: { 
				x: cX, 
				y: cY, 
				width: cWidth, 
				height: cHeight 
			}, 
		};

		this.props.cropImage(cropData, this.props.socket);
	}

	cancelCrop(e) {
		// if (this.isFraming)
			this.props.toggleCrop();

	}

	getAngle() {
		return 0;
	}

	getFlipPosition() {
		return "";
	}

	resetCrop() {
		var stateToUpdate = {};

		stateToUpdate.cropSelectionBox = { 
            x: this.cropItem.get("x"), 
            y: this.cropItem.get("y"), 
            width: this.cropItem.get("width"), 
            height: this.cropItem.get("height"), 
            angle: this.cropItem.get("angle") 
        };

		stateToUpdate.cropBox = { 
            x: 0, 
            y: 0, 
            width: this.state.cropSelectionBox.width, 
            height: this.state.cropSelectionBox.height, 
            angle: this.cropItem.get("angle") 
        };

		stateToUpdate.cropImage = { 
            x: 0, 
            y: 0, 
            width: this.state.cropSelectionBox.width, 
            height: this.state.cropSelectionBox.height, 
            angle: this.cropItem.get("angle") 
        };

		stateToUpdate.unCroppedBox = { 
            x: 0, 
            y: 0, 
            width: this.state.cropSelectionBox.width, 
            height: this.state.cropSelectionBox.height, 
            angle: this.cropItem.get("angle") 
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
            width:  parseFloat(this.state.unCroppedBox.width * this.props.zoomFactor).toFixed(2) + "px",
            height: parseFloat(this.state.unCroppedBox.height * this.props.zoomFactor).toFixed(2) + "px"
        };

        let unCroppedImageStyle = {};

        let cropImageStyle = {

            transform: `translate(${parseFloat(this.state.cropImage.x * this.props.zoomFactor).toFixed(2)}px, ${parseFloat(this.state.cropImage.y * this.props.zoomFactor).toFixed(2)}px) rotate(${this.getAngle()}deg) ${flip}`,
            width: 	`${parseFloat(this.state.unCroppedBox.width  * this.props.zoomFactor).toFixed(2)}px`,
            height: `${parseFloat(this.state.unCroppedBox.height * this.props.zoomFactor).toFixed(2)}px`

        };

        let filterValue = {};

        unCroppedImageStyle.transform = "rotate(" + this.getAngle() + "deg)" + flip;

        let cropImgElem, unCropImgElem;

        let filterId = this.cropItem.get("filter")

        let selectedId = this.props.selectedItems.get(0)
		
        cropImgElem = (
            <div className="crop-imgHolder tintCls" style={{ ...filterValue, overflow: "hidden", }}>
                <div id={"crop-vignette-" + this.props.selectedScene} className="vignette"></div>
                <img alt="cropImageElem" ref={(instance) => this.cropImageElem = instance} src={this.state.image} style={{ ...cropImageStyle, filter: `url(#filter_${selectedId}_${filterId})` }} />
            </div>
        )

        unCropImgElem = (
            <div className="crop-imgHolder tintCls" style={{ ...filterValue, overflow: "hidden" }}>
                <div id={"uncrop-vignette-" + this.props.selectedScene} className="vignette"></div>
                <img alt="unCroppedImageElem" ref={(instance) => this.unCroppedImageElem = instance} src={this.state.image} style={{ ...unCroppedImageStyle, filter: `url(#filter_${selectedId}_${filterId})` }} />
            </div>
        )


        let top = this.props.workspaceHeight * this.props.zoomFactor + 20;

        let workspaceX = this.props.workspaceBounds.get("cx") - (this.props.workspaceWidth * this.props.zoomFactor) / 2,   
            workspaceY = this.props.workspaceBounds.get("cy") - (this.props.workspaceHeight * this.props.zoomFactor) / 2,
            workspaceWidth = this.props.workspaceWidth * this.props.zoomFactor, 
            workspaceHeight = this.props.workspaceHeight * this.props.zoomFactor;

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
                <div className="crop-workspace" style={{ position: "absolute", left: workspaceX.toFixed(2) + "px", top: (workspaceY.toFixed(2)) + "px", width: workspaceWidth.toFixed(2) + "px", height: workspaceHeight.toFixed(2) + "px", zIndex: 5 }}>
                    
					<div className="cropSelectionBox" style={selectionStyles} data-html2canvas-ignore="true">
                        <div className="cropBox" ref={(instance) => this.cropBoxElement = instance} style={cropStyles} onMouseDown={this.initiateMove.bind(this)} onMouseEnter={(e) => this.setCursor(e, "move")} onMouseLeave={(e) => this.resetCursor(e)}>
                            {cropImgElem}
                            <div className="crop-inner-box">
                            </div>
                        </div>

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

                            {unCropImgElem}

                        </div>
                    </div>


                    <div className="multimove-controls confirm-tool-bar" style={{ top: top + "px", position: "absolute", width: (this.props.workspaceWidth * this.props.zoomFactor) + "px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                        
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

export default FrameImageComponent