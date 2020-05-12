import React, { Component } from 'react';

class DoubleSlider extends Component{

    constructor(props) {
        super(props);
        
        this.state = {
            leftStyle: 0,
            rightStyle: 0,
            value: 0
        }

        this.divContainer = React.createRef();
    }

    componentDidMount() {
        if(this.props.value !== undefined) {
            this.setState({ 
                value: this.props.value
            })
        }        
    }

    thumbDragStart = (e) => {

        console.log("drag start");

        window.addEventListener('mousemove', this.sliderDragMove)
        window.addEventListener('mouseup', this.sliderDragEnd)
    }

    sliderDragMove = (e) => {
        console.log("drag move");

        let rect = this.divContainer.current.getBoundingClientRect()
        let xValue = e.clientX - rect.x;

        if (xValue < 0) {
            xValue = 0
        }
        else if (xValue > this.divContainer.current.offsetWidth) {
            xValue = this.divContainer.current.offsetWidth
        }

        let {leftStyle, rightStyle} = { ...this.state }
        let side = (xValue < (this.divContainer.current.offsetWidth/2)) ? 'leftStyle' : 'rightStyle'

        // side = xValue
        
        this.setState({
            [side]: xValue
        })

    }

    sliderDragEnd = (e) => {
        console.log("drag end");

        window.removeEventListener('mousemove', this.sliderDragMove)
        window.removeEventListener('mouseup', this.sliderDragEnd)
    }

    render() {

        let sliderWidthValue = (this.state.value / (this.props.max - this.props.min)) * this.props.width
        let sliderWidth = (sliderWidthValue < this.props.width) ? sliderWidthValue : this.props.width

        return (
            <div className="divContainer" style={{margin: 100 + 'px'}} ref={this.divContainer}>
                <div className="left">
                    <div className="leftSlideOver" style={{ width: sliderWidth + 'px' }}></div>
                </div>
                <div className="right">
                    <div className="rightSlideOver" style={{ width: sliderWidth + 'px' }}></div>
                </div>
                <div className="thumb" style={{left: (this.state.left)-10 + 'px'}} onMouseDown={this.thumbDragStart}></div>
            </div>
        )
    }

}

export default DoubleSlider