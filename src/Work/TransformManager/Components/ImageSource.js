import React from 'react';
import { useDispatch } from "react-redux";
import { useDrag, DragPreviewImage } from "react-dnd";
import {CustomDragLayer} from './CustomDragLayer'

export const ItemTypes = {
	IMAGE: 'image',
	PROP: 'props'
}

export default function ImageSource(props) {

	const dispatch = useDispatch()
	const [{ isDragging }, drag, preview] = useDrag({
		item: {
			type: ItemTypes.IMAGE,
			imageId: props._ID
		},
		begin: (monitor) => {
			dispatch({type: 'ITEM_DRAGGING'})
			return{ 
				type: ItemTypes.IMAGE,
				imageId: props._ID,
				src: props.img,
				coord: monitor.getInitialClientOffset()
			}
		},
		end: () => {
			dispatch({type: 'IMAGE_NOT_DROPPED'})
		},
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	})
	
	return (
		<>
			{/* <CustomDragLayer source={props.img} /> */}
			<DragPreviewImage  connect={preview} src={props.img}/>
			<img ref={drag} alt="imageSrc" src={props.img} width={153} height={102} style={{ opacity: isDragging ? 0 : 1, display: isDragging? 'none': '' }} />
		</>
	)

}