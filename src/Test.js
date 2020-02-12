import React from 'react';



// const { Map, List } = require('immutable');
// class Immutable extends React.Component {

// 	render() {
		
// 		let data = [
// 						{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "Rugby Ball" },
// 						{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "Cannon Ball" },
// 						{ category: "Sporting Goods", price: "$49.99", stocked: false, name: "PingPong Ball" },
// 						{ category: "Sporting Goods", price: "$49.99", stocked: false, name: "Fitness Ball" },
// 						{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "PullUp rope" },
// 						{ category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" },
// 						{ category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball" },
// 						{ category: "Electronics", price: "$99.99", stocked: true, name: "Laptop" },
// 						{ category: "Electronics", price: "$99.99", stocked: false, name: "IMac" },
// 						{ category: "Electronics", price: "$99.99", stocked: true, name: "HeadPhones" },
// 						{ category: "Electronics", price: "$99.99", stocked: false, name: "Google Pixel" },
// 						{ category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" },
// 						{ category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }
// 					]

		// let list = List(data)
		// let List1 =	list.groupBy(item => item.category)
		// let List2 = List1.entries()


		// list.groupBy(item => item.category).entrySeq().forEach(([key, value]) => {
			
		// 	value.toJS().forEach((val) => {
		// 		let {category, price, stocked, name} = val
		// 		console.log(category, price, stocked, name);
				
		// 	})

		// })

		// let dataOld = Map({
		// 				'id1': Map({ key: "value" }), 
		// 				'id2' : Map({ key: "value" })
		// 			})
		
		// let dataNew
		// dataNew = dataOld.set('id3', Map({key: 'value'})).set('id4', Map({key: 'value'})).set('id5', Map({key: 'value'})).set('id6', Map({key: 'value'})).set('id7 ', Map({key: 'value'}))
		// console.log(dataNew.getIn(['id5', 'key']));
		
		// dataNew.entrySeq().forEach(([Key, Val])=>{
		// 	console.log(Key);

		// 	Val.entrySeq().forEach(([Key,Val])=>{
		// 		console.log(Key, Val);
				
		// 	})
			
		// })

// 		let obj = [{Key: 'a'},{Key: 'a'},{Key: 'a'},{Key: 'a'},{Key: 'a'},{Key: 'a'},{Key: 'a'}]
		
// 		obj.map((key,val)=>{
// 			let {Key} = key;

// 			console.log(Key);
			
// 		})
		
// 		return (
			
// 			<div>

// 			</div>

// 		);
// 	}

// }


class Redux extends React.Component {
	render() {
		return (
			 <div className="ReduxTest">

			 </div>
		);
	}
}

class PutThisOnScreen extends React.Component {
	render() {
		return (
			<Redux/>
		);
	}
}

export default PutThisOnScreen