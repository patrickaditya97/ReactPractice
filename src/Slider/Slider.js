import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Slider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            style: {
                left: 0,
                width: 0
            },
            popUpDisplay: "none",
            value: 0,
            orignalSliderValue: 0,
            initailValueFromBackEnd: 0
        }

        this.sliderContainer = React.createRef();
        this.slideOver = React.createRef();
        this.slideUnder = React.createRef();
        this.sliderHandle = React.createRef();
        this.sliderPopupValue = React.createRef();

    }

    componentDidMount() {

        this.setState({
            initailValueFromBackEnd: this.props.value
        }, () => {
            this.changeRange()
        })

    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {

            let { value, orignalSliderValue } = { ...this.state }
            value = (this.props.value - this.props.min)
            orignalSliderValue = this.props.value

            this.setState({
                value: value,
                orignalSliderValue: orignalSliderValue
            })

        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.popUpDisplay !== nextState.popUpDisplay) return true
        if (nextProps.value !== this.props.value) return true
        if (this.state.value !== nextState.value) return true;

        return false
    }

    changeRange = () => {

        let changingValue = this.state.initailValueFromBackEnd - this.props.min
        let valuePercent = (changingValue / (this.props.max - this.props.min)) * 100
        let sliderPercent = this.slideUnder.current.offsetWidth * (valuePercent / 100)

        let { style } = { ...this.state }
        style.left = sliderPercent
        style.width = sliderPercent

        this.setState({
            style: style,
            initailValueFromBackEnd: 0,
            value: changingValue,
        }, this.orignalSliderValue(changingValue))
    }


    // getValue = (e) => {

    //     let rect = this.slideUnder.current.getBoundingClientRect()
    //     let xValue = e.clientX - rect.x;
    //     let max = this.props.max
    //     let min = this.props.min
    //     let step = this.props.step

    //     if (xValue < 0) {
    //         xValue = 0
    //     }
    //     else if (xValue > this.slideUnder.current.offsetWidth) {
    //         xValue = this.slideUnder.current.offsetWidth
    //     }

    //     var percentageVal = (xValue / this.slideUnder.current.offsetWidth) * (max - min);
    //     var distVal = Math.floor((percentageVal / step));
    //     let realVal

    //     if ((percentageVal % step) > (step / 2) || (percentageVal % step) === (step / 2)) {
    //         realVal = ((distVal + 1) * step)
    //     }
    //     else if ((percentageVal / 2) < (step / 2) || e.clientX < 0) {
    //         realVal = 0
    //     }
    //     else if ((percentageVal % step) < (step / 2)) {
    //         realVal = ((distVal + 1) * step) - step
    //     }
    //     else if (e.clientX > rect.right) {
    //         realVal = 100
    //     }
    //     else {
    //         realVal = this.state.value
    //     }

    //     this.setState({
    //         value: realVal
    //     }, this.orignalSliderValue(realVal))
    // }



    orignalSliderValue = (value) => {
        console.log(value);
        
        let { orignalSliderValue } = { ...this.state }

        // if (value !== this.props.max) {
        orignalSliderValue = value + this.props.min
        // }
        // else {
        //     orignalSliderValue = this.props.max
        // }
        
        this.setState({
            orignalSliderValue: (orignalSliderValue < 0) ? -Math.abs(orignalSliderValue.toFixed(1)) : Math.abs(orignalSliderValue.toFixed(1))
        },
            () => {
                this.sliderPopupValue.current.innerHTML = this.state.orignalSliderValue
            }
        )
        if (this.props.onMouseDown) {
            this.props.onMouseDown(orignalSliderValue, this.props.type)
        }
    }

    sliderDragStart = (e) => {

        let rect = this.slideUnder.current.getBoundingClientRect()
        let sliderDist = e.clientX - rect.x
        let step = this.props.step
        let min = this.props.min
        let max = this.props.max

        let sliderDistPercent = sliderDist / this.slideUnder.current.offsetWidth * (max - min)
        var distVal = Math.floor(sliderDistPercent / step);
        let realVal

        if ((sliderDistPercent % step) > (step / 2) || (sliderDistPercent % step) === (step / 2)) {
            realVal = ((distVal + 1) * step)
        }
        else if ((sliderDistPercent % step) < (step / 2)) {
            realVal = ((distVal + 1) * step) - step
        }
        else {
            realVal = 0
        }

        let { value, popUpDisplay } = { ...this.state }
        value = realVal
        popUpDisplay = "block"

        this.setState({
            value: value,
            popUpDisplay: popUpDisplay
        }, this.orignalSliderValue(realVal))

        window.addEventListener('mousemove', this.sliderDragMove)
        window.addEventListener('mouseup', this.sliderDragEnd)
    }

    handleDragStart = (e) => {

        let { popUpDisplay } = { ...this.state }
        popUpDisplay = "block"

        this.setState({
            popUpDisplay: popUpDisplay
        },
            () => {
                this.sliderPopupValue.current.innerHTML = this.state.orignalSliderValue
            }
        )

        e.stopPropagation()
        window.addEventListener('mousemove', this.sliderDragMove)
        window.addEventListener('mouseup', this.sliderDragEnd)
    }

    sliderDragMove = (e) => {
        e.stopPropagation()

        let rect = this.slideUnder.current.getBoundingClientRect()
        let xValue = e.clientX - rect.x;

        if (xValue < 0) {
            xValue = 0
        }
        else if (xValue > this.slideUnder.current.offsetWidth) {
            xValue = this.slideUnder.current.offsetWidth
        }

        let max = this.props.max
        let min = this.props.min
        let step = this.props.step
        var percentageVal = (xValue / this.slideUnder.current.offsetWidth) * (max - min);
        var distVal = Math.floor(percentageVal / step);
        let realVal

        if ((percentageVal) > this.state.value + (step / 2) || (percentageVal % step) === (step / 2)) {
            realVal = ((distVal + 1) * step)
        }
        else if ((percentageVal) < this.state.value - (step / 2)) {
            realVal = ((distVal + 1) * step) - step
        }
        else {
            realVal = this.state.value
        }

        this.setState({
            value: realVal
        }, this.orignalSliderValue(realVal))
    }


    sliderDragEnd = () => {
        // console.log("Ended drag")

        let { popUpDisplay } = { ...this.state }
        popUpDisplay = "none"

        this.setState({
            popUpDisplay: popUpDisplay
        })

        if (this.props.onMouseUp) {
            let opacityMouseUpVal = (this.state.orignalSliderValue) ? this.state.orignalSliderValue : ''
            this.props.onMouseUp(opacityMouseUpVal / 100)
        }

        window.removeEventListener('mousemove', this.sliderDragMove)
        window.removeEventListener('mouseup', this.sliderDragEnd)
    }


    render() {

        let slideOverWidthValue = (this.state.value / (this.props.max - this.props.min)) * this.props.width
        let slideOverWidth = (slideOverWidthValue < this.props.width) ? slideOverWidthValue : this.props.width

        // let slideOverLeftWidth = (this.props.width/2) - slideOverWidth
        // (slideOverWidth < (this.props.width / 2))? (slideOverWidth % (this.props.width / 2)) + 'px' : 0 + 'px'

        let slider = [];

        (!this.props.doubleSide) ? slider.push(

            <div key='1' className="SliderContainer" style={{ width: this.props.width + 'px' }} ref={this.sliderContainer} onMouseDown={(e) => this.sliderDragStart(e)} step={this.props.step} value={this.state.orignalSliderValue} >

                <span className="horizontal-sliderpopup-container" style={{ userSelect: 'none', position: "absolute", top: -30, left: (slideOverWidth - 200 / 10) + 'px', display: this.state.popUpDisplay }}>
                    <p className="sliderpopup-value" ref={this.sliderPopupValue}></p>
                </span>

                <div className="slideOver" ref={this.slideOver} id="slideOver" style={{ userSelect: 'none', width: slideOverWidth + 'px', backgroundColor: this.props.slideOverColor }} ></div>

                <div className="slideUnder" ref={this.slideUnder} id="slideUnder" style={{ userSelect: 'none', backgroundColor: this.props.slideUnderColor }}></div>

                <span className="sliderHandle" ref={this.sliderHandle} id="sliderHandle" style={{ userSelect: 'none', left: (slideOverWidth - 10) + 'px', backgroundColor: this.props.thumbColor }} onMouseDown={(e) => this.handleDragStart(e)}></span>

            </div>

        )
            : slider.push(

                <div key='2' className="divContainer" ref={this.slideUnder} id="slideUnder" onMouseDown={(e) => this.sliderDragStart(e)} step={this.props.step} value={this.state.orignalSliderValue} style={{ width: this.props.width + 'px', userSelect: 'none', backgroundImage: `linear-gradient(to left, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%)` }}>

                    <span className="horizontal-sliderpopup-container" style={{ userSelect: 'none', position: "absolute", top: -30, left: (slideOverWidth - 200 / 10) + 'px', display: this.state.popUpDisplay }}>
                        <p className="sliderpopup-value" ref={this.sliderPopupValue}></p>
                    </span>

                    <div className="left">
                        <div className="leftSlideOver" style={{ userSelect: 'none', width: ((slideOverWidth < (this.props.width / 2)) ? (this.props.width / 2) - slideOverWidth : 0) + 'px', backgroundColor: this.props.slideOverColor }} ></div>
                    </div>

                    <div className="right">
                        <div className="rightSlideOver" style={{ userSelect: 'none', width: ((slideOverWidth > (this.props.width / 2)) ? Math.abs(this.props.width / 2 - slideOverWidth) : 0) + 'px', backgroundColor: this.props.slideOverColor }}></div>
                    </div>

                    <div className="thumb" ref={this.sliderHandle} id="sliderHandle" style={{ userSelect: 'none', left: (slideOverWidth - 10) + 'px', backgroundColor: this.props.thumbColor }} onMouseDown={(e) => this.handleDragStart(e)}></div>

                </div>

            )


        return (
            slider
        );
    }
}

Slider.defaultProps = {
    orientation: "horizontal",
    step: 1,
    doubleSide: false
}

Slider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    width: PropTypes.number,
    value: PropTypes.number,
    doubleSide: PropTypes.bool,
    orientation: PropTypes.string,
    thumbColor: PropTypes.string,
    slideUnderColor: PropTypes.string,
    slideOverColor: PropTypes.string,
}


export default Slider