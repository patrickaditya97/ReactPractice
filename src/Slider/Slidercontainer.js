import React, { Component } from 'react';
import Slider from "../Slider/Slider.js";

class SliderContainer extends Component {
    render() {
        return (
            <div style={{ margin: 100 + 'px'}}>

                <Slider min={-1} max={1} step={0.1} value={0} width={300} doubleSide={true} slideUnderColor="#eff2f4" slideOverColor="#ffc524" thumbColor="#8e72e4" />

            </div>
        );
    }
}

export default SliderContainer