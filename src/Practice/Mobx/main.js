import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import TodoList from "./todoList";
import store from "./todoStore";

ReactDOM.render(<TodoList store={store}/>, document.getElementById('root'))