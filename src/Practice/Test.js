import React from 'react';

const { Map, List, fromJS } = require('immutable');
class Immutable extends React.Component {

	render() {
		
		// let data = [
		// 				{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "Rugby Ball" },
		// 				{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "Cannon Ball" },
		// 				{ category: "Sporting Goods", price: "$49.99", stocked: false, name: "PingPong Ball" },
		// 				{ category: "Sporting Goods", price: "$49.99", stocked: false, name: "Fitness Ball" },
		// 				{ category: "Sporting Goods", price: "$49.99", stocked: true, name: "PullUp rope" },
		// 				{ category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball" },
		// 				{ category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball" },
		// 				{ category: "Electronics", price: "$99.99", stocked: true, name: "Laptop" },
		// 				{ category: "Electronics", price: "$99.99", stocked: false, name: "IMac" },
		// 				{ category: "Electronics", price: "$99.99", stocked: true, name: "HeadPhones" },
		// 				{ category: "Electronics", price: "$99.99", stocked: false, name: "Google Pixel" },
		// 				{ category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5" },
		// 				{ category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }
		// 			]

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

		// let obj = [{Key: 'a'},{Key: 'a'},{Key: 'a'},{Key: 'a'},{Key: 'a'},{Key: 'a'},{Key: 'a'}]
		
		// obj.map((key,val)=>{
		// 	let {Key} = key;

		// 	console.log(Key);
		// })

		let presetFilters = fromJS({
			"ORIGINAL":   {"name": "Original", 		"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
			"SATURATION": {"name": "Saturation", 	"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
			"SUMMER": 	  {"name": "Summer", 		"bright" :40,   "contrast" :56, "hue" :0, "saturate" :72, 	"tint" : -92, 	"blur" :0, 		"vignette" :0},
			"WINTER": 	  {"name": "Winter", 		"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
			"RETRO": 	  {"name": "Retro", 		"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
			"RETRO2": 	  {"name": "Retro2", 		"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
			"SOFTLIGHT":  {"name": "Softlight", 	"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
			"SUNLIGHT":   {"name": "Sunlight", 		"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
			"VINTAGE":    {"name": "Vintage", 		"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
			"VINTAGE2":   {"name": "Vintage2", 		"bright" :0,   	"contrast" :0,  "hue" :0, "saturate" :0, 	"tint" :0, 		"blur" :0, 		"vignette" :0},
		})

		const [...presetFilterKeys] = presetFilters.keys()
		const [...singleFilterKeys] = presetFilters.get("ORIGINAL").keys()

		console.log(presetFilterKeys, singleFilterKeys.splice(1));
		
		presetFilterKeys.map(key => {
			console.log(key)
		})

		return (
			
			<div>

			</div>

		);
	}

}


class Testing extends React.Component {
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
			<Immutable/>
		);
	}
}

export default PutThisOnScreen