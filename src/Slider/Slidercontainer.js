import React, { Component } from 'react';
import Slider from "../Slider/Slider.js";

class SliderContainer extends Component {
    render() {
        return (
             <Slider min={0} max={100} step={25} orientation="horizontal"  value={40} width={300}/>
        );
    }
}

export default SliderContainer