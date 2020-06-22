import React, { Component } from 'react';
import { Map, fromJS } from 'immutable';

class TransformManagerComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			prevSelectedObjects: {},
		}

		this.selectionBox = {};
		this.keyPressUpdate = {};
		this.initialSelectionBox = {};
		this.selectedItems = Map({});
		this.groupedItems = Map({});
		this.mouseStartPosition = {};
		this.currentItemContainer = "workspaceItems";
		this.anchorScales = null;
		this.anchorAngles = null;
		this.restrictedSelectionBox = fromJS({});
		this.restrictBounds = false;
		this.lockRotate = false;
		this.multimoveId = null;
		this.snapPoints = [];
		this.xSnapPoints = [];
		this.ySnapPoints = [];
		this.widthLocked = false;
		this.lockedWidth = null;
		this.heightLocked = false;
		this.lockedHeight = null;
		this.cornerResize = this.props.cornerResize;
		// this.appUrl                  = config['APPICONS'][config['APPICONS']['current']];
		this.transformingTimer = null;
		this.transformTimeout = 500;
		this.rotateCount = 0;

		this.initiateMove            = this.initiateMove.bind(this);
		this.moveSelection           = this.moveSelection.bind(this);
		this.stopMove                = this.stopMove.bind(this);
		this.moveItem                = this.moveItem.bind(this);
		this.initiateResize          = this.initiateResize.bind(this);
		this.resizeSelection         = this.resizeSelection.bind(this);
		this.stopResize              = this.stopResize.bind(this);
		this.getResizePosition       = this.getResizePosition.bind(this);
		this.initiateRotate          = this.initiateRotate.bind(this);
		this.rotateSelection         = this.rotateSelection.bind(this);
		this.stopRotate              = this.stopRotate.bind(this);
	}

	static getDerivedStateFromProps(props, state) {

		if (props.selectedObjects !== state.prevSelectedObjects) {
			// this.selectedItems = props.selectedObjects;
			return {
				selectedObjects: props.selectedObjects,
				prevSelectedObjects: state.selectedObjects,
				selectedItems: props.selectedItems,
				prevSelectedItems: state.selectedItems,
			};
		}
		else
			return null;
	}

	setItemPositions(item) {
		let scx = this.selectionBox.cx,
			scy = this.selectionBox.cy,
			icx = (item.get("x") / this.props.zoomFactor) + (item.get("width") / this.props.zoomFactor) / 2,
			icy = (item.get("y") / this.props.zoomFactor) + (item.get("height") / this.props.zoomFactor) / 2;

		let item_angle = Math.atan2((icy * this.props.zoomFactor) - scy, (icx * this.props.zoomFactor) - scx) * (180 / Math.PI);

		let dis = Math.sqrt((Math.pow(scx - (icx * this.props.zoomFactor), 2)) + (Math.pow(scy - (icy * this.props.zoomFactor), 2)));

		let itemToMerge = Map({ "angle_to_center": item_angle, "dis_to_center": dis });

		if (item.get("type") === "GROUP") {
			let groupedCX = item.get("x") + item.get("width") / 2,
				groupedCY = item.get("y") + item.get("height") / 2;

			var groupItems = this.props.selectedChildren;

			item.get("groupChildren").entrySeq().forEach(([childKey, itemId]) => {

				let child = groupItems.get(itemId);
				let groupedItemCX = child.get("x") + child.get("width") / 2,
					groupedItemCY = child.get("y") + child.get("height") / 2;

				let childAngle = Math.atan2(groupedItemCY - groupedCY, groupedItemCX - groupedCX) * (180 / Math.PI) - item.get("angle");
				let childDis = Math.sqrt((Math.pow(groupedCX - groupedItemCX, 2)) + (Math.pow(groupedCY - groupedItemCY, 2)));
				let childToMerge = Map({ "angle_to_center": childAngle, "dis_to_center": childDis });

				this.groupedItems = this.groupedItems.set(itemId, child.merge(childToMerge));

			})
		}
		return item.merge(itemToMerge);
	}

	getCorner(pivotX, pivotY, cornerX, cornerY, angle) {
		var x, y, distance, diffX, diffY;

		/// get distance from center to point
		diffX = cornerX - pivotX;
		diffY = cornerY - pivotY;
		distance = Math.sqrt(diffX * diffX + diffY * diffY);

		/// find angle from pivot to corner
		angle += Math.atan2(diffY, diffX);

		/// get new x and y and round it off to integer
		x = pivotX + distance * Math.cos(angle);
		y = pivotY + distance * Math.sin(angle);

		return { x: x, y: y };
	}

	getSelectionBoxBounds(data) {
		var angle = data.angle * Math.PI / 180
		var c1, c2, c3, c4,    /// corners
			bx1, by1, bx2, by2,
			bounds;

		c1 = this.getCorner(data.cx, data.cy, data.x, data.y, angle);
		c2 = this.getCorner(data.cx, data.cy, data.x + data.width, data.y, angle);
		c3 = this.getCorner(data.cx, data.cy, data.x + data.width, data.y + data.height, angle);
		c4 = this.getCorner(data.cx, data.cy, data.x, data.y + data.height, angle);

		/// get bounding box
		bx1 = Math.min(c1.x, c2.x, c3.x, c4.x);
		by1 = Math.min(c1.y, c2.y, c3.y, c4.y);
		bx2 = Math.max(c1.x, c2.x, c3.x, c4.x);
		by2 = Math.max(c1.y, c2.y, c3.y, c4.y);

		bounds = {
			x: parseFloat(bx1.toFixed(2)),
			y: parseFloat(by1.toFixed(2)),
			width: parseFloat((bx2 - bx1).toFixed(2)),
			height: parseFloat((by2 - by1).toFixed(2))
		};

		return bounds;
	}

	getObjectsBounds(objects) {
		var minX = 0, maxX = 0, minY = 0, maxY = 0;
		var count = 0;

		objects.entrySeq().forEach(([key, item]) => {
			let bounds, x, y, width, height;

			bounds = this.getSelectionBoxBounds({
				x: item.get("x"),
				y: item.get("y"),
				cx: item.get("x") + item.get("width") / 2,
				cy: item.get("y") + item.get("height") / 2,
				width: item.get("width"),
				height: item.get("height"),
				angle: item.get("angle")
			});

			x = bounds.x;
			y = bounds.y;
			width = bounds.width;
			height = bounds.height;

			if (count === 0) {
				minX = x;
				maxX = x + width;
				minY = y;
				maxY = y + height;

				count++;
			} else {
				minX = Math.min(minX, x);
				maxX = Math.max(maxX, x + width);
				minY = Math.min(minY, y);
				maxY = Math.max(maxY, y + height);
			}
		});

		return {
			x: minX,
			y: minY,
			width: maxX - minX,
			height: maxY - minY
		}
	}

	getSelectionBox() {

		var x = null,
			y = null,
			width = null,
			height = null,
			cx = null,
			cy = null,
			angle = 0;


		let selectedObjects = this.state.selectedObjects;
		this.selectedItems = this.state.selectedObjects;

		if (selectedObjects !== null && selectedObjects.size === 1) {

			let item = selectedObjects.first();

			x = item.get("x");
			y = item.get("y");
			width = item.get("width");
			height = item.get("height");
			angle = item.get("angle");

		} else {
			let bounds = this.getObjectsBounds(this.selectedItems);

			x = bounds.x;
			y = bounds.y;
			width = bounds.width;
			height = bounds.height;
		}

		if (x !== null)
			cx = x + (width / 2);
		if (y !== null)
			cy = y + (height / 2);
		if (angle === undefined)
			angle = 0;

		this.selectionBox = Object.assign(this.selectionBox, {
			x: x,
			y: y,
			width: width,
			height: height,
			cx: cx,
			cy: cy,
			angle: angle
		});

		this.initialSelectionBox = this.selectionBox;
		this.selectedItems = this.selectedItems.map(x => this.setItemPositions(x));
		var getAllItems = this.selectedItems;
		this.selectedItems.entrySeq().forEach(([key, single_item]) => {
			getAllItems = getAllItems.set(key, single_item.set("sAngle", single_item.get("angle") !== undefined ? single_item.get("angle") : 0));
		});
		this.selectedItems = getAllItems;

		return this.selectionBox;
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

	isTextOnly() {
		var result = false;
		// if (this.props.selectedItems.size === 1) {
		//   var itemType = this.props.selectedObjects.get(this.props.selectedItems.get(0));
		//   if (itemType !== undefined && itemType.get("type") === "TEXT" && itemType.get("subType") === "DTXT") {
		//     result = true;
		//   }
		// }
		return result;
	}

	updateInitialSelectionBox(obj) {

		this.selectionBox = Object.assign(this.selectionBox, obj);
		// this.props.updateSelectionBox(obj);
		this.initialSelectionBox = Object.assign(this.initialSelectionBox, obj);
	}

	getMousePosition(e) {
		let currentX = e.clientX - document.getElementById('workspace').offsetLeft,
			currentY = e.clientY - document.getElementById('workspace').offsetTop;

		return {
			x: currentX,
			y: currentY
		};
	}

	setCursor(e, action) {

	}

	resetCursor(e) {
		if (!this.selectionBox.transforming) {
			document.getElementById('workspace').style.cursor = 'default';
		}
	}

	isMouseOn(e, value) {
		var i;
		var path_array = e.path || (e.composedPath && e.composedPath()) || this.composedPath(e.target);
		if (path_array.length > 0) {
			for (i = 0; i < path_array.length; i++) {
				if (path_array[i].className !== undefined && typeof (path_array[i].className) !== "object") {
					if (path_array[i].className.indexOf(value) !== -1) {
						return true;
					}
				}
				else if (path_array[i].className !== undefined && typeof (path_array[i].className) === "object") {
					if (path_array[i].className.animVal === value)
						return true;
				}
			}
		}
		return false;
	}

	//Resize

	isVerticalScale() {
		var result = false;
		if (this.props.selectedItems.size === 1) {
			var item = this.props.selectedObjects.get(this.props.selectedItems.get(0));
			if (item !== undefined) {
				if (item.get("type") === "GROUP" && item.get("subType") === "TXTGRP" && !item.get("isOverlay")) {
					if (item.get("isExpands")) {

						var svgItem = this.props.selectedChildren.filter(function (obj, key) {
							return item.get("groupChildren").indexOf(key) !== -1
						}).find(x => x.get("type") === "TEXT");

						if (svgItem.get("verticalAlign") !== undefined)
							result = true;
					}

				}
				else if (item.get("type") === "SHAPE" || (item.get("type") === "TEXT")) {
					if (item.get("scaleType") === "square" || item.get("scaleType") === "vertical")
						return true;
					else
						return false;
				}
			}
		}
		return result;
	}

	isHorizontalScale() {
		var result = false;
		if (this.props.selectedItems.size === 1) {
			var item = this.props.selectedObjects.get(this.props.selectedItems.get(0));
			if (item !== undefined) {
				if (item.get("type") === "TEXT" && item.get("subType") === "DTXT") {
					result = true;
				}
				else if (item.get("type") === "GROUP" && item.get("subType") === "TXTGRP" && !item.get("isOverlay")) {
					if (item.get("isExpands")) {

						var svgItem = this.props.selectedChildren.filter(function (obj, key) { return item.get("groupChildren").indexOf(key) !== -1 }).find(x => x.get("type") === "TEXT");
						if (svgItem.get("horizontalAlign") !== undefined)
							result = true;
					}
				}
				else if (item.get("type") === "SHAPE" || (item.get("type") === "TEXT")) {

					if (item.get("scaleType") === "square" || item.get("scaleType") === "horizontal")
						return true;
					else
						return false;
				}
			}
		}
		return result;
	}

	initiateResize(e) {
		e.preventDefault();
		e.stopPropagation()

		this.scaleX = 1; this.scaleY = 1;
		let isResizeLocked = (this.lockResize !== undefined && this.lockResize) ? true : false;
		if (!isResizeLocked) {

			let handle = e.target.getAttribute("data-handle");
			if (this.isTextOnly() && (handle === "top-left" || handle === "top-right" || handle === "bottom-left" || handle === "bottom-right")) {
				this.cornerResize = true;
			}

			if (this.isTextOnly())
				this.cornerResize = false;

			var corner_x = this.selectionBox.x,
				corner_y = this.selectionBox.y,
				center_x = this.selectionBox.cx,
				center_y = this.selectionBox.cy,
				width = this.selectionBox.width,
				height = this.selectionBox.height;

			if (!this.cornerResize) {
				corner_x = corner_x + width / 2;
				corner_y = corner_y + height / 2;
			}
			else {

				if (handle === "top-right")
					corner_y = corner_y + height;
				else if (handle === "top-left") {
					corner_y = corner_y + height;
					corner_x = corner_x + width;
				}
				else if (handle === "bottom-left")
					corner_x = corner_x + width;
				else if (handle === "right") {
					corner_y = corner_y + height / 2;
				}
				else if (handle === "left") {
					corner_x = corner_x + width;
					corner_y = corner_y + height / 2;
				}
				else if (handle === "top") {
					corner_y = corner_y + height;
					corner_x = corner_x + width / 2;
				}
				else if (handle === "bottom")
					corner_x = corner_x + width / 2;
			}

			let distance = Math.sqrt((Math.pow(center_x - corner_x, 2)) + (Math.pow(center_y - corner_y, 2))),
				angle_to_center = Math.atan2(center_y - corner_y, center_x - corner_x) * (180 / Math.PI),
				angle_to_corner = Math.atan2(corner_y - center_y, corner_x - center_x) * (180 / Math.PI);

			var tempX = this.selectionBox.x - (this.selectionBox.x + this.selectionBox.width / 2);
			var tempY = this.selectionBox.y - (this.selectionBox.y + this.selectionBox.height / 2);

			// now apply rotation
			var rotatedX = tempX * Math.cos(this.selectionBox.angle * (Math.PI / 180)) - tempY * Math.sin(this.selectionBox.angle * (Math.PI / 180));
			var rotatedY = tempX * Math.sin(this.selectionBox.angle * (Math.PI / 180)) + tempY * Math.cos(this.selectionBox.angle * (Math.PI / 180));

			// translate back
			var rPx = this.selectionBox.x + (rotatedX + (this.selectionBox.width / 2));
			var rPy = this.selectionBox.y + (rotatedY + (this.selectionBox.height / 2));

			this.updateInitialSelectionBox({
				transforming: true,
				resizing: true,
				handle: handle,
				distance: distance,
				angle_to_center: angle_to_center,
				angle_to_corner: angle_to_corner,
				rotated_x: rPx,
				rotated_y: rPy
			});

			this.props.updateTransformStatus({
				transforming: true,
				resizing: true
			});

			let mouse_position = this.getMousePosition(e);
			this.mouseStartPosition = Object.assign(this.mouseStartPosition, { x: mouse_position.x, y: mouse_position.y });

			if (this.isTextOnly())
				window.addEventListener('mousemove', this.resizeTextContainer, false);
			else
				window.addEventListener('mousemove', this.resizeSelection, false);

			window.addEventListener('mouseup', this.stopResize, false);
		}
	}


	getResizePosition(e) {

		let mouse_position = this.getMousePosition(e),
			handle = this.initialSelectionBox.handle,
			angle = this.selectionBox.angle,
			dx = (mouse_position.x - this.mouseStartPosition.x) / this.props.zoomFactor,
			dy = (mouse_position.y - this.mouseStartPosition.y) / this.props.zoomFactor;

		var newX = this.initialSelectionBox.x,
			newY = this.initialSelectionBox.y,
			newWidth = this.initialSelectionBox.width,
			newHeight = this.initialSelectionBox.height;

		var prevX = this.initialSelectionBox.x,
			prevY = this.initialSelectionBox.y,
			prevWidth = this.initialSelectionBox.width,
			prevHeight = this.initialSelectionBox.height;

		var rPx = this.initialSelectionBox.rotated_x,
			rPy = this.initialSelectionBox.rotated_y;

		var adX = ((dx) * Math.cos(angle * (Math.PI / 180))) + ((dy) * Math.sin(angle * (Math.PI / 180)));
		var adY = ((dy) * Math.cos(angle * (Math.PI / 180))) - ((dx) * Math.sin(angle * (Math.PI / 180)));

		if (!this.cornerResize) {
			adX *= 2;
			adY *= 2;
		}

		var tempX, tempY, rotatedX, rotatedY, r1Px, r1Py;

		switch (handle) {

			case "top-left":
				newWidth = prevWidth - adX;
				newHeight = prevHeight - adY;
				newX = prevX + adX;
				newY = prevY + adY;

				// if (this.aspectRatio) {
				newY = newY - ((newWidth / prevWidth * prevHeight) - newHeight);
				newHeight = newWidth / prevWidth * prevHeight;
				// }

				tempX = (newX) - (newX + newWidth / 2);
				tempY = (newY) - (newY + newHeight / 2);

				if (!this.cornerResize) {
					tempX += (newWidth - prevWidth) / 2
					tempY += (newHeight - prevHeight) / 2
				}

				rotatedX = tempX * Math.cos(angle * (Math.PI / 180)) - tempY * Math.sin(angle * (Math.PI / 180));
				rotatedY = tempX * Math.sin(angle * (Math.PI / 180)) + tempY * Math.cos(angle * (Math.PI / 180));

				r1Px = (newX) + (rotatedX + (newWidth / 2));
				r1Py = (newY) + (rotatedY + (newHeight / 2));

				newX = prevX - (rPx - r1Px);
				newY = prevY - (rPy - r1Py);
				break;

			case "top":

				newHeight = prevHeight - adY;
				newY = prevY + adY;

				tempX = (newX) - (newX + newWidth / 2);
				tempY = (newY) - (newY + newHeight / 2);

				if (!this.cornerResize) {
					tempX += (newWidth - prevWidth) / 2;
					tempY += (newHeight - prevHeight) / 2
				}

				rotatedX = tempX * Math.cos(angle * (Math.PI / 180)) - tempY * Math.sin(angle * (Math.PI / 180));
				rotatedY = tempX * Math.sin(angle * (Math.PI / 180)) + tempY * Math.cos(angle * (Math.PI / 180));

				r1Px = (newX) + (rotatedX + (newWidth / 2));
				r1Py = (newY) + (rotatedY + (newHeight / 2));

				newX = prevX - (rPx - r1Px);
				newY = prevY - (rPy - r1Py);

				break;

			case "top-right":

				newWidth = prevWidth + adX;
				newHeight = prevHeight - adY;
				newY = prevY + adY;

				// if (this.aspectRatio) {
				newY = newY - ((newWidth / prevWidth * prevHeight) - newHeight)
				newHeight = newWidth / prevWidth * prevHeight;
				// }

				tempX = (newX) - (newX + newWidth / 2);
				tempY = (newY) - (newY + newHeight / 2);

				if (!this.cornerResize) {
					tempX -= (newWidth - prevWidth) / 2
					tempY += (newHeight - prevHeight) / 2
				}

				rotatedX = tempX * Math.cos(angle * (Math.PI / 180)) - tempY * Math.sin(angle * (Math.PI / 180));
				rotatedY = tempX * Math.sin(angle * (Math.PI / 180)) + tempY * Math.cos(angle * (Math.PI / 180));

				r1Px = (newX) + (rotatedX + (newWidth / 2));
				r1Py = (newY) + (rotatedY + (newHeight / 2));

				newX = prevX - (rPx - r1Px);
				newY = prevY - (rPy - r1Py);
				break;

			case "right":
				newWidth = prevWidth + adX;
				tempX = (newX) - (newX + newWidth / 2);
				tempY = (newY) - (newY + newHeight / 2);

				if (!this.cornerResize) {
					tempX += (newWidth - prevWidth) / 2
					tempY += (newHeight - prevHeight) / 2
				}

				rotatedX = tempX * Math.cos(angle * (Math.PI / 180)) - tempY * Math.sin(angle * (Math.PI / 180));
				rotatedY = tempX * Math.sin(angle * (Math.PI / 180)) + tempY * Math.cos(angle * (Math.PI / 180));

				r1Px = (newX) + (rotatedX + (newWidth / 2));
				r1Py = (newY) + (rotatedY + (newHeight / 2));

				newX = prevX - (r1Px - rPx);
				newY = prevY - (r1Py - rPy);

				break;

			case "bottom-right":
				newWidth = prevWidth + adX;
				newHeight = prevHeight + adY;
				// if (this.aspectRatio)
				newHeight = newWidth / prevWidth * prevHeight;

				tempX = (newX) - (newX + newWidth / 2);
				tempY = (newY) - (newY + newHeight / 2);

				if (!this.cornerResize) {
					tempX += (newWidth - prevWidth) / 2
					tempY += (newHeight - prevHeight) / 2
				}

				rotatedX = tempX * Math.cos(angle * (Math.PI / 180)) - tempY * Math.sin(angle * (Math.PI / 180));
				rotatedY = tempX * Math.sin(angle * (Math.PI / 180)) + tempY * Math.cos(angle * (Math.PI / 180));

				r1Px = (newX) + (rotatedX + (newWidth / 2));
				r1Py = (newY) + (rotatedY + (newHeight / 2));

				newX = prevX - (r1Px - rPx);
				newY = prevY - (r1Py - rPy);
				break;

			case "bottom":
				newHeight = prevHeight + adY;

				tempX = (newX) - (newX + newWidth / 2);
				tempY = (newY) - (newY + newHeight / 2);

				if (!this.cornerResize) {
					tempX += (newWidth - prevWidth) / 2
					tempY += (newHeight - prevHeight) / 2
				}

				rotatedX = tempX * Math.cos(angle * (Math.PI / 180)) - tempY * Math.sin(angle * (Math.PI / 180));
				rotatedY = tempX * Math.sin(angle * (Math.PI / 180)) + tempY * Math.cos(angle * (Math.PI / 180));

				r1Px = (newX) + (rotatedX + (newWidth / 2));
				r1Py = (newY) + (rotatedY + (newHeight / 2));

				newX = prevX - (r1Px - rPx);
				newY = prevY - (r1Py - rPy);
				break;

			case "bottom-left":
				newWidth = prevWidth - adX;
				newHeight = prevHeight + adY;
				newX = prevX + adX;

				// if (this.aspectRatio)
				newHeight = newWidth / prevWidth * prevHeight;

				tempX = (newX) - (newX + newWidth / 2);
				tempY = (newY) - (newY + newHeight / 2);

				if (!this.cornerResize) {
					tempX += (newWidth - prevWidth) / 2
					tempY += (newHeight - prevHeight) / 2
				}

				rotatedX = tempX * Math.cos(angle * (Math.PI / 180)) - tempY * Math.sin(angle * (Math.PI / 180));
				rotatedY = tempX * Math.sin(angle * (Math.PI / 180)) + tempY * Math.cos(angle * (Math.PI / 180));

				r1Px = (newX) + (rotatedX + (newWidth / 2));
				r1Py = (newY) + (rotatedY + (newHeight / 2));

				newX = prevX - (rPx - r1Px);
				newY = prevY - (r1Py - rPy);
				break;

			case "left":

				newWidth = prevWidth - adX;
				newX = prevX + adX;

				tempX = (newX) - (newX + newWidth / 2);
				tempY = (newY) - (newY + newHeight / 2);

				if (!this.cornerResize) {
					tempX += (newWidth - prevWidth) / 2
					tempY += (newHeight - prevHeight) / 2
				}

				rotatedX = tempX * Math.cos(angle * (Math.PI / 180)) - tempY * Math.sin(angle * (Math.PI / 180));
				rotatedY = tempX * Math.sin(angle * (Math.PI / 180)) + tempY * Math.cos(angle * (Math.PI / 180));

				r1Px = (newX) + (rotatedX + (newWidth / 2));
				r1Py = (newY) + (rotatedY + (newHeight / 2));

				newX = prevX - (rPx - r1Px);
				newY = prevY - (rPy - r1Py);
				break;

			default:
				break;

		}

		let new_cx = (newX + newWidth / 2);
		let new_cy = (newY + newHeight / 2);

		if (this.restrictBounds) {
			if (((newX + newWidth) >= this.props.workspaceWidth || newX >= this.props.workspaceWidth)) {
				let oldWidth = newWidth;
				let rX = (newX + newWidth) - this.props.workspaceWidth;
				newWidth -= rX * 2;
				new_cx = this.props.workspaceWidth - newWidth / 2;
				newHeight *= newWidth / oldWidth;
				newX = new_cx - newWidth / 2;
				newY = new_cy - newHeight / 2;
			}
			if ((newX <= 0 || newX + newWidth <= 0)) {
				let oldWidth = newWidth;
				newWidth += newX * 2;
				newHeight *= newWidth / oldWidth;
				newX = new_cx - newWidth / 2;
				newY = new_cy - newHeight / 2;
			}
			if ((newY + newHeight >= this.props.workspaceHeight || newY >= this.props.workspaceHeight)) {

				let oldHeight = newHeight;
				let rY = (newY + newHeight) - this.props.workspaceHeight;
				newHeight -= rY * 2;
				new_cy = this.props.workspaceHeight - newHeight / 2;
				newWidth *= newHeight / oldHeight;
				newX = new_cx - newWidth / 2;
				newY = new_cy - newHeight / 2;
			}
			if ((newY <= 0 || newY + newHeight <= 0)) {

				let oldHeight = newHeight;
				newHeight += newY * 2;
				newWidth *= newHeight / oldHeight;
				newX = new_cx - newWidth / 2;
				newY = new_cy - newHeight / 2;
			}
		}


		let scale_x = (newWidth / this.initialSelectionBox.width);
		let scale_y = (newHeight / this.initialSelectionBox.height);


		return {
			scale_x: scale_x,
			scale_y: scale_y,
			cx: new_cx,
			cy: new_cy
		};
	}

	resizeSelection(e) {
		e.preventDefault();
		let resize_position = this.getResizePosition(e);

		let tourNextBtn = document.querySelector('.next_step');
		if (tourNextBtn) {
			tourNextBtn.classList.remove('disable');
		}
		var scale_x = resize_position.scale_x,
			scale_y = resize_position.scale_y,
			cx = resize_position.cx,
			cy = resize_position.cy,
			new_width = Math.abs(this.initialSelectionBox.width * scale_x),
			new_height = Math.abs(this.initialSelectionBox.height * scale_y);

		// let handle = this.selectionBox.handle;

		let selectionX = parseFloat(((cx - new_width / 2) * this.props.zoomFactor).toFixed(2)),
			selectionY = parseFloat(((cy - new_height / 2) * this.props.zoomFactor).toFixed(2)),
			selectionWidth = parseFloat((new_width * this.props.zoomFactor).toFixed(2)),
			selectionHeight = parseFloat((new_height * this.props.zoomFactor).toFixed(2));

		var selectionBox = this.selectionBoxElement;
		selectionBox.style.transform = "translate(" + selectionX + "px, " + selectionY + "px) rotateZ(" + this.selectionBox.angle + "deg)";
		selectionBox.style.width = selectionWidth + "px";
		selectionBox.style.height = selectionHeight + "px";

		if (selectionWidth < 60) {
			if (document.querySelector(".resize-handle.top").className.indexOf("hide-handle") === -1) {
				document.querySelector(".resize-handle.top").classList.add("hide-handle");
			}
			if (document.querySelector(".resize-handle.bottom").className.indexOf("hide-handle") === -1) {
				document.querySelector(".resize-handle.bottom").classList.add("hide-handle");
			}
		} else {
			if (document.querySelector(".resize-handle.top").className.indexOf("hide-handle") !== -1) {
				document.querySelector(".resize-handle.top").classList.remove("hide-handle");
			}
			if (document.querySelector(".resize-handle.bottom").className.indexOf("hide-handle") !== -1) {
				document.querySelector(".resize-handle.bottom").classList.remove("hide-handle");
			}
		}

		if (selectionHeight < 60) {
			if (document.querySelector(".resize-handle.left").className.indexOf("hide-handle") === -1) {
				document.querySelector(".resize-handle.left").classList.add("hide-handle");
			}
			if (document.querySelector(".resize-handle.right").className.indexOf("hide-handle") === -1) {
				document.querySelector(".resize-handle.right").classList.add("hide-handle");
			}
		} else {
			if (document.querySelector(".resize-handle.left").className.indexOf("hide-handle") !== -1) {
				document.querySelector(".resize-handle.left").classList.remove("hide-handle");
			}
			if (document.querySelector(".resize-handle.right").className.indexOf("hide-handle") !== -1) {
				document.querySelector(".resize-handle.right").classList.remove("hide-handle");
			}
		}

		this.selectedItems.entrySeq().forEach(([key, item]) => {

			var item_width = Math.abs(item.get("width") * scale_x),
				item_height = Math.abs(item.get("height") * scale_y);

			var item_x = Math.cos((item.get("angle_to_center") + this.initialSelectionBox.angle) * Math.PI / 180) * Math.abs(item.get("dis_to_center") * scale_x) + cx - item_width / 2;
			var item_y = Math.sin((item.get("angle_to_center") + this.initialSelectionBox.angle) * Math.PI / 180) * Math.abs(item.get("dis_to_center") * scale_y) + cy - item_height / 2;

			let flipPos = item.get("flipPosition");
			let flip = (flipPos === 1) ? " scaleX(-1)" : (flipPos === 2) ? " scaleY(-1)" : (flipPos === 3) ? " scaleX(-1) scaleY(-1)" : "";

			let current_item = document.getElementById(key);

			current_item.style.transform = "translate(" + (item_x * this.props.zoomFactor).toFixed(2) + "px, " + (item_y * this.props.zoomFactor).toFixed(2) + "px) rotateZ(" + item.get("angle") + "deg)" + flip;

			current_item.style.width = item_width * this.props.zoomFactor + "px";
			current_item.style.height = item_height * this.props.zoomFactor + "px";

			let groupFontSize = null;
			let textOffset = this.props.textOffset;

			if (item.get('type') === 'FRAME') {
				current_item.getElementsByClassName("inner-frame")[0].style.transform = `scaleX(${item_width/item.get("defaultWidth")}) scaleY(${item_height/item.get("defaultHeight")})`;
			}

			if (item.get("type") === "GROUP") {

				if (item.get("subType") === "TXTGRP")
					textOffset = 0;

				item.get("groupChildren").entrySeq().forEach(([childKey, itemId]) => {
					let groupItems = this.props.selectedChildren;
					let child = groupItems.get(itemId);

					let childWidth = Math.abs(child.get("width") * scale_x), childHeight = Math.abs(child.get("height") * scale_y);
					// let groupedItem = this.groupedItems.get(itemId);
					// var childX = Math.cos((groupedItem.get("angle_to_center") + item.get("angle")) * Math.PI / 180) * Math.abs(groupedItem.get("dis_to_center") * scale_x) + (item_x + item_width / 2) - childWidth / 2;
					// var childY = Math.sin((groupedItem.get("angle_to_center") + item.get("angle")) * Math.PI / 180) * Math.abs(groupedItem.get("dis_to_center") * scale_y) + (item_y + item_height / 2) - childHeight / 2;

					let currentChildItem = document.getElementById(itemId);


					// let flipPos = child.get("flipPosition");
					// let flip = (flipPos === 1) ? " scaleX(-1)" : (flipPos === 2) ? " scaleY(-1)" : (flipPos === 3) ? " scaleX(-1) scaleY(-1)" : "";

					// let transform = "translate(" + (childX.toFixed(2) - item_x.toFixed(2)) * this.props.zoomFactor + "px, " + (childY.toFixed(2) - item_y.toFixed(2)) * this.props.zoomFactor + "px) rotateZ(" + child.get("angle") + "deg)" + flip;

					currentChildItem.style.width = childWidth * this.props.zoomFactor + "px";
					currentChildItem.style.height = childHeight * this.props.zoomFactor + "px";

					// if (child.get("type") === "TEXT" || child.get("type") === "SHAPE") {
					//     var container = document.getElementById(itemId);

					//     if (child.get("type") === "SHAPE") {
					//         container = container.getElementsByClassName("callout-text-container")[0];
					//         let xRatio = child.get("xRatio") !== undefined && child.get("xRatio") !== null ? child.get("xRatio") : 10;
					//         let yRatio = child.get("yRatio") !== undefined && child.get("yRatio") !== null ? child.get("yRatio") : 10;
					//         let widthRatio = child.get("widthRatio") !== undefined && child.get("widthRatio") !== null ? child.get("widthRatio") : 90;
					//         let heightRatio = child.get("heightRatio") !== undefined && child.get("heightRatio") !== null ? child.get("heightRatio") : 90;

					//         container.style.transform = "translate(" + ((childWidth * xRatio * this.props.zoomFactor) / 100) + "px, " + ((childHeight * yRatio * this.props.zoomFactor) / 100) + "px)" + flip;
					//         container.style.width = ((childWidth * widthRatio * this.props.zoomFactor) / 100) + "px";
					//         container.style.height = ((childHeight * heightRatio * this.props.zoomFactor) / 100) + "px";
					//     }

					//     if (this.isFontAutoSize(itemId, "workspaceChildren") || (handle === "top-left" || handle === "top-right" || handle === "bottom-left" || handle === "bottom-right")) {
					//         let fontSize = parseFloat(child.getIn(["textData", "formats", "containerStyle", "fontSize"]));

					//         var ourText = container.getElementsByClassName("text-container")[0];
					//         if (child.get("type") === "SHAPE")
					//             textOffset = 0;
					//         else if (item.get("subType") !== "TXTGRP")
					//             textOffset = this.props.textOffset;
					//         let tsx = (childWidth - textOffset) / child.get("width"), tsy = (childHeight - textOffset) / child.get("height");
					//         var scaledFontsize = Math.abs((fontSize * (tsx + tsy) / 2));
					//         ourText.style.fontSize = (scaledFontsize * this.props.zoomFactor) + "px";

					//         if (scaledFontsize > groupFontSize || groupFontSize === null)
					//             groupFontSize = scaledFontsize;
					//         if (this.props.textStatus.get("isFocused") && this.props.textStatus.get("id") === itemId) {
					//             this.props.updateTextStatus({ fontSize: (scaledFontsize).toFixed(2) });
					//         }
					//     }
					// }

					if (((child.get("type") === "IMG" || child.get("type") === "STOCKIMG") && child.get("isCropped")) || child.get("type") === "FRAME") {
						let cropImageElem = document.getElementById(itemId).getElementsByTagName("img")[0];

						cropImageElem.style.left = ((child.getIn(["original", "x"]) * childWidth) * this.props.zoomFactor) + "px";
						cropImageElem.style.top = ((child.getIn(["original", "y"]) * childHeight) * this.props.zoomFactor) + "px";
						cropImageElem.style.width = ((child.getIn(["original", "width"]) * childWidth) * this.props.zoomFactor) + "px";
						cropImageElem.style.height = ((child.getIn(["original", "height"]) * childHeight) * this.props.zoomFactor) + "px";
					}

					// if (child.get("type") === "SHAPE" && child.get("subType") === "CSTMPTH") {
					//     let currentItem = child.set("width", childWidth).set("height", childHeight);

					//     var pathDetails = getPath(currentItem, this.props.zoomFactor, child);
					//     let dataPath = pathDetails.pathDetails;
					//     if (Array.isArray(dataPath)) {
					//         for (let p = 0; p < dataPath.length; p++) {
					//             document.getElementById(itemId).getElementsByTagName("svg")[0].getElementsByClassName("path" + p)[0].setAttribute("d", dataPath[p].data);

					//             if (dataPath[p].pathStyle !== undefined)
					//                 document.getElementById(itemId).getElementsByTagName("svg")[0].getElementsByTagName("g")[0].style.transform = "translate(" + dataPath[p].pathStyle.left + "px, " + dataPath[p].pathStyle.top + "px)";
					//         }
					//     }
					// }

				});

				if (this.props.textStatus.get("isSelected") && this.props.textStatus.get("isGrouped") && this.props.textStatus.get("id") === key && groupFontSize !== null) {
					this.props.updateTextStatus({ fontSize: groupFontSize.toFixed(2) });
				}
			}

			// if ((item.get("type") === "TEXT" || (item.get("type") === "SHAPE"))) {

			//     var container = document.getElementById(key);

			//     if (item.get("type") === "SHAPE") {
			//         let xRatio = item.get("xRatio") !== undefined && item.get("xRatio") !== null ? item.get("xRatio") : 10;
			//         let yRatio = item.get("yRatio") !== undefined && item.get("yRatio") !== null ? item.get("yRatio") : 10;
			//         let widthRatio = item.get("widthRatio") !== undefined && item.get("widthRatio") !== null ? item.get("widthRatio") : 90;
			//         let heightRatio = item.get("heightRatio") !== undefined && item.get("heightRatio") !== null ? item.get("heightRatio") : 90;
			//         container = container.getElementsByClassName("callout-text-container")[0];


			//         if (item.get("subType") === "CSTMPTH") {
			//             let currentItem = item.set("width", item_width).set("height", item_height);

			//             var pathDetails = getPath(currentItem, this.props.zoomFactor, item);
			//             let dataPath = pathDetails.pathDetails;
			//             if (Array.isArray(dataPath)) {
			//                 for (let p = 0; p < dataPath.length; p++) {
			//                     document.getElementById(key).getElementsByTagName("svg")[0].getElementsByClassName("path" + p)[0].setAttribute("d", dataPath[p].data);

			//                     if (dataPath[p].pathStyle !== undefined)
			//                         document.getElementById(key).getElementsByTagName("svg")[0].getElementsByTagName("g")[0].style.transform = "translate(" + dataPath[p].pathStyle.left + "px, " + dataPath[p].pathStyle.top + "px)";
			//                 }
			//             }

			//             let flipPos = item.get("flipPosition");
			//             let flip = (flipPos === 1) ? " scaleX(-1)" : (flipPos === 2) ? " scaleY(-1)" : (flipPos === 3) ? " scaleX(-1) scaleY(-1)" : "";

			//             container.style.transform = "translate(" + ((item_width * xRatio * this.props.zoomFactor) / 100) + "px, " + ((item_height * yRatio * this.props.zoomFactor) / 100) + "px)" + flip;
			//             container.style.width = ((item_width * widthRatio * this.props.zoomFactor) / 100) + "px";
			//             container.style.height = ((item_height * heightRatio * this.props.zoomFactor) / 100) + "px";


			//             if (pathDetails.shapeStyle !== undefined) {
			//                 document.getElementById(key).getElementsByTagName("svg")[0].style.left = pathDetails.shapeStyle.left;
			//                 document.getElementById(key).getElementsByTagName("svg")[0].style.top = pathDetails.shapeStyle.top;
			//                 document.getElementById(key).getElementsByTagName("svg")[0].style.width = pathDetails.shapeStyle.width;
			//                 document.getElementById(key).getElementsByTagName("svg")[0].style.height = pathDetails.shapeStyle.height;
			//             }

			//             if (item.get("subType") === "CSTMPTH" && this.selectedItems.size === 1) {
			//                 let pathData = fromJS(pathDetails.pathData);
			//                 if (pathDetails.newControlPoints !== undefined) {
			//                     let newControlPoints = this.getFlipPosition(pathDetails.newControlPoints, item.get("flipPosition"));
			//                     for (let p in newControlPoints) {
			//                         document.getElementsByClassName("control-point " + p)[0].style.left = "calc(" + newControlPoints[p].x + "% - 7.5px)";
			//                         document.getElementsByClassName("control-point " + p)[0].style.top = "calc(" + newControlPoints[p].y + "% - 7.5px)";
			//                     }
			//                 }

			//                 else if (pathData) {
			//                     pathData.get("controlPoints").entrySeq().forEach(([key, pos]) => {
			//                         document.getElementsByClassName("control-point " + key)[0].style.left = "calc(" + pos.get("x") + "% - 7.5px)";
			//                         document.getElementsByClassName("control-point " + key)[0].style.top = "calc(" + pos.get("y") + "% - 7.5px)";
			//                     });
			//                 }
			//             }
			//         }

			//     }

			//     if ((this.isFontAutoSize(key) || (handle === "top-left" || handle === "top-right" || handle === "bottom-left" || handle === "bottom-right") || item.get("type") === "SHAPE")) {
			//         let fontSize = parseFloat(item.getIn(["textData", "formats", "containerStyle", "fontSize"]), 10);
			//         var ourText = container.getElementsByClassName("text-container")[0];

			//         if (item.get("type") === "SHAPE")
			//             textOffset = 0;
			//         let tsx = (item_width - textOffset) / item.get("width"), tsy = (item_height - textOffset) / item.get("height");

			//         ourText.style.fontSize = ((fontSize * Math.abs(Math.max(tsx, tsy))) * this.props.zoomFactor).toFixed(2) + "px";
			//         if ((this.props.textStatus.get("isSelected") || this.props.textStatus.get("isFocused")) && this.props.textStatus.get("id") === key) {
			//             if (document.getElementsByClassName("font-size-input")[0] !== undefined && document.getElementsByClassName("font-size-input")[0] !== null) {
			//                 document.getElementsByClassName("font-size-input")[0].value = ((fontSize * Math.abs(Math.max(tsx, tsy))) * this.props.zoomFactor).toFixed(2);
			//             }
			//         }
			//     }
			// }


			if (((item.get("type") === "IMG" || item.get("type") === "STOCKIMG") && item.get("isCropped")) || item.get("type") === "FRAME") {

				if (item.get('type') === "FRAME" && item.getIn(['imgDetails', 'src']) !== undefined) {
					// cropImageElem = document.getElementById(key).getElementsByTagName("svg")[0];
					let frameImage

					frameImage = document.getElementById(key).getElementsByClassName('img_id_3')[0]

					let frameWidth = item.getIn(['imgDetails', 'widthRatio']) * item_width
					let frameHeight = item.getIn(['imgDetails', 'heightRatio']) * item_height

					let frameX = item.getIn(['imgDetails', 'yRatio']) * item_height
					let frameY = item.getIn(['imgDetails', 'xRatio']) * item_width

					frameImage.style.left = ((item.getIn(["original", "x"]) * frameX) * this.props.zoomFactor) + "px";
					frameImage.style.top = ((item.getIn(["original", "y"]) * frameY) * this.props.zoomFactor) + "px";
					frameImage.style.width = ((item.getIn(["original", "width"]) * frameWidth) * this.props.zoomFactor) + "px";
					frameImage.style.height = ((item.getIn(["original", "height"]) * frameHeight) * this.props.zoomFactor) + "px";

				} else {
					let cropImageElem

					cropImageElem = document.getElementById(key).getElementsByTagName("img")[0];

					cropImageElem.style.left = ((item.getIn(["original", "x"]) * item_width) * this.props.zoomFactor) + "px";
					cropImageElem.style.top = ((item.getIn(["original", "y"]) * item_height) * this.props.zoomFactor) + "px";
					cropImageElem.style.width = ((item.getIn(["original", "width"]) * item_width) * this.props.zoomFactor) + "px";
					cropImageElem.style.height = ((item.getIn(["original", "height"]) * item_height) * this.props.zoomFactor) + "px";
				}
			}

		});
	}


	stopResize(e) {
		e.preventDefault();

		if (!this.props.isToolCropping) {
			this.updateResizeValues(e);
		}
		else {
			let resize_position = this.getResizePosition(e);
			var scale_x = resize_position.scale_x,
				scale_y = resize_position.scale_y,
				cx = resize_position.cx,
				cy = resize_position.cy,
				new_width = Math.abs(this.initialSelectionBox.width * scale_x),
				new_height = Math.abs(this.initialSelectionBox.height * scale_y);

			// let handle = this.selectionBox.handle;

			let selectionX = cx - new_width / 2,
				selectionY = cy - new_height / 2,
				selectionWidth = new_width, selectionHeight = new_height;

			let toUpdate = {
				x: selectionX / this.props.workspaceWidth,
				y: selectionY / this.props.workspaceHeight,
				width: selectionWidth / this.props.workspaceWidth,
				height: selectionHeight / this.props.workspaceHeight
			};

			this.props.updateBg({
				toUpdate: toUpdate,
				toolCrop: true
			}) // ,this.props.socket);
		}

		window.removeEventListener('mousemove', this.resizeSelection, false);
		window.removeEventListener('mousemove', this.resizeTextContainer, false);
		window.removeEventListener('mouseup', this.stopResize, false);
		this.resetCursor(e);
	}


	updateResizeValues(e) {
		this.setCursor(e);
		let handle = this.initialSelectionBox.handle;
		let selectedId = this.selectedItems.keySeq().toArray()[0];

		if (this.isTextOnly()) {
			let textBounds = this.getTextBounds(e, selectedId);

			this.updateInitialSelectionBox({
				transforming: false,
				resizing: false,
				x: textBounds.x,
				y: textBounds.y,
				width: textBounds.width,
				height: textBounds.height,
				cx: textBounds.x + textBounds.width / 2,
				cy: textBounds.y + textBounds.height / 2
			});

			this.selectedItems = this.selectedItems.set(selectedId, this.selectedItems.get(selectedId).merge(fromJS(textBounds)));

			if (handle !== "left" && handle !== "right") {

				let fontSize = parseFloat(this.getFontSize({
					id: this.props.textStatus.get("id"),
					width: textBounds.width - this.props.textOffset,
					height: textBounds.height - this.props.textOffset
				}), 10);

				this.selectedItems = this.selectedItems.setIn([selectedId, "textData", "formats", "containerStyle", "fontSize"], (fontSize / this.props.zoomFactor).toFixed(2) + "px");

			}

			this.props.resizeUpdate({

				"workspaceItems": this.selectedItems,
				"workspaceChildren": this.groupedItems,
				"currentContainer": this.currentItemContainer,
				selectedItems: this.props.selectedItems,

			}) //, this.props.socket);

		} else {
			let resize_position = this.getResizePosition(e);
			var scale_x = resize_position.scale_x,
				scale_y = resize_position.scale_y,
				cx = resize_position.cx,
				cy = resize_position.cy,
				new_width = Math.abs(this.initialSelectionBox.width * scale_x),
				new_height = Math.abs(this.initialSelectionBox.height * scale_y),
				new_x = cx - new_width / 2,
				new_y = cy - new_height / 2;

			this.updateInitialSelectionBox({
				transforming: false,
				resizing: false,
				x: new_x,
				y: new_y,
				width: new_width,
				height: new_height,
				cx: new_x + new_width / 2,
				cy: new_y + new_height / 2
			});

			var allItems = this.selectedItems;

			this.selectedItems.entrySeq().forEach(([key, item]) => {
				var item_width = Math.abs(item.get("width") * scale_x), item_height = Math.abs(item.get("height") * scale_y);

				var item_x = Math.cos((item.get("angle_to_center") + this.initialSelectionBox.angle) * Math.PI / 180) * Math.abs(item.get("dis_to_center") * scale_x) + cx - item_width / 2;

				var item_y = Math.sin((item.get("angle_to_center") + this.initialSelectionBox.angle) * Math.PI / 180) * Math.abs(item.get("dis_to_center") * scale_y) + cy - item_height / 2;

				let item_to_update = Map({
					"x": item_x,
					"y": item_y,
					"width": item_width,
					"height": item_height
				});

				if (item.get("type") === "GROUP") {
					let groupItems = this.props.selectedChildren;

					item.get("groupChildren").entrySeq().forEach(([childKey, itemId]) => {

						let child = groupItems.get(itemId);
						let childWidth = Math.abs(child.get("width") * scale_x),
							childHeight = Math.abs(child.get("height") * scale_y);

						let groupedItem = this.groupedItems.get(itemId);

						var childGX = Math.cos((groupedItem.get("angle_to_center") + item.get("angle")) * Math.PI / 180) * Math.abs(groupedItem.get("dis_to_center") * scale_x) + (item_x + item_width / 2) - childWidth / 2;
						var childGY = Math.sin((groupedItem.get("angle_to_center") + item.get("angle")) * Math.PI / 180) * Math.abs(groupedItem.get("dis_to_center") * scale_y) + (item_y + item_height / 2) - childHeight / 2;

						// let currentChildItem    = document.getElementById(itemId);
						let childToUpdate = Map({
							"x": parseFloat(childGX.toFixed(2) + item_x.toFixed(2)),
							"y": parseFloat(childGY.toFixed(2) + item_x.toFixed(2)),
							"height": childHeight
						});

						// if (item.get("subType") === "TXTGRP" && item.get("isExpands")) {

						//     var svgItem = groupItems.filter(function (obj, key) { 
						//         return item.get("groupChildren").indexOf(key) !== -1 
						//     }).find(x => x.get("type") === "OVLYSVG");

						//     let xScale = scale_x;
						//     if (handle === "left" || handle === "right")
						//         xScale = 1;

						//     if (child.get("type") === "TEXT") {
						//         childToUpdate = childToUpdate.set("width", (item_width - (svgItem.getIn(["groupBounds", "leftItem", "width"]) * svgItem.getIn(["groupBounds", "leftItem", "scaleX"]) * xScale) - (svgItem.getIn(["groupBounds", "rightItem", "width"]) * svgItem.getIn(["groupBounds", "rightItem", "scaleX"]) * xScale)));

						//         childToUpdate = childToUpdate.set("x", item_x + (svgItem.getIn(["groupBounds", "leftItem", "width"]) * svgItem.getIn(["groupBounds", "leftItem", "scaleX"]) * xScale));
						//     }
						//     else {
						//         childToUpdate = childToUpdate.set("x", parseFloat(childGX.toFixed(2) + item_x.toFixed(2)));
						//         childToUpdate = childToUpdate.set("width", childWidth);
						//     }
						// }
						// else {
						//     childToUpdate = childToUpdate.set("x", parseFloat(childGX.toFixed(2) + item_x.toFixed(2)));
						//     childToUpdate = childToUpdate.set("width", childWidth);
						// }

						// if (child.get("type") === "TEXT" || child.get("type") === "SHAPE") {

						//     if (this.isFontAutoSize(itemId, "workspaceChildren") || (handle === "top-left" || handle === "top-right" || handle === "bottom-left" || handle === "bottom-right")) {

						//         let widthRatio = child.get("widthRatio") !== undefined && child.get("widthRatio") !== null ? Math.round(child.get("widthRatio")) : (child.get("type") === "SHAPE") ? 90 : 100;
						//         let heightRatio = child.get("heightRatio") !== undefined && child.get("heightRatio") !== null ? Math.round(child.get("heightRatio")) : (child.get("type") === "SHAPE") ? 90 : 100;

						//         let textWidth = (widthRatio / 100) * childWidth;
						//         let textHeight = (heightRatio / 100) * childHeight;
						//         if (child.get("type") !== "SHAPE" && item.get("subType") !== "TXTGRP") {
						//             textWidth -= this.props.textOffset;
						//             textHeight -= this.props.textOffset;
						//         }
						//         let fontSize = parseFloat(this.getFontSize({ 
						//             id: itemId, 
						//             width: textWidth, 
						//             height: textHeight, 
						//             isGrouped: true, 
						//             parentId: key 
						//         }), 10);

						//         childToUpdate = childToUpdate.set("textData", child.setIn(["textData", "formats", "containerStyle", "fontSize"], (fontSize / this.props.zoomFactor).toFixed(2) + "px").get("textData"));
						//     }
						// }

						// if (child.get("type") === "SHAPE") {
						//     let currentItem = child.set("width", childWidth).set("height", childHeight);
						//     var pathDetails = getPath(currentItem, this.props.zoomFactor, child);
						//     let pathData = childToUpdate.get("pathData") !== undefined ? childToUpdate.get("pathData").merge(fromJS(pathDetails.pathData)) : fromJS(pathDetails.pathData);
						//     childToUpdate = childToUpdate.set("pathData", pathData);

						//     let dataPath = getPath(currentItem, 1, child).pathDetails;
						//     childToUpdate = childToUpdate.set("path", fromJS(dataPath));
						// }

						this.groupedItems = this.groupedItems.set(itemId, groupedItem.merge(childToUpdate));
					})

				}

				// if (item.get("type") === "SHAPE") {

				//     let currentItem = item.set("width", item_width).set("height", item_height);
				//     var pathDetails = getPath(currentItem, 1, item);

				//     let dataPath = pathDetails.pathDetails;
				//     item_to_update = item_to_update.set("path", fromJS(dataPath));

				// }
				// if ((item.get("type") === "TEXT" || (item.get("type") === "SHAPE"))) {
				//     let textWidth = item_width;
				//     let textHeight = item_height;
				//     if (item.get("type") !== "SHAPE") {
				//         textWidth -= this.props.textOffset;
				//         textHeight -= this.props.textOffset;
				//     } else {
				//         let widthRatio = item.get("widthRatio") !== undefined && item.get("widthRatio") !== null ? Math.round(item.get("widthRatio")) : 90;
				//         let heightRatio = item.get("heightRatio") !== undefined && item.get("heightRatio") !== null ? Math.round(item.get("heightRatio")) : 90;

				//         textWidth = (widthRatio / 100) * textWidth;
				//         textHeight = (heightRatio / 100) * textHeight;

				//     }

				//     let fontSize = parseFloat(this.getFontSize({ 
				//         id: key, 
				//         width: textWidth, 
				//         height: textHeight 
				//     }), 10);

				//     if (this.isFontAutoSize(key) || (handle === "top-left" || handle === "top-right" || handle === "bottom-left" || handle === "bottom-right") || item.get("type") === "SHAPE") {
				//         item_to_update = item_to_update.set("textData", item.setIn(["textData", "formats", "containerStyle", "fontSize"], (fontSize / this.props.zoomFactor).toFixed(2) + "px").get("textData"));
				//     }

				// }

				allItems = allItems.set(key, item.merge(item_to_update));
			});
			this.selectedItems = allItems;

			let selectedItems = {}

			this.selectedItems.entrySeq().forEach((value, key) => {
				let keys = value[0]
				let { angle, x, y, width, height } = value[1].toJS()

				selectedItems[keys] = { angle, x, y, width, height }
			})

			this.props.resizeUpdate({
				"workspaceItems": selectedItems,
				"workspaceChildren": this.groupedItems,
				"transformStatus": fromJS({
					transforming: false,
					moving: false,
					resizing: false,
					rotating: false
				})

				// isShapeOnly: this.isShapeOnly() 
			})  //, this.props.socket);
		}
	}

	//Move

	hideSnaplines() {
		let snapLines = document.getElementsByClassName("snap-line");
		for (var i = 0; i < snapLines.length; i++) {
			snapLines[i].style.display = "none";
		}
	}

	disableClick(selector) {
		var elements = document.querySelectorAll(selector);
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].className.indexOf("pointer-events-none") === -1) {
				elements[i].classList.add("pointer-events-none");
			}
		}
	}

	enableClick(selector) {
		var elements = document.querySelectorAll(selector);
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].className.indexOf("pointer-events-none") !== -1)
				elements[i].classList.remove("pointer-events-none");
		}
	}

	isRightMouse(e) {
		var isRightMB;
		e = e || window.event;
		if ("which" in e)
			isRightMB = e.which === 3;
		else if ("button" in e)
			isRightMB = e.button === 2;

		return isRightMB;
	}

	isMouseOnSelectionBox(e) {
		let workspace_bounds = this.getWorkspaceBounds(),
			currentX = e.clientX - workspace_bounds.x,
			currentY = e.clientY - workspace_bounds.y;

		if (this.selectionBox.x !== null) {
			if ((currentX > (this.selectionBox.x) && currentY > (this.selectionBox.y) && currentX < (this.selectionBox.x + this.selectionBox.width)
				&& currentY < (this.selectionBox.y + this.selectionBox.height)) && !this.isMouseOn(e, "handle"))
				return true;
		}
		return false;
	}

	getSelectionSnapPoints(x, y) {
		var cx = x + (this.selectionBox.width * this.props.zoomFactor) / 2;
		var cy = y + (this.selectionBox.height * this.props.zoomFactor) / 2;

		let bounds = this.getSelectionBoxBounds({
			x: x,
			y: y,
			cx: cx,
			cy: cy,
			width: (this.selectionBox.width * this.props.zoomFactor),
			height: (this.selectionBox.height * this.props.zoomFactor),
			angle: this.selectionBox.angle
		});

		let boundX = bounds.x / this.props.zoomFactor,
			boundY = bounds.y / this.props.zoomFactor,
			boundWidth = bounds.width / this.props.zoomFactor,
			boundHeight = bounds.height / this.props.zoomFactor;

		let selectionLeft = boundX,
			selectionTop = boundY,
			selectionRight = boundX + boundWidth,
			selectionBottom = boundY + boundHeight,
			selectionCenterX = boundX + boundWidth / 2,
			selectionCenterY = boundY + boundHeight / 2;

		// let bounds = this.selectionBoxElement.getBoundingClientRect();
		// let left = (bounds.x - document.getElementById("workspace").offsetLeft) / this.props.zoomFactor, top = (bounds.y - document.getElementById("workspace").offsetTop) / this.props.zoomFactor, width = bounds.width / this.props.zoomFactor, height = bounds.height / this.props.zoomFactor;
		// console.log((this.selectionBoxElement.getBoundingClientRect().x - document.getElementById("workspace").offsetLeft) / this.props.zoomFactor , selectionLeft);

		return {
			left: selectionLeft,
			top: selectionTop,
			centerX: selectionCenterX,
			centerY: selectionCenterY,
			right: selectionRight,
			bottom: selectionBottom
		};
	}

	moveItem(x, y) {

		var selectionBox = this.selectionBoxElement;

		if (this.restrictBounds !== undefined && this.restrictBounds) {
			let outLineWidth = 0;
			if (x - outLineWidth < 0) x = outLineWidth; if (y - outLineWidth < 0) y = outLineWidth;

			if (y + (this.selectionBox.height * this.props.zoomFactor) + outLineWidth > document.getElementById('workspace').offsetHeight)
				y = document.getElementById('workspace').offsetHeight - (this.selectionBox.height * this.props.zoomFactor) - outLineWidth;

			if (x + (this.selectionBox.width * this.props.zoomFactor) + outLineWidth > document.getElementById('workspace').offsetWidth)
				x = document.getElementById('workspace').offsetWidth - (this.selectionBox.width * this.props.zoomFactor) - outLineWidth;
		}


		if (!this.transformingByKey) {

			var selectionPoints = this.getSelectionSnapPoints(x, y), i = 0;

			let xSnapped = false,
				ySnapped = false;

			var r = 2;

			for (i = 0; i < this.snapPoints.length; i++) {

				let dX = (selectionPoints.left - this.snapPoints[i].x) * this.props.zoomFactor,
					dY = (selectionPoints.top - this.snapPoints[i].y) * this.props.zoomFactor;

				let dCX = (selectionPoints.centerX - this.snapPoints[i].x) * this.props.zoomFactor,
					dCY = (selectionPoints.centerY - this.snapPoints[i].y) * this.props.zoomFactor;

				let dRX = (selectionPoints.right - this.snapPoints[i].x) * this.props.zoomFactor,
					dRY = (selectionPoints.bottom - this.snapPoints[i].y) * this.props.zoomFactor;

				let snappedX = (Math.abs(dX) <= r) ? dX : (Math.abs(dCX) <= (this.snapPoints[i].center ? 6 : r)) ? dCX : (Math.abs(dRX) <= r) ? dRX : false;
				let snappedY = (Math.abs(dY) <= r) ? dY : (Math.abs(dCY) <= (this.snapPoints[i].center ? 6 : r)) ? dCY : (Math.abs(dRY) <= r) ? dRY : false;

				if (snappedX !== false && !xSnapped) {
					x = parseFloat((x - snappedX).toFixed(2));
					xSnapped = true;
				}

				if (snappedY !== false && !ySnapped) {
					y = parseFloat((y - snappedY).toFixed(2));
					ySnapped = true;
				}
			}

		}

		let selectionCX = (x / this.props.zoomFactor) + (this.selectionBox.width) / 2,
			selectionCy = (y / this.props.zoomFactor) + (this.selectionBox.height) / 2;

		selectionBox.style.transform = "translate(" + (x) + "px, " + (y) + "px) rotateZ(" + this.selectionBox.angle + "deg)";

		var allItems = this.selectedItems;

		allItems.entrySeq().forEach(([key, item]) => {
			let item_x = Math.cos((item.get("angle_to_center") + this.initialSelectionBox.angle) * Math.PI / 180) * Math.abs(item.get("dis_to_center")) + selectionCX - item.get("width") / 2;

			let item_y = Math.sin((item.get("angle_to_center") + this.initialSelectionBox.angle) * Math.PI / 180) * Math.abs(item.get("dis_to_center")) + selectionCy - item.get("height") / 2;

			let item_to_update = Map({
				"x": item_x,
				"y": item_y
			});

			allItems = allItems.set(key, item.merge(item_to_update));
			if (document.getElementById(key) !== null) {
				let flipPos = item.get("flipPosition");
				let flip = (flipPos === 1) ? " scaleX(-1)" : (flipPos === 2) ? " scaleY(-1)" : (flipPos === 3) ? " scaleX(-1) scaleY(-1)" : "";

				document.getElementById(key).style.transform = "translate(" + (item_x * this.props.zoomFactor).toFixed(2) + "px, " + (item_y * this.props.zoomFactor).toFixed(2) + "px) rotateZ(" + item.get("angle") + "deg)" + flip;
			}
		});


		this.selectedItems = allItems;

		this.selectionBox = Object.assign(this.selectionBox, {
			"x": x / this.props.zoomFactor,
			"y": y / this.props.zoomFactor
		});

		if (this.props.shortcutName !== "")
			this.keyPressUpdate = Object.assign(this.keyPressUpdate, this.selectionBox);

		// if (this.transformingByKey) {
		//   // this.props.moveUpdate();
		//   this.props.moveUpdate({"items":this.selectedItems, "children": this.groupedItems, isMultimove : this.state.selectedObjects.size === 1 && this.state.selectedObjects.first().get("isMultimove"), "selectedScene" : this.props.selectedScene, "currentContainer" : this.currentItemContainer, selectedItems : this.props.selectedItems},this.props.socket);
		// }

	}


	initiateMove(e) {

		let target = e.target;
		if (target.className.indexOf("crop-handle") !== -1) {
			return;
		}
		e.stopPropagation();
		
		if ((e.timeStamp - this.lastDown) < 250 && !this.isRightMouse(e)) {
			if (this.props.selectedItems.size === 1) {

				if (!this.props.isCropping && (this.selectedItems.get(this.props.selectedItems.get(0)).get("type") === "IMG" || this.selectedItems.get(this.props.selectedItems.get(0)).get("type") === "STOCKIMG" || (this.selectedItems.get(this.props.selectedItems.get(0)).get("type") === "UPLOADS" && this.selectedItems.get(this.props.selectedItems.get(0)).get("subType") === "UPIMAGE")))
					this.props.toggleCrop();

				else if (!this.props.isFraming 
								&& this.selectedItems.get(this.props.selectedItems.get(0)).get("type") === "FRAME" 
								&& this.selectedItems.getIn([this.props.selectedItems.get(0), 'clipDetails', this.props.selectedClip, 'imgDetails', 'src']) !== "")
					this.props.toggleFrame();

				if (this.selectedItems.getIn([this.props.selectedItems.get(0), "type"]) === "SHAPE") {

					this.props.updateTextStatus({
						id: this.props.selectedItems.get(0),
						isFocused: true,
						container: "workspaceItems",
						isRTL: this.selectedItems.getIn([this.props.selectedItems.get(0), "textData", "formats", "others", "isRTL"]),
						isGrouped: false,
						type: "SHAPE",
						fontSize: parseFloat(this.selectedItems.getIn([this.props.selectedItems.get(0), "textData", "formats", "containerStyle", "fontSize"]), 10)
					});

				}
			}

			if (this.props.selectedItems.size === 1)
				this.disableClick(".selectionBox");
		}

		// if(this.isTextOnly() && this.props.textStatus.get("isFocused")){
		//   this.props.updateTextStatus({isSelected : true, isFocused : false});
		// }

		this.lastDown = e.timeStamp;
		this.moved = false;

		if (this.props.selectedItems.size === 1)
			this.disableClick(".selectionBox");

		e.preventDefault();

		let isMoveLocked = (this.lockMove !== undefined && this.lockMove) ? true : false;
		if (!isMoveLocked) {

			// if(this.props.selectedKeyframe !== "" && this.props.selectedKeyframe === this.props.keyframe && this.props.isMultiMove)
			// {
			//   let itemToolBar = document.getElementsByClassName("item-tool-bar")[0];
			//   itemToolBar.getElementsByClassName('add-keyframe')[0].style.display = "none";
			//   itemToolBar.getElementsByClassName('update-keyframe')[0].style.display = "block";
			// }

			this.updateInitialSelectionBox({
				transforming: true,
				moving: true
			});

			let mouse_position = this.getMousePosition(e);
			this.mouseStartPosition = Object.assign(this.mouseStartPosition, {
				x: mouse_position.x,
				y: mouse_position.y,
				offsetX: ((this.selectionBox.x) - mouse_position.x / this.props.zoomFactor),
				offsetY: ((this.selectionBox.y) - mouse_position.y / this.props.zoomFactor)
			});

			if (this.selectionBox)
				window.addEventListener('mousemove', this.moveSelection, false);
			window.addEventListener('mouseup', this.stopMove, false);
		}
		else {
			this.enableClick(".selectionBox");
		}
	}

	moveSelection(e) {
		if (this.lastDown + 10 < e.timeStamp) {
			if (!this.moved) {
				this.moved = true;
				this.enableClick(".selectionBox");

				this.props.updateTransformStatus({
					transforming: true,
					moving: true
				});
			}
			e.preventDefault();

			let mouse_position = this.getMousePosition(e),
				x = parseFloat((mouse_position.x + (this.mouseStartPosition.offsetX * this.props.zoomFactor)).toFixed(2)),
				y = parseFloat((mouse_position.y + (this.mouseStartPosition.offsetY * this.props.zoomFactor)).toFixed(2));

			this.moveItem(x, y);
		}
	}

	stopMove(e) {

		this.hideSnaplines();
		this.enableClick(".selectionBox");

		this.updateInitialSelectionBox({
			transforming: false,
			moving: false,
			x: this.selectionBox.x,
			y: this.selectionBox.y,
			cx: this.selectionBox.x + this.selectionBox.width / 2,
			cy: this.selectionBox.y + this.selectionBox.height / 2
		});

		if (this.moved) {
			e.preventDefault();
			if (!this.props.isToolCropping) {
				// this.props.moveUpdate({ 
				//     "items": this.selectedItems, 
				//     "currentContainer": this.currentItemContainer, 
				//     "selectedItems": this.props.selectedItems 
				// }, this.props.socket);

				let selectedItems = {}

				this.selectedItems.entrySeq().forEach((value, key) => {
					let keys = value[0]
					let { angle, x, y, width, height } = value[1].toJS()

					selectedItems[keys] = { angle, x, y, width, height }
				})

				this.props.moveUpdate({
					"workspaceItems": selectedItems,
					"workspaceChildren": this.groupedItems,
					"transformStatus": fromJS({
						transforming: false,
						moving: false,
						resizing: false,
						rotating: false
					})
				})

			} else {
				let toUpdate = {
					x: this.selectionBox.x / this.props.workspaceWidth,
					y: this.selectionBox.y / this.props.workspaceHeight
				};

				this.props.updateBg({
					toUpdate: toUpdate,
					toolCrop: true
				}, this.props.socket);
			}
		} else {

			// this.props.setCurrentPosition(null);
			// // this.props.updateTransformStatus({ transforming: false, moving: false });

			// if (this.props.selectedItems.size === 1 && this.selectedItems.getIn([this.props.selectedItems.get(0), "type"]) === "TEXT") {

			//     this.props.updateTextStatus({ 
			//         id: this.props.selectedItems.get(0), 
			//         isFocused: true, 
			//         container: "workspaceItems", 
			//         isRTL: false, 
			//         isGrouped: this.props.isGrouped, 
			//         fontSize: parseFloat(this.selectedItems.getIn([this.props.selectedItems.get(0), "textData", "formats", "containerStyle", "fontSize"]), 10), 
			//         type: "TEXT" 
			//     });

			//     this.disableClick(".selectionBox");
			// }

			// if (this.props.textStatus.get("isFocused"))
			//     this.disableClick(".selectionBox");

		}

		//   this.props.updateCropStatus({id : this.props.selectedItems.get(0), status : false, selectedScene : this.props.selectedScene, selectedItems : this.props.selectedItem});

		window.removeEventListener('mousemove', this.moveSelection, false);
		window.removeEventListener('mouseup', this.stopMove, false);

		if (!this.isMouseOnSelectionBox(e))
			this.resetCursor(e);
	}


	//Rotate


	getQuadrant(_deg) {
		var r = 0;
		if (_deg >= 0 && _deg <= 90) {
			r = 1;
		} else if (_deg > 90 && _deg <= 180) {
			r = 2;
		} else if (_deg > 180 && _deg <= 270) {
			r = 3;
		} else if (_deg > 270 && _deg <= 360) {
			r = 4;
		}
		return r;
	}

	getAngle(e) {
		let workspaceBounds = this.getWorkspaceBounds();

		var angle = Math.atan2((e.clientY - workspaceBounds.y - (this.selectionBox.cy * this.props.zoomFactor)), e.clientX - workspaceBounds.x - (this.selectionBox.cx * this.props.zoomFactor)) * (180 / Math.PI);

		this.prevY = e.clientY - workspaceBounds.y;
		this.prevX = e.clientX - workspaceBounds.x;

		let rotation = angle - this.startAngle;
		var rAngle = rotation + this.initialSelectionBox.angle;

		if (rAngle < 0)
			rAngle += 360;

		let increements = 8;
		let snapAngle = 360 / increements;
		let snapPoint = 5;

		if (Math.abs(rAngle) % snapAngle < (snapPoint)) {
			rAngle -= (rAngle % snapAngle);

			document.getElementsByClassName("rotationLine")[0].style.left = (((this.selectionBox.x + this.selectionBox.width / 2) * this.props.zoomFactor) + workspaceBounds.x) + "px";
			document.getElementsByClassName("rotationLine")[0].style.top = (((this.selectionBox.y) * this.props.zoomFactor) + workspaceBounds.y) + "px";
			document.getElementsByClassName("rotationLine")[0].style.height = (this.selectionBox.height * this.props.zoomFactor) + "px";
			document.getElementsByClassName("rotationLine")[0].style.transform = "rotateZ(" + rAngle + "deg)";
			document.getElementsByClassName("rotationLine")[0].style.display = "block";
		} else {
			document.getElementsByClassName("rotationLine")[0].style.display = "none";
		}

		if (this.restrictBounds) {
			var bounds = this.getSelectionBoxBounds({
				x: this.selectionBox.x,
				y: this.selectionBox.y,
				cx: this.selectionBox.cx,
				cy: this.selectionBox.cy,
				width: this.selectionBox.width,
				height: this.selectionBox.height,
				angle: rAngle
			});

			var x = bounds.x,
				y = bounds.y,
				sWidth = bounds.width,
				sHeight = bounds.height;

			x = (x < 0) ? 0 : x;
			y = (y < 0) ? 0 : y;

			let widthRestricted = ((x + sWidth) >= workspaceBounds.width) ? true : false;
			let heightRestricted = ((y + sHeight) >= workspaceBounds.height) ? true : false;

			if ((x === 0 || y === 0 || widthRestricted || heightRestricted)) {
				if (!this.restrictedSelectionBox.isRestricted) {
					Object.assign(this.restrictedSelectionBox, { isRestricted: true, angle: rAngle });
				}
				rAngle = this.restrictedSelectionBox.angle;
			}
			else if (this.restrictedSelectionBox.isRestricted) {
				Object.assign(this.restrictedSelectionBox, { isRestricted: false });
			}
		}

		let oldQuad = this.getQuadrant(this.angle);
		let newQuad = this.getQuadrant(rAngle);

		if (oldQuad !== newQuad) {
			if (newQuad - oldQuad === 1 || oldQuad - newQuad === 1) {
			} else {
				if (oldQuad === 4 && newQuad === 1) {
					this.rotateCount++;
				}
				else if (oldQuad === 1 && newQuad === 4) {
					this.rotateCount--;
				}
			}
		}

		this.angle = rAngle;

		return (Math.abs(this.angle) > 360) ? this.angle % 360 : this.angle;
	}

	initiateRotate(e) {

		e.preventDefault();
		e.stopPropagation()
		let isRotateLocked = (this.lockRotate !== undefined && this.lockRotate) ? true : false;

		if (!isRotateLocked) {
			this.angle = this.selectionBox.angle;
			this.rotateCount = 0;
			// if(this.props.selectedKeyframe !== "" && this.props.selectedKeyframe === this.props.keyframe && this.props.isMultiMove)
			// {
			//   let itemToolBar = document.getElementsByClassName("item-tool-bar")[0];
			//   itemToolBar.getElementsByClassName('add-keyframe')[0].style.display = "none";
			//   itemToolBar.getElementsByClassName('update-keyframe')[0].style.display = "block";
			// }

			let tourNextBtn = document.querySelector('.next_step');
			if (tourNextBtn) {
				tourNextBtn.classList.remove('disable');
			}
			let workspace_bounds = this.getWorkspaceBounds();

			let wpx = e.clientX - workspace_bounds.x,
				wpy = e.clientY - workspace_bounds.y,
				scx = this.selectionBox.cx * this.props.zoomFactor,
				scy = this.selectionBox.cy * this.props.zoomFactor;

			this.diffX = wpx; this.diffY = wpy;
			this.prevY = wpx; this.prevX = wpy;
			this.startAngle = Math.atan2((wpy - scy), (wpx - scx)) * (180 / Math.PI);

			this.updateInitialSelectionBox({
				transforming: true,
				rotating: true,
				handle: e.target.getAttribute("data-handle")
			});

			this.props.updateTransformStatus({
				transforming: true,
				rotating: true
			});

			document.getElementsByClassName("rotationDisplay")[0].style.left = (workspace_bounds.x + ((this.selectionBox.x + this.selectionBox.width / 2) * this.props.zoomFactor)) - 11 + "px";
			document.getElementsByClassName("rotationDisplay")[0].style.top = (workspace_bounds.y + ((this.selectionBox.y + this.selectionBox.height / 2) * this.props.zoomFactor)) - 11 + "px";
			document.getElementsByClassName("rotationDisplay")[0].style.display = "table";
			if (this.props.isMultiMove) {
				// this.toolBar.style.display = "none";
			}

			// this.updateSelectedItems();

			window.addEventListener('mousemove', this.rotateSelection, false);
			window.addEventListener('mouseup', this.stopRotate, false);
		}
	}

	rotateSelection(e) {
		e.preventDefault();
		var rAngle = this.getAngle(e);
		var angleDisplay = rAngle;
		if (angleDisplay > 180)
			angleDisplay = angleDisplay - 360;

		var selectionBox = this.selectionBoxElement;
		selectionBox.style.transform = "translate(" + this.selectionBox.x * this.props.zoomFactor + "px, " + this.selectionBox.y * this.props.zoomFactor + "px) rotateZ(" + rAngle + "deg)";
		document.getElementById("rotationAngle").innerText = Math.round(angleDisplay).toFixed(0);
		var allItems = this.selectedItems;
		rAngle = parseFloat(rAngle);

		this.selectedItems.entrySeq().forEach(([key, item]) => {
			let current_item = document.getElementById(key);
			let flipPos = item.get("flipPosition");
			let flip = (flipPos === 1) ? " scaleX(-1)" : (flipPos === 2) ? " scaleY(-1)" : (flipPos === 3) ? " scaleX(-1) scaleY(-1)" : "";

			let item_x = (Math.cos((item.get("angle_to_center") + rAngle) * Math.PI / 180) * item.get("dis_to_center") + this.selectionBox.cx) - item.get("width") / 2,
				item_y = (Math.sin((item.get("angle_to_center") + rAngle) * Math.PI / 180) * item.get("dis_to_center") + this.selectionBox.cy) - item.get("height") / 2;

			let initialAngle = parseFloat(this.state.selectedObjects.getIn([key, "angle"]));
			var item_angle = rAngle + initialAngle;

			if (allItems.size === 1)
				item_angle -= initialAngle;

			item_angle = (Math.abs(item_angle) > 360) ? item_angle % 360 : item_angle;

			current_item.style.transform = "translate(" + (item_x * this.props.zoomFactor).toFixed(4) + "px, " + (item_y * this.props.zoomFactor).toFixed(4) + "px) rotateZ(" + (item_angle) + "deg) " + flip;

			let item_to_update = Map({
				"x": item_x,
				"y": item_y,
				"angle": item_angle,
				"rotationCount": this.rotateCount
			});

			allItems = allItems.set(key, item.merge(item_to_update));
		});

		this.selectedItems = allItems;
	}

	stopRotate(e) {
		e.preventDefault();
		this.setCursor(e);
		var rAngle = this.getAngle(e);

		document.getElementsByClassName("rotationDisplay")[0].style.display = "none";
		document.getElementsByClassName("rotationLine")[0].style.display = "none";
		// if(this.restrictedSelectionBox.isRestricted){
		//   Object.assign(this.restrictedSelectionBox, {isRestricted:false, angle : rAngle});
		// }
		this.updateInitialSelectionBox({
			transforming: false,
			rotating: false,
			angle: rAngle
		});
		// this.props.storeData(this.selectedItems, "rotate");

		let selectedItems = {}

		this.selectedItems.entrySeq().forEach((value, key) => {
			let keys = value[0]
			let { angle, x, y, width, height } = value[1].toJS()

			selectedItems[keys] = { angle, x, y, width, height }
		})

		this.props.rotateUpdate({
			"workspaceItems": selectedItems,
			"workspaceChildren": this.groupedItems,
			"transformStatus": fromJS({
				transforming: false,
				moving: false,
				resizing: false,
				rotating: false
			})
		})


		// this.updateSelectedItems();
		window.removeEventListener('mousemove', this.rotateSelection, false);
		window.removeEventListener('mouseup', this.stopRotate, false);
		this.resetCursor(e);
	}

	setPointerEvents(e) {
		if (this.props.selectedItems.size === 1 && this.props.selectedObjects.getIn([this.props.selectedItems.get(0), 'type']) === "FRAME") {
			if (e.buttons === 1) {
				document.getElementsByClassName('selectionBox')[0].style.pointerEvents = 'none';
			}
		}
	}

	removePointerEvents(e) {
		if (this.props.selectedItems.size === 1 && this.props.selectedObjects.getIn([this.props.selectedItems.get(0), 'type']) === "FRAME") {
			if (e.buttons === 1) {
				document.getElementsByClassName('selectionBox')[0].style.pointerEvents = '';
			}
		}
	}
	// onMouseEnter={(e) => this.setPointerEvents(e)} onMouseLeave={(e) => this.removePointerEvents(e)} 


	render() {


		let selectionBounds = {};

		if (!this.transformingByKey)
			selectionBounds = this.getSelectionBox();
		else
			selectionBounds = this.selectionBox;

		let selectionBoxStyles = {
			transform: `translate(${selectionBounds.x}px, ${selectionBounds.y}px) rotate(${selectionBounds.angle}deg)`,
			width: `${selectionBounds.width * this.props.zoomFactor}px`,
			height: `${selectionBounds.height * this.props.zoomFactor}px`,
			userSelect: 'none',
		}

		var id = null;
		// selection_styles.display = "none";
		var selectionBoxClass = "selectionBox";
		var innerBoxClass = "inner-box";
		var handlesClass = "handles";

		if (this.selectionBox.angle >= 337.5 || this.selectionBox.angle <= 22.5)
			selectionBoxClass += " e"
		else if (this.selectionBox.angle >= 22.5 && this.selectionBox.angle <= 67.5)
			selectionBoxClass += " se"
		else if (this.selectionBox.angle >= 67.5 && this.selectionBox.angle <= 112.5)
			selectionBoxClass += " s"
		else if (this.selectionBox.angle >= 112.5 && this.selectionBox.angle <= 157.5)
			selectionBoxClass += " sw"
		else if (this.selectionBox.angle >= 157.5 && this.selectionBox.angle <= 202.5)
			selectionBoxClass += " w"
		else if (this.selectionBox.angle >= 202.5 && this.selectionBox.angle <= 247.5)
			selectionBoxClass += " nw"
		else if (this.selectionBox.angle >= 247.5 && this.selectionBox.angle <= 292.5)
			selectionBoxClass += " n"
		else if (this.selectionBox.angle >= 292.5 && this.selectionBox.angle <= 337.5)
			selectionBoxClass += " ne"

		if (this.props.transformStatus.get("transforming")) {
			selectionBoxClass += " invisible";
		}

		if (this.props.isItemDragging) {
			selectionBoxClass += " disableEvents"
		}

		return (
			<React.Fragment>
				<div data-html2canvas-ignore="true" key={this.props.keyframe} className={selectionBoxClass} ref={(instance) => this.selectionBoxElement = instance} data-id={id} style={{ ...selectionBoxStyles }} >
					<div className={innerBoxClass} data-id={id} onMouseDown={this.initiateMove} onMouseEnter={(e) => this.setCursor(e, "move")} onMouseLeave={(e) => this.resetCursor(e)} >
					</div>
					<div className={handlesClass}>

						<span className={"resize-handle top-left" + (((this.props.transformStatus.get("resizing") || this.props.transformStatus.get("rotating")) && this.selectionBox.handle === "top-left") || this.props.isToolCropping ? " active" : "")} data-handle="top-left" onMouseDown={this.initiateResize} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
						<span className={"rotate-handle top-left" + (this.props.selectedItems.size === 0 ? " disabled" : "")} data-handle="top-left" onMouseDown={this.initiateRotate} onMouseEnter={(e) => this.setCursor(e, "rotate")} onMouseLeave={(e) => this.resetCursor(e)}></span>

						<span className={"resize-handle top" + (this.isVerticalScale() ? "" : " disabled") + ((this.props.transformStatus.get("resizing") || this.props.transformStatus.get("rotating")) && this.selectionBox.handle === "top" ? " active" : "") + ((selectionBounds.width * this.props.zoomFactor) > 60 ? "" : " hide-handle")} data-handle="top" onMouseDown={this.initiateResize} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>

						<span className={"resize-handle top-right" + (((this.props.transformStatus.get("resizing") || this.props.transformStatus.get("rotating")) && this.selectionBox.handle === "top-right") || this.props.isToolCropping ? " active" : "")} data-handle="top-right" onMouseDown={this.initiateResize} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
						<span className={"rotate-handle top-right" + (this.props.selectedItems.size === 0 ? " disabled" : "")} data-handle="top-right" onMouseDown={this.initiateRotate} onMouseEnter={(e) => this.setCursor(e, "rotate")} onMouseLeave={(e) => this.resetCursor(e)}></span>

						<span className={"resize-handle right" + (this.isHorizontalScale() ? "" : " disabled") + (((this.props.transformStatus.get("resizing") || this.props.transformStatus.get("rotating")) && this.selectionBox.handle === "right") || this.props.isToolCropping ? " active" : "") + ((selectionBounds.height * this.props.zoomFactor) > 60 ? "" : " hide-handle")} data-handle="right" onMouseDown={this.initiateResize} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>

						<span className={"resize-handle bottom-left" + (((this.props.transformStatus.get("resizing") || this.props.transformStatus.get("rotating")) && this.selectionBox.handle === "bottom-left") || this.props.isToolCropping ? " active" : "")} data-handle="bottom-left" onMouseDown={this.initiateResize} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
						<span className={"rotate-handle bottom-left" + (this.props.selectedItems.size === 0 ? " disabled" : "")} data-handle="bottom-left" onMouseDown={this.initiateRotate} onMouseEnter={(e) => this.setCursor(e, "rotate")} onMouseLeave={(e) => this.resetCursor(e)}></span>

						<span className={"resize-handle bottom" + (this.isVerticalScale() ? "" : " disabled") + ((this.props.transformStatus.get("resizing")) && this.selectionBox.handle === "bottom" ? " active" : "") + ((selectionBounds.width * this.props.zoomFactor) > 60 ? "" : " hide-handle")} data-handle="bottom" onMouseDown={this.initiateResize} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>

						<span className={"resize-handle bottom-right" + (((this.props.transformStatus.get("resizing") || this.props.transformStatus.get("rotating")) && this.selectionBox.handle === "bottom-right") || this.props.isToolCropping ? " active" : "")} data-handle="bottom-right" onMouseDown={this.initiateResize} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
						<span className={"rotate-handle bottom-right" + (this.props.selectedItems.size === 0 ? " disabled" : "")} data-handle="bottom-right" onMouseDown={this.initiateRotate} onMouseEnter={(e) => this.setCursor(e, "rotate")} onMouseLeave={(e) => this.resetCursor(e)}></span>
						{(this.props.selectedItems.size > 0) ? <span className={"rotate-handle bottom" + ((this.props.transformStatus.get("resizing") || this.props.transformStatus.get("rotating")) && this.selectionBox.handle === "bottom" ? " active" : "")} data-handle="bottom" onMouseDown={this.initiateRotate} onMouseEnter={(e) => this.setCursor(e, "rotate")} onMouseLeave={(e) => this.resetCursor(e)}></span> : null}

						<span className={"resize-handle left" + (this.isHorizontalScale() ? "" : " disabled") + ((this.props.transformStatus.get("resizing") || this.props.transformStatus.get("rotating")) && this.selectionBox.handle === "left" ? " active" : "") + ((selectionBounds.height * this.props.zoomFactor) > 60 ? "" : " hide-handle")} data-handle="left" onMouseDown={this.initiateResize} onMouseEnter={(e) => this.setCursor(e, "resize")} onMouseLeave={(e) => this.resetCursor(e)}></span>
					</div>
				</div> 
			</React.Fragment>
		)
	}
}

export default TransformManagerComponent