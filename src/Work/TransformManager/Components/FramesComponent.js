import React, { Component } from 'react';
import styled from 'styled-components';
import { calculateAspectRatio } from "../Helpers/FramesHelper"

export function ReturnSVG(props) {

    const SVG = styled.svg`
        overflow: visible;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    `

    let svgContents

    if (props.type === 'd') {
        svgContents = <path d={props.d}/>
    } else if(props.type === 'clip') {
        svgContents = <defs>
                          <clipPath id={props.id}>
                            <path d={props.d}/>
                          </clipPath>
                      </defs>
    }

    return (
        <SVG viewBox={`0 0 ${props.width} ${props.height}`}>
            {svgContents}
        </SVG>
    )
    
}

class FramesComponent extends Component{

    constructor(props){
        super(props);

        this.state = {
        
        }

        this.frameItem = this.props.workspaceItems.get(this.props.src)

    }

    componentDidMount () {
        this.setState({ 
            src: this.props.src
        }, () => {
            let {width, height, X, Y} = calculateAspectRatio(this.frameItem);
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
                imgDetails,
                original, 
                selectedItems: this.props.selectedItems
            }
    
            this.props.cropImage(originalData)
        })
        
        
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.selectedItems.get(0) === this.state.src) return true
        if(nextProps.workspaceItems.getIn([this.props.selectedItems.get(0), 'imgDetails', 'id']) !== 'default') return true

        return false
        
    }

    render() {

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


        this.frameItem = this.props.workspaceItems.get(this.props.src)
        // console.log(this.frameItem.toJS());
        
        let imageWidth  = this.frameItem.getIn(['imgDetails', 'width']) * this.frameItem.getIn(['original', 'width'])
        let imageHeight = this.frameItem.getIn(['imgDetails', 'height']) * this.frameItem.getIn(['original', 'height'])
        
        let imageX = this.frameItem.getIn(['imgDetails', 'width']) * this.frameItem.getIn(['original', 'x'])
        let imageY = this.frameItem.getIn(['imgDetails', 'height']) * this.frameItem.getIn(['original', 'y'])
        
        return (
            <div className={this.props.src + 1} style={{ width: `${this.frameItem.get('width')}px`, height: `${this.frameItem.get('height')}px`, transform: `scale(1)` }}>
                <ReturnSVG key={"azh" + Math.round(Math.random() * 20)+1} d={this.frameItem.getIn(['src', 'clip_d'])} type={'clip'} width={this.frameItem.get('width')} height={this.frameItem.get('height')} id={this.frameItem.get('id')} />

                <ReturnSVG key={"bzk" + Math.round(Math.random() * 20)} d={this.frameItem.getIn(['src', 'd'])} type={'d'} width={this.frameItem.get('width')} height={this.frameItem.get('height')} />

                {
                    (!this.props.isFraming)
                    
                        ? <DIV style={{ clipPath: `url(#${this.frameItem.get('id')})` }}>
                            <div style={{ position: 'relative', width: imageWidth, height: imageHeight, transform: `translate(${imageX}px, ${imageY}px)` }}>
                                <IMG ref={this.frameImage} src={this.frameItem.getIn(['imgDetails', 'src'])} />
                            </div>
                        </DIV>

                        : null
                }

            </div>
        );
    }

}

export default FramesComponent;