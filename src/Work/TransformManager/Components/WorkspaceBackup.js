import React, { Component } from 'react';
import TransformManager from "../containers/TransformManager";
import Frames from "../containers/Frames";
import FrameImage from "../containers/FrameImage";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import ImageSource from './ImageSource'

function ReturnImages(props){
    let Images = []

    props.library.forEach((item, index) => {
        Images.push(
            <ImageSource key={index} img={item.get('thumbnail')} _ID={item.get('id')} />
        )
    })

    return Images
}


class WorkspaceComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.style.width,
            height: this.props.style.height,
            x: (window.innerWidth / 2) - (this.props.style.width / 2),
            y: (window.innerHeight / 2) - (this.props.style.height / 2),
        };
        this.centerElement = this.centerElement.bind(this);
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.cropping.bind(this));
        window.addEventListener('resize', this.centerElement)
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.centerElement)
    }

    cropping() {
        if (this.props.isCropping) {
            this.props.toggleCrop()
        }
    }

    centerElement() {

        let X = 0, Y = 0
        X = (window.innerWidth / 2) - (this.state.width / 2)
        Y = (window.innerHeight / 2) - (this.state.height / 2)

        this.setState({ x: X, y: Y })

    }

    render() {

        const items = this.props.workspaceItems;
        let itemArray = [];
        let workspaceX = this.props.workspaceBounds.get("cx") - (this.props.workspaceWidth * this.props.zoomFactor) / 2,   
            workspaceY = this.props.workspaceBounds.get("cy") - (this.props.workspaceHeight * this.props.zoomFactor) / 2;
        const divStyle = {
            position: 'absolute',
            top: `${workspaceY}px`,
            left: `${workspaceX}px`,
            width: this.state.width + 'px',
            height: this.state.height + 'px',
            backgroundColor: 'beige'
        }
        

        items.forEach((styleInState, index) => {

            const style = {
                width: styleInState.get('width') + 'px',
                height: styleInState.get('height') + 'px',
                transform: `translate(${styleInState.get('x')}px, ${styleInState.get('y')}px) rotate(${styleInState.get('angle')}deg)`,
                userSelect: 'none',
                position: 'absolute',
                display: 'inline-block'
            }

            let draggableItem

            if (styleInState.get('type') === 'IMG') {
                
                draggableItem = <div className="dragThis" key={index + 1} style={style} id={index}>
                                    <img alt="test" src={styleInState.get('src')} style={{pointerEvents: 'none', width: '100%', height: '100%'}}/>
                                </div>
                                        
            } else if (styleInState.get('type') === 'FRAME') {
    
                    draggableItem = <div key={index + 1} style={style} id={index}>
                                        <Frames src={index}/>
                                    </div>
                    
            } else {
                draggableItem = <div className="dragThis" key={index + 1} style={style} id={index}>
                                    {this.state.svgElement}
                                </div>
            }


            itemArray.push(draggableItem)

        })

        return (
            <DndProvider backend={HTML5Backend}>
                
                <div style={divStyle} className="workspace" id="workspace">
                    {itemArray}

                    {(!this.props.isFraming)? <TransformManager cornerResize = {true} />: null}

                    <div className="snap-line rotationLine" ></div>
                    <div className="snap-line rotationDisplay" >
                        <span id="rotationAngle"></span>
                    </div>
                    
                </div>

                { (this.props.isFraming)? <FrameImage />: null }
                
                <ReturnImages library={this.props.library}/>

            </DndProvider>
        );
    }
    
}

export default WorkspaceComponent