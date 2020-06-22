import React, { Component } from 'react';
import TransformManager from "../containers/TransformManager";
import Frames from "../containers/Frames";
import FrameImage from "../containers/FrameImage";
import axios from 'axios';
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
    }

    render() {

        const divStyle = {
            position: 'absolute',
            width: this.state.width + 'px',
            height: this.state.height + 'px',
            backgroundColor: 'beige'
        }

        let ItemArray = []
        this.props.library.forEach((value, key) => {
            console.log(value);
            
            ItemArray.push(
                <img key={key} alt={value.get('title')} src={value.get('src')} width={this.state.width/2} height={this.state.height}/>
            )
        })

        return (
            <div style={divStyle} className="workspace" id="workspace">
                {ItemArray}
            </div>
        );
    }
    
}

export default WorkspaceComponent