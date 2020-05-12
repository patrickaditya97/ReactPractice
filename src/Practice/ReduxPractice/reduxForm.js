import React from 'react';

class ReduxForm extends React.Component {
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text"/>
                </form>
            </div>
        );
    }
}