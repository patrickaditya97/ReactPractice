const { fromJS } = require('immutable');

const initialState = fromJS({
	workspaceWidth: 800,
	workspaceHeight: 500,
	workspaceBounds: {
		cx: 505.5,
		cy: 394.5,
		width: 800,
		height: 500,
	},
	library: {
		"1208953647": {
			id: "1208953647",
			width: 528,
			height: 612,
			src:
				"https://media.gettyimages.com/vectors/timeline-infographics-vector-id1152547784?b=1&k=6&m=1152547784&s=612x612&w=0&h=Pv-L0RqJWWqh66MXU3eZvbOEJN-9UTdR-UruqaNaBAo=",
			thumbnail:
				"https://media.gettyimages.com/vectors/timeline-infographics-vector-id1152547784?b=1&k=6&m=1152547784&s=612x612&w=0&h=Pv-L0RqJWWqh66MXU3eZvbOEJN-9UTdR-UruqaNaBAo=",
			// type: "STOCKIMG",
			title: 'vector1'
		},
		"1202442850": {
			id: "1202442850",
			width: 528,
			height: 612,
			src:
				"https://media.gettyimages.com/vectors/timeline-infographics-vector-id1152547784?b=1&k=6&m=1152547784&s=612x612&w=0&h=Pv-L0RqJWWqh66MXU3eZvbOEJN-9UTdR-UruqaNaBAo=",
			thumbnail:
				"https://media.gettyimages.com/vectors/timeline-infographics-vector-id1152547784?b=1&k=6&m=1152547784&s=612x612&w=0&h=Pv-L0RqJWWqh66MXU3eZvbOEJN-9UTdR-UruqaNaBAo=",
			// type: "STOCKIMG",
			title: 'vector2'
		},
	},
	isItemDragging: false,
	workspaceItems: {
		// "FrameElem": {
		// 	"type": "FRAME",
		// 	"width": 588,
		// 	"height": 472,
		// 	"defaultWidth": 588,
		// 	"defaultHeight": 472,
		// 	"x": 100,
		// 	"y": 10,
		// 	"angle": 0,
		// 	"d" : [
		// 		{
		// 			"path": "m561.2 0h-534.4c-14.8 0-26.8 12-26.8 26.8v328.6h588v-328.6c0-14.8-12-26.8-26.8-26.8zm1.2 329.8h-537.6v-302h537.6v302z",
		// 			"fill": "black",
		// 			"stroke": "none"
		// 		},
		// 		{
		// 			"path": "m0 383.5c0 14.8 12 26.8 26.8 26.8h534.4c14.8 0 26.8-12 26.8-26.8v-28h-588v28z",
		// 			"fill": "black",
		// 			"stroke": "none"
		// 		},
		// 		{
		// 			"path": "m290.4 410.3h-63.4s-1.9 29.2-3.9 41.4c-3.5 20.9-24.9 14.2-31 18.6-0.8 0.6-0.4 1.9 0.6 1.9h202.4c1 0 1.4-1.3 0.6-1.9-6.1-4.4-27.5 2.3-31-18.6-2-12.2-3.9-41.4-3.9-41.4h-70.4z",
		// 			"fill": "black",
		// 			"stroke": "none"
		// 		}
		// 	],
		// 	"clipDetails": {
		// 		"clip_1": {
		// 			"clipWidth": 537.59,
		// 			"clipHeight": 302,
		// 			"clipX": 25,
		// 			"clipY": 27,
		// 			'clipData': "M24.8 27.8H562.4V329.8H24.8z",
		// 			"imgDetails": {
		// 				"id": "default",
		// 				"width": 612,
		// 				"height": 408,
		// 				"type": "STOCKIMG",
		// 				"src": "",
		// 				"filter": "",
		// 				"flipPosition": 0,
		// 				"original": {
		// 					"x": 0.04251700680272109,
		// 					"y": 0.038135593220339,
		// 					"width": 0.9142687074829933,
		// 					"height": 0.759014951627089,
		// 				},
		// 				"defaultImageDetails": {
		// 					'src': "https://www.reallusion.com/ContentStore/CTA/Pack/G3-Animation-Suite-Weather-Maker/images/sunny.jpg",
		// 					"width": 1920,
		// 					'height': 1080,
		// 					"original": {
		// 						"x": 0.04251700680272109,
		// 						"y": 0.038135593220339,
		// 						"width": 0.9142687074829933,
		// 						"height": 0.759014951627089,
		// 					}
		// 				}
		// 			},
		// 		}
		// 	}
		// },

		// "FrameElem": {
		// 	"type": "FRAME",
		// 	"width": 780,
		// 	"height": 780,
		// 	"defaultWidth": 780,
		// 	"defaultHeight": 780,
		// 	"x": 10,
		// 	"y": 10,
		// 	"angle": 0,
		// 	"d" : [
		// 		{
		// 			"path": "M390 0h390v390H390z",
		// 			"fill": "black",
		// 			"stroke": "none"
		// 		},
		// 		{
		// 			"path": "M0 390h390v390H0z",
		// 			"fill": "black",
		// 			"stroke": "none"
		// 		}
		// 	],
		// 	"clipDetails": {
		// 		"clip_1": {
		// 			"clipWidth": 390,
		// 			"clipHeight": 390,
		// 			"clipX": 0,
		// 			"clipY": 0,
		// 			'clipData': "M0 0h390v390H0z",
		// 			"imgDetails": {
		// 				"id": "default",
		// 				"width": 612,
		// 				"height": 408,
		// 				"type": "STOCKIMG",
		// 				"src": "",
		// 				"filter": "",
		// 				"flipPosition": 0,
		// 				"original": {
		// 					"x": 0,
		// 					"y": 0,
		// 					"width": 1,
		// 					"height": 1,
		// 				},
		// 				"defaultImageDetails": {
		// 					'src': "https://www.reallusion.com/ContentStore/CTA/Pack/G3-Animation-Suite-Weather-Maker/images/sunny.jpg",
		// 					"width": 1920,
		// 					'height': 1080,
		// 					"original": {
		// 						"x": 0.04251700680272109,
		// 						"y": 0.038135593220339,
		// 						"width": 0.9142687074829933,
		// 						"height": 0.759014951627089,
		// 					}
		// 				}
		// 			},
		// 		},
		// 		"clip_2": {
		// 			"clipWidth": 390,
		// 			"clipHeight": 390,
		// 			"clipX": 390,
		// 			"clipY": 390,
		// 			'clipData': "M390 390h390v390H390z",
		// 			"imgDetails": {
		// 				"id": "default",
		// 				"width": 612,
		// 				"height": 408,
		// 				"type": "STOCKIMG",
		// 				"src": "",
		// 				"filter": "",
		// 				"flipPosition": 0,
		// 				"original": {
		// 					"x": 0,
		// 					"y": 0,
		// 					"width": 1,
		// 					"height": 1,
		// 				},
		// 				"defaultImageDetails": {
		// 					'src': "https://www.reallusion.com/ContentStore/CTA/Pack/G3-Animation-Suite-Weather-Maker/images/sunny.jpg",
		// 					"width": 1920,
		// 					'height': 1080,
		// 					"original": {
		// 						"x": 0.04251700680272109,
		// 						"y": 0.038135593220339,
		// 						"width": 0.9142687074829933,
		// 						"height": 0.759014951627089,
		// 					}
		// 				}
		// 			},
		// 		}
		// 	}
		// },

		"FrameElem": {
			"type": "FRAME",
			"width": 374,
			"height": 433,
			"defaultWidth": 374,
			"defaultHeight": 433,
			"x": 10,
			"y": 10,
			"angle": 0,
			"d": [],
			"clipDetails": {
				"clip_1": {
					"clipWidth": 374,
					"clipHeight": 191,
					"clipX": 0,
					"clipY": 0,
					"clipData": "M0 0h374v150H0z",
					"imgDetails": {
						"id": "default",
						"width": 612,
						"height": 408,
						"type": "STOCKIMG",
						"src": "",
						"filter": "",
						"flipPosition": 0,
						"original": {
							"x": 0,
							"y": 0,
							"width": 1,
							"height": 1
						},
						"defaultImageDetails": {
							"src": "https://www.reallusion.com/ContentStore/CTA/Pack/G3-Animation-Suite-Weather-Maker/images/sunny.jpg",
							"width": 1920,
							"height": 1080
						}
					}
				},
				"clip_2": {
					"clipWidth": 374,
					"clipHeight": 117,
					"clipX": 0,
					"clipY": 180,
					"clipData": "M0 146h374v191H0z",
					"imgDetails": {
						"id": "default",
						"width": 612,
						"height": 408,
						"type": "STOCKIMG",
						"src": "",
						"filter": "",
						"flipPosition": 0,
						"original": {
							"x": 0,
							"y": 0,
							"width": 1,
							"height": 1
						},
						"defaultImageDetails": {
							"src": "https://www.reallusion.com/ContentStore/CTA/Pack/G3-Animation-Suite-Weather-Maker/images/sunny.jpg",
							"width": 1920,
							"height": 1080
						}
					}
				},
				"clip_3": {
					"clipWidth": 374,
					"clipHeight": 117,
					"clipX": 0,
					"clipY": 287,
					"clipData": "M373.9 433H0v-97.5h206.3l-1-20h168.6z",
					"imgDetails": {
						"id": "default",
						"width": 612,
						"height": 408,
						"type": "STOCKIMG",
						"src": "",
						"filter": "",
						"flipPosition": 0,
						"original": {
							"x": 0,
							"y": 0,
							"width": 1,
							"height": 1
						},
						"defaultImageDetails": {
							"src": "https://www.reallusion.com/ContentStore/CTA/Pack/G3-Animation-Suite-Weather-Maker/images/sunny.jpg",
							"width": 1920,
							"height": 1080
						}
					}
				}
			}
		}
	},
	workspaceChildren: {},
	selectedItems: ["FrameElem"],
	selectedClip: "clip_2",
	selectedObjects: {},
	zoomFactor: 1,
	transformStatus: {
		transforming: false,
		moving: false,
		resizing: false,
		rotating: false,
	},
	isCropping: false,
	isFraming: false,
	isBgCropping: false,
});


export default function rootReducer(state = initialState, action) {

	switch (action.type) {

		case "UPDATE_TRANSFORM_STATUS":
			state = state.set("transformStatus", state.get("transformStatus").merge(fromJS(action.data)));
			return state;

		case "RESIZE_UPDATE":

			state = state.mergeDeep(fromJS(action.data))
			return state

		case "MOVE_UPDATE":

			state = state.mergeDeep(fromJS(action.data))
			return state

		case "ROTATE_UPDATE":

			state = state.mergeDeep(fromJS(action.data))
			return state

		case "TOGGLE_CROP":
			return state.update("isCropping", value => !value);

		case "TOGGLE_BG_CROP":
			state = state.update("isToolCropping", value => !value);
			return state;

		case "TOGGLE_FRAME":
			return state.update("isFraming", value => !value);

		case "CROP_IMAGE":
			
			state = state.set("transformStatus", fromJS({
				transforming: false,
				moving: false,
				resizing: false,
				rotating: false
			}));
			state = state.set("isCropping", false);
			state = state.set("isFraming", false);

			let selectedItem = state.getIn(["workspaceItems", action.data.selectedItems.get(0), "clipDetails", action.data.clip]);

			if (action.data.original.x === 0 && action.data.original.y === 0 &&
				action.data.original.width === 1 && action.data.original.height === 1) {
				state = selectedItem.setIn(["workspaceItems", action.data.selectedItem.get(0), "isCropped"], false);
				state = selectedItem.delete("original");
			} else {

				selectedItem = selectedItem.setIn(['imgDetails', "original"], fromJS(action.data.original));

				state = state.setIn(["workspaceItems", action.data.selectedItems.get(0), "clipDetails", action.data.clip], selectedItem)
			}

			return state;

		case 'ITEM_DRAGGING':
			
			state = state.set('isItemDragging', true)

			return state

		case 'IMAGE_NOT_DROPPED':

			return state.set('isItemDragging', false)

		case 'IMAGE_DROPPED':

			let selectedFrameItem = state.getIn(['workspaceItems', action.ImageData.selectedItem, 'clipDetails', action.ImageData.clip, 'imgDetails'])
			
			let selectedFrameOriginal = selectedFrameItem.get('original').merge(action.ImageData.original)
			
			selectedFrameItem = selectedFrameItem.set('original', selectedFrameOriginal).set('src', action.ImageData.libraryItem.get('src'))

			state = state.setIn(['workspaceItems', action.ImageData.selectedItem, 'clipDetails', action.ImageData.clip, 'imgDetails'], selectedFrameItem)

			state = state.set('isItemDragging', false)
			
			return state

		default:
			return state
	}

}