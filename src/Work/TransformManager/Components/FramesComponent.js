import React, { Component } from 'react';
import styled from 'styled-components';
import { calculateAspectRatio } from "../Helpers/FramesHelper"
import { useDrop } from "react-dnd"
import { useDispatch } from "react-redux"
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

function DroppableTarget(props) {
	
	let previewImageStyleRatio;
	const imgref = React.useRef();
	const imageContainer = React.useRef();

	const dispatch = useDispatch()
	const [{isOver}, drop] = useDrop({
		accept: [
			ItemTypes.IMAGE, ItemTypes.PROP
		],
		drop: (item, monitor) => {
			
			const {width, height, X, Y} = previewImageStyleRatio

			const original = {
				x: X,
				y: Y,
				width: width,
				height: height
			}

			const ImageData = {
				original: original,
				libraryItem: props.library.get(item.imageId), 
				clip: props.clip,
				selectedItem: props.selectedItem
			}

			dispatch({type: 'IMAGE_DROPPED', ImageData})


		},
		hover: (item) => {
			if (props.library.get(item.imageId)) {
				imgref.current.src = props.library.getIn([item.imageId, 'thumbnail'])
				const { clip, FrameDetails } = props
				
				previewImageStyleRatio = calculateAspectRatio( FrameDetails, props.library.get(item.imageId), clip)
	
				const {width, height, X, Y} = previewImageStyleRatio
	
				imageContainer.current.style.width = `${FrameDetails.get("width") * width}px`
				imageContainer.current.style.height = `${FrameDetails.get("height") * height}px`
				imageContainer.current.style.transform =  `translate(${FrameDetails.get("width") * X}px, ${FrameDetails.get("height") * Y}px)`				
			}
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
			isOverCurrent: !!monitor.isOver({shallow: true})
		})
	})
		
	const ImageStyle = !isOver? { 
		position: 'relative', 
		width: props.width, 
		height: props.height, 
		transform: `translate(${props.x}px, ${props.y}px)` 
	} : null

	const Source = (props.src !== "")? props.src: props.defaultSrc
	const ImgSrc = !isOver? Source: null

	return (
		<DIV ref={drop} style={{ clipPath: `url(#${props.clip})` }}>
			<div style={ImageStyle} ref={imageContainer} >
				<IMG src={ImgSrc} ref={imgref}/>
			</div>
		</DIV>
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

				if (item.getIn(['imgDetails', 'src']) === "") {
					
					let Image = item.getIn(['imgDetails', 'defaultImageDetails'])

					let {width, height, X, Y} = calculateAspectRatio(this.frameItem, Image, key);
					
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

				}

			})	

		})


	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextProps.selectedItems.get(0) === this.state.src) return true
		if (nextProps.workspaceItems.getIn([this.props.selectedItems.get(0), 'imgDetails', 'id']) !== 'default') return true

		return false

	}

	returnImages() {

		let frameImage = []

		this.frameItem.get('clipDetails').forEach((item, key) => {


			let imageWidth = this.frameItem.get("width") * item.getIn(['imgDetails', 'original', 'width'])
			let imageHeight = this.frameItem.get("height") * item.getIn(['imgDetails', 'original', 'height'])

			let imageX = this.frameItem.get("width") * item.getIn(['imgDetails', 'original', 'x'])
			let imageY = this.frameItem.get("height") * item.getIn(['imgDetails', 'original', 'y'])
			
			frameImage.push(
				<DroppableTarget 
					key={key} 
					clip={key} 
					FrameDetails={this.frameItem} 
					library={this.props.library} 
					selectedItem={this.props.selectedItems.get(0)}
					item_id={key} 
					width={imageWidth} 
					height={imageHeight} 
					x={imageX} 
					y={imageY} 
					src={item.getIn(['imgDetails', 'src'])}
					defaultSrc={item.getIn(['imgDetails', 'defaultImageDetails', 'src'])}/>
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

				<SVG width={588} height={472}>
					<defs>
						{ clip }
					</defs>
				</SVG>

				{ svg }

				{ this.returnImages() }
				

			</div>
		);
	}

}

export default FramesComponent;