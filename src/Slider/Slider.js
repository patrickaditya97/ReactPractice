import React, { Component } from 'react';

class Slider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            style: {
                left: 0, 
                width: 0
            }, 
            sliderDimensions: null,
            value: 0,
            initailValue:0
        }

        this.slideUnderWidth = 0
        this.sliderContainer = React.createRef();
        this.slideOver = React.createRef();
        this.slideUnder = React.createRef();
        this.sliderHandle = React.createRef();
    }

    componentDidMount(){
        this.setState({ 
            sliderDimensions : { 
                width: this.slideUnder.current.offsetWidth
            } 
        })
    }

    changeRange = () => {
        console.log("changing");

        let xValue = this.state.initailValue
        let valuePercent = (xValue / (this.props.max - this.props.min)) * 100
        let sliderPercent =  this.state.sliderDimensions.width * (valuePercent/100)

        let style = {...this.state.style}
        style.left = sliderPercent
        style.width = sliderPercent

        console.log(style);

        this.setState({
            style: style,
            initailValue:0,
            value: xValue
        })
        
    }

    getValue = (e) => {

        // console.log(this.props);
        let rect = this.slideUnder.current.getBoundingClientRect()
        let xValue = e.clientX - rect.x;
        
        if(xValue < 0)
        {
            xValue = 0
        }
        else if(xValue > this.slideUnderWidth)
        {
            xValue = this.slideUnderWidth
        }

        let max = this.props.max
        let min = this.props.min
        let step = this.props.step

        var ow = ( xValue / this.slideUnder.current.offsetWidth ) * ( max - min );
        var dv = Math.floor( ( ow / step ));

        let rv = ((ow % step) > (step/2)) ? ((dv +1) * step) : this.state.value
        

        this.setState({ value: rv  }, () => { console.log(this.state.value, dv, ow, rv) })

        // var ow = ( xValue / this.slideUnder.current.offsetWidth ) * ( max - min );
        // // var dv = Math.floor( ( ow / (step/2) ));
        // var dv = (Math.floor(ow) % step)
        // console.log("jhsga ", dv, ow)
        // if(dv > step/2) {
        //     this.setState({ value: Math.round(ow / step) })
        // }
        // // this.setState({ value: (dv % 2 === 1) ? Math.round(dv/2) * step : this.state.step  });

    }

    // getValue = (e) => {

    //     // console.log(this.props);
    //     let rect = this.slideUnder.current.getBoundingClientRect()
    //     let xValue = e.clientX - rect.x;
        
    //     if(xValue < 0)
    //     {
    //         xValue = 0
    //     }
    //     else if(xValue > this.slideUnderWidth)
    //     {
    //         xValue = this.slideUnderWidth
    //     }

    //     let max = this.props.max
    //     let min = this.props.min
    //     // let step = this.props.step

    //     var ow = ( xValue / this.slideUnder.current.offsetWidth ) * ( max - min );
    //     var dv = Math.floor( ( ow / this.props.step ));

    //     this.setState({ value: dv * this.props.step  })

    // }

    sliderDragStart = (e) => {
        console.log("started drag")

        // this.slideUnderWidth = this.slideUnder.current.getBoundingClientRect().width

        // let mousePosition = e.clientX - this.slideOver.current.getBoundingClientRect().x
        // let newStyle = {...this.state.style}
        // newStyle.left = mousePosition
        // newStyle.width = mousePosition
        // this.setState({
        //     style: newStyle
        // })

        
        this.getValue(e)
        window.addEventListener('mousemove', this.sliderDragMove)
        window.addEventListener('mouseup', this.sliderDragEnd)
    }

    handleDragStart = (e) => {
        console.log("handle drag");

        this.slideUnderWidth = this.slideUnder.current.getBoundingClientRect().width

        e.stopPropagation()

        window.addEventListener('mousemove', this.sliderDragMove)
        window.addEventListener('mouseup', this.sliderDragEnd)
    }

    sliderDragMove = (e) => {
        console.log("dragging")
        e.stopPropagation()

        let xValue;
        let rect = this.slideUnder.current.getBoundingClientRect()
        
        xValue = e.clientX - rect.x;
        
        if(xValue < 0)
        {
            xValue = 0
        }
        else if(xValue > this.slideUnderWidth)
        {
            xValue = this.slideUnderWidth
        }
        

        this.getValue(e)

        // var ow = ( xValue / this.slideUnder.current.offsetWidth ) * 100;
        // var dv = Math.floor( ( ow ) * this.props.step );
        // var mod = ow % this.props.step;
        // console.log(ow, dv, mod);
        // let newStyle = {...this.state.style}
        // let mousePosition = xValue
        // newStyle.left = pixelDist
        // newStyle.width = pixelDist
        // console.log(e.clientX % pixelDist, pixelDist);
        // this.setState({
        //     style: newStyle
        // })





        // let sliderWidth = this.slideUnder.current.offsetWidth
        // let step = this.props.step
        // let max = this.props.max
        // let min = this.props.min
        // let stepPercent = step/ (max - min)
        // let pixelDist = stepPercent * sliderWidth
    }
    
    
    sliderDragEnd = () => {
        console.log("Ended drag")

        window.removeEventListener('mousemove', this.sliderDragMove)
        window.removeEventListener('mouseup', this.sliderDragEnd)
    }


    render() {
        
        // let slider = (this.props.orientation === 'horizontal')
        // ? <input type="range" className="Slider Slider-Horizontal" min={this.props.min} max={this.props.max} step={this.props.step}  onMouseDown={this.handleDragStart}/>
        // : <input type="range" className="Slider Slider-Vertical" min={this.props.min} max={this.props.max} step={this.props.step} onMouseDown={this.handleDragStart}/>
        
        let {sliderDimensions, initailValue} = this.state
        { ( sliderDimensions && initailValue ) && this.changeRange() }


        let slideOverWidth = (this.state.value / (this.props.max - this.props.min)) * this.props.width
        // console.log(this.state.value, this.props.width, slideOverWidth);
        
        
        return (
            <div style={{ margin: 100 +'px' }}>

                <div className="SliderContainer" style={{ width: this.props.width +'px'}} ref={this.sliderContainer} onMouseDown={(e) => this.sliderDragStart(e)} value={this.state.value} >
                    <div className="slideOver" ref={this.slideOver} id="slideOver" style={{width: slideOverWidth + 'px'}} ></div>
                    <div className="slideUnder" ref={this.slideUnder} id="slideUnder" ></div>
                    <span className="sliderHandle" ref={this.sliderHandle} id="sliderH{andle}" style={{left: (slideOverWidth- 10) + 'px'}} onMouseDown={(e) => this.handleDragStart(e)} onMouseMove={(e) => e.stopPropagation()}></span>
                </div>

            </div>
        );
    }
}

export default Slider