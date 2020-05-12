import React, { Component } from 'react';

class TodoList extends Component{
    render() {
        return (
            <h1>{this.props.store.todos[0]}</h1>
        );
    }
}

export default TodoList