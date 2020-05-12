import React from "react";
import Canva from "../Images/Canva.png"
import background from "../Images/background.png"

class Frames extends React.Component {
    render() {
        return (
            <>
                <div style={{height: 200 + 'px', width: 200 + 'px', margin: "100px auto"}}>

                    <svg style={{position: 'absolute'}} width="200" height="200">
                        <defs>
                            <clipPath id="clip_01">
                                <path stroke="red" stroke-width="10px" class="path0" d="M0,0 C0,0 200,0 200,0 C200,0 200,200 200, 200 C200,200 0,200 0,200 C0,200 0,0 0,0" fill="none"></path>
                            </clipPath>
                        </defs>
                    </svg>

                    <div style={{clipPath: "url(#clip_01)", position: "absolute", height: 100 + '%', width: '100%'}}>
                        <div style={{transform: "translate(-57px, 0px)"}}>
                            <img alt="bg" src={Canva} style={{display:"block", width: '315px', height: '200px', position: 'absolute'}}/>
                        </div>
                    </div>
                    
                    <div>
                        <svg style={{position: 'absolute'}} width="200" height="200">
                            
                            <path stroke="red" stroke-width="10px" class="path0" d="M0,0 C0,0 200,0 200,0 C200,0 200,200 200, 200 C200,200 0,200 0,200 C0,200 0,0 0,0" fill="none"></path>
                            
                        </svg>
                    </div>

                    <svg style={{position: 'absolute'}} width="200" height="200">
                        <use href="#clip_01"></use>
                    </svg>


                </div>

            </>
        );
    }
}

export default Frames; 