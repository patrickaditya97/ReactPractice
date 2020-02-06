import React from 'react';
const { Map, List } = require('immutable');


class Test extends React.Component {

	render() {
		
		let data = [
					{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "Rugby Ball" },
					{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "Cannon Ball" },
					{ category: "Sporting Goods", price: "$49.99", stocked: false, name: "PingPong Ball" },
					{ category: "Sporting Goods", price: "$49.99", stocked: false, name: "Fitness Ball" },
					{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "PullUp rope" },
					{ category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" },
					{ category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball" },
					{ category: "Electronics", price: "$99.99", stocked: true, name: "Laptop" },
					{ category: "Electronics", price: "$99.99", stocked: false, name: "IMac" },
					{ category: "Electronics", price: "$99.99", stocked: true, name: "HeadPhones" },
					{ category: "Electronics", price: "$99.99", stocked: false, name: "Google Pixel" },
					{ category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" },
					{ category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }]

		let list = List(data)
		let List1 =	list.groupBy(item => item.category)
		let List2 = List1.entries()

		console.log(List1.toJS(), list.groupBy(item => item.category).entrySeq())

		list.groupBy(item => item.category).entrySeq().map(([key, value]) => {

			console.log(key)
			value.toJS().forEach((val) => {
				console.log(val)
			})

		})
		return (
			
			<div>

			</div>

		);
	}

}

class PutThisOnScreen extends React.Component {
	render() {
		return (
			 <Test/>
		);
	}
}

export default PutThisOnScreen