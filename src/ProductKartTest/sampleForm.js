import React from 'react';

class SampleForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    inputOnChange = (e) => {
        
    }

    handleSubmit() {

    }

    render() {
        return (
            <div>
                <form onSubmit={() => this.handleSubmit}>
                    <input type="text" placeholder="category" />
                    <input type="text" placeholder="pName" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}