import React, { Component } from 'react';
import styled from 'styled-components';
import { calculateAspectRatio } from "../Helpers/FramesHelper"
import { useDrop } from "react-dnd"
import { ItemTypes } from "./ImageSource"


export const SVG = styled.svg`
    overflow: visible;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
`

function ReturnSVG(props) {
	return (
		<div>
			<SVG width={588} height={472}>
				<path d={props.d} fill={props.fill} stroke={props.stroke} />
			</SVG>
		</div>
	)
}

function ReturnClip(props) {
	return (
		<clipPath id={props.id}>
			<path d={props.d} />
		</clipPath>
	)
}

function DroppableClip(props) {
	
	const [{isOver}, drop] = useDrop({
		accept: ItemTypes.IMAGE,
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		})
	})
	
	console.log(isOver);
	

	return (
		<div ref={drop}>
			{!isOver? <SVG width={588} height={472}>
				<defs>
					{ props.clip }
				</defs>
			</SVG>
			: <div></div>}
		</div>
	)
}

class FramesComponent extends Component {

	constructor(props) {
		super(props);

		this.state = {}

		this.frameItem = this.props.workspaceItems.get(this.props.src)

		this.returnImages = this.returnImages.bind(this)
	}

	componentDidMount() {
		this.setState({
			src: this.props.src
		}, () => {

			this.frameItem.get('clipDetails').forEach((item, key) => {

				let {width, height, X, Y} = calculateAspectRatio(this.frameItem, key);
				
				let x = X, y = Y
				
				let imgDetails ={
					id: 'modified',
				}
				let original = {
					x, 
					y,
					width,
					height
				}
				
				const originalData = {
					clip: key,
					imgDetails,
					original, 
					selectedItems: this.props.selectedItems
				}

				this.props.cropImage(originalData)
			})	

		})


	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.selectedItems.get(0) === this.state.src) return true
		if (nextProps.workspaceItems.getIn([this.props.selectedItems.get(0), 'imgDetails', 'id']) !== 'default') return true

		return false

	}

	returnImages() {

		const DIV = styled.div`
            position: absolute;
            width: 100%;
            height: 100%;
        `

		const IMG = styled.img`
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
        `

		let frameImage = []

		this.frameItem.get('clipDetails').forEach((item, key) => {


			let imageWidth = this.frameItem.get("width") * item.getIn(['imgDetails', 'original', 'width'])
			let imageHeight = this.frameItem.get("height") * item.getIn(['imgDetails', 'original', 'height'])

			let imageX = this.frameItem.get("width") * item.getIn(['imgDetails', 'original', 'x'])
			let imageY = this.frameItem.get("height") * item.getIn(['imgDetails', 'original', 'y'])

			frameImage.push(
				<DIV style={{ clipPath: `url(#${key})` }} key={key}>
					<div style={{ position: 'relative', width: imageWidth, height: imageHeight, transform: `translate(${imageX}px, ${imageY}px)` }}>
						<IMG ref={this.frameImage} src={item.getIn(['imgDetails', 'src'])} />
					</div>
				</DIV>
			)


		})

		return frameImage

	}

	render() {
		
		this.frameItem = this.props.workspaceItems.get(this.props.src)

		let svg = [], clip = []

		this.frameItem.get('d').forEach((item, key) => {

			svg.push(<ReturnSVG key={key} d={item.get('path')} fill={item.get('fill')} stroke={item.get('stroke')} />)

		})

		this.frameItem.get('clipDetails').forEach((item, key) => {

			clip.push(<ReturnClip key={key} id={key} d={item.get('clipData')} />)

		})

		return(
			<div className={this.props.src + 1} style={{ width: `${this.frameItem.get('width')}px`, height: `${this.frameItem.get('height')}px`, transform: `scale(1)` }}>

				<DroppableClip clip={clip}/>

				{ svg }

				{this.returnImages()}

			</div>
		);
	}

}

export default FramesComponent;


import React, { Component } from 'react';
import { useDrag } from "react-dnd";

// function collect(connect, monitor) {
//     return{ 
//         connectDragSource: connect.dragSource(),
//         connectDragPreview: connect.dragPreview(),
//         isDragging: monitor.isDragging()
//     }
// }

// const itemSource = {
//     beginDrag(props){
//         console.log('dragging')
//         return {urls: props.img}
//     },
//     endDrag(props, monitor, component){
//         if (!monitor.didDrop()) {
//             return;
//         }
    
//         return props.handleDrop(props.img);
//     }
// }

// class ImageSource extends Component {
    
//     render() {

//         const {connectDragSource, isDragging, item} = this.props;

//         return connectDragSource(
//             <img alt="imageSrc" src={this.props.img} width={100} height={100}/> 
//         );
//     }

// }

// export default DragSource('item', itemSource, collect)(ImageSource)

export const ItemTypes = {
    IMAGE: 'image',
}

export default function ImageSource(props){

    const [{isDragging, id}, drag] = useDrag({
        item: {type: ItemTypes.IMAGE},
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
            id: props._ID,
        })
    })

    console.log(isDragging, id);
    
    return(
        <img ref={drag} alt="imageSrc" src={props.img} width={100} height={100} style={{opacity: isDragging? 0: 1}}/> 
    )

}