import React, { Component } from 'react';
import Slider from "../Slider/Slider.js";

class SliderContainer extends Component {

    handle = (val, type) => {
        console.log(val, type);
        
    }

    render() {
        return (
            <div style={{ margin: 100 + 'px'}}>

                <Slider min={5} max={100} step={5} value={5} width={300} slideUnderColor="#eff2f4" slideOverColor="#ffc524" thumbColor="#8e72e4"/>
                
            </div>
        );
    }
}

export default SliderContainer