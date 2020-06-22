import React from "react";
import { useDragLayer } from "react-dnd";
import ImageSource from './ImageSource'

function getItemStyles(currentOffset) {
	if (!currentOffset) {
		return {
			display: "none",
		};
	}

	let { x, y } = currentOffset;

	const transform = `translate(${x}px, ${y}px)`;
	return {
		transform,
		WebkitTransform: transform,
	};
}

const layerStyles = {
	position: "fixed",
	pointerEvents: "none",
	zIndex: 100,
	left: 0,
	top: 0,
	width: "100%",
	height: "100%",
};

export const CustomDragLayer = (props) => {
	const {
		item,
		itemType,
		isDragging,
		initialOffset,
		currentOffset,
	} = useDragLayer((monitor) => ({
		item: monitor.getItem(),
		itemType: monitor.getItemType(),
		isDragging: monitor.isDragging(),
		initialOffset: monitor.getInitialSourceClientOffset(),
		currentOffset: monitor.getClientOffset(),
	}));

	function returnItem() {
		if (itemType === "image") {
			return (
				// <img alt="imageSrc" src={item.src} width={153} height={102} />
                <ImageSource key={'001'} img={item.src} _ID={item.imageId} />
			);
		} else {
			return null;
		}
	}

	if (!isDragging) {
		return null;
	}
	console.log({ item, itemType, isDragging, initialOffset, currentOffset });

	return (
		<div style={layerStyles}>
			<div style={getItemStyles(currentOffset)}>
                {returnItem()}
            </div>
		</div>
	);
};
