const {fromJS} = require('immutable');

const initialState = fromJS({
    "workspaceWidth": 800,
    "workspaceHeight": 500,
    "workspaceBounds": {
        cx: 505.5,
        cy: 394.5,
        width: 800, 
        height: 500
    },
    "workspaceItems":  
    {
        // "SVGelem": {
        //     type: "FRAME",
        //     id: "_id0_1",
        //     src: {
        //         d: "m561.2 0h-534.4c-14.8 0-26.8 12-26.8 26.8v328.6h588v-328.6c0-14.8-12-26.8-26.8-26.8zm1.2 329.8h-537.6v-302h537.6v302z",
        //         clip_d: "M24.8 27.8H562.4V329.8H24.8z"
        //     },
        //     width: 588,
        //     height: 356.1,
        //     x: 40,
        //     y: 40,
        //     angle: 0,
        //     frameDetails: {
        //         clipWidth: 537.59,
        //         clipHeight: 302,
        //     },
        //     imgDetails: {
        //         id: 'default',
        //         xRatio: 0.040,
        //         yRatio: 0.105,
        //         widthRatio: 0.913,
        //         heightRatio: 0.85,
        //         width: 1438,
        //         height: 580,
        //         src: "/images/TestImages/frameImage.webp",
        //     },
        //     original: {
        //         x: 0,
        //         y: 0,
        //         width: 1,
        //         height: 1
        //     }
        // }, 
        "SVGelem123": {
            type: "FRAME",
            id: "_id1_1",
            src: {
                d: "m561.2 0h-534.4c-14.8 0-26.8 12-26.8 26.8v328.6h588v-328.6c0-14.8-12-26.8-26.8-26.8zm1.2 329.8h-537.6v-302h537.6v302z",
                clip_d: "M24.8 27.8H562.4V329.8H24.8z"
            },
            width: 588,
            height: 356.1,
            x: 40,
            y: 40,
            angle: 0,
            frameDetails: {
                clipWidth: 537.59,
                clipHeight: 302,
            },
            imgDetails: {
                id: "default",
                xRatio: 0.042,
                yRatio: 0.105,
                widthRatio: 0.914,
                heightRatio: 0.85,
                width: 1800,
                height: 2400,
                src: "/images/TestImages/vertical.webp",
            },
            original: {
                x: 0,
                y: 0,
                width: 1,
                height: 1
            }
        }
    },
    "workspaceChildren":{},
    "selectedItems":["SVGelem123"],
    "selectedObjects": {},
    "zoomFactor": 1,
    "transformStatus": { 
        transforming: false, 
        moving: false, 
        resizing: false, 
        rotating: false 
    },
    "isCropping": false,
    "isFraming": false,
    "isBgCropping": false,

})


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
                transforming : false, 
                moving : false, 
                resizing : false, 
                rotating : false
            }));
            state = state.set("isCropping", false);
            state = state.set("isFraming", false);
            
            let selectedItem = state.getIn([ "workspaceItems", action.data.selectedItems.get(0)]);
            
            if (action.data.original.x === 0 && action.data.original.y === 0 && 
                action.data.original.width === 1 && action.data.original.height === 1) {
                state = selectedItem.set("isCropped", false);
                state = selectedItem.delete("original");
            } else {
                
                selectedItem = selectedItem.merge(fromJS(action.data.crop));
                selectedItem = selectedItem.setIn(["original"], fromJS(action.data.original));
                if (selectedItem.getIn(["imgDetails", 'id']) !== "modified") {
                    selectedItem = selectedItem.setIn(["imgDetails", 'id'], action.data.imgDetails.id);
                }

                state = state.setIn(["workspaceItems", action.data.selectedItems.get(0)], selectedItem)
            }

            return state;
          
        default:
            break
    }

    return state
}