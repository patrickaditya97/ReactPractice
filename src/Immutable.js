import React from 'react';
const { Map, List } = require('immutable');

class Draggable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Map({
                items: List([{
                    width: 80,
                    height: 80,
                    x: 0,
                    y: 0
                }, {
                    width: 100,
                    height: 100,
                    x: 80,
                    y: 80
                }])
            })
        };

        this.index = 0
        this.beforeMouseDown = { x: 0, y: 0 }
        this.position = { x: 0, y: 0 }
        this.deviation = { x: 0, y: 0 }

        this.elementClicked = this.elementClicked.bind(this);
        this.elementMoved = this.elementMoved.bind(this);
        this.elementStopped = this.elementStopped.bind(this);

    }


    elementClicked(event, index) {

        const items = this.state.data
        this.index = index

        this.position.x = event.pageX
        this.position.y = event.pageY

        this.beforeMouseDown.x = items.getIn(['items', index, 'x'])
        this.beforeMouseDown.y = items.getIn(['items', index, 'y'])

        // console.log('clicked', this.beforeMouseDown, this.position)

        window.addEventListener('mousemove', this.elementMoved)
        window.addEventListener('mouseup', this.elementStopped)

    }

    elementMoved(event) {
        // console.log("moved ", this.deviation, this.beforeMouseDown, this.position)

        let element = document.getElementsByClassName('dragThis')[this.index]

        let deviationX = event.pageX - this.position.x
        let deviationY = event.pageY - this.position.y


        element.style.transform = `translate(${this.beforeMouseDown.x + deviationX}px, ${this.beforeMouseDown.y + deviationY}px)`

    }

    elementStopped(event) {
        // console.log("stopped ", this.deviation);

        let deviationX = event.pageX - this.position.x
        let deviationY = event.pageY - this.position.y

        let x = this.beforeMouseDown.x + deviationX
        let y = this.beforeMouseDown.y + deviationY

        let i = this.index
        let items = this.state.data


        items = items.setIn(['items', i, 'x'], x).setIn(['items', i, 'y'], y)

        this.setState({ data: items })

        window.removeEventListener('mousemove', this.elementMoved)
        window.removeEventListener('mouseup', this.elementStopped)

    }

    render() {

        const items = this.state.data;
        let itemArray = []

        items.get('items').map((styleInState, index) => {

            const style = {
                width: styleInState.width + 'px',
                height: styleInState.height + 'px',
                border: '1px solid',
                transform: `translate(${styleInState.x}px, ${styleInState.y}px)`
            }

            itemArray.push(<div className="dragThis" onMouseDown={(e) => this.elementClicked(e, index)} key={index + 1} style={style}></div>)

        })

        return (
            <div>{itemArray}</div>
        )
    }
}

class DragBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.style.width,
            height: this.props.style.height,
            x: (window.innerWidth / 2) - (this.props.style.width / 2),
            y: (window.innerHeight / 2) - (this.props.style.height / 2)
        };
        this.centerElement = this.centerElement.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.centerElement)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.centerElement)
    }

    centerElement() {

        let X = 0, Y = 0
        X = (window.innerWidth / 2) - (this.state.width / 2)
        Y = (window.innerHeight / 2) - (this.state.height / 2)

        this.setState({ x: X, y: Y })

    }



    render() {

        const divStyle = {
            transform: `translate(${this.state.x}px, ${this.state.y}px)`,
            width: this.state.width + 'px',
            height: this.state.height + 'px',
            border: '1px solid',
            backgroundColor: 'white'
        }


        return (
            <div style={divStyle} >
                <Draggable />
            </div>
        );
    }
}


export default DragBoard;