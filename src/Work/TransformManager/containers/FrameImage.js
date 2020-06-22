import { connect } from 'react-redux'
import FrameImageComponent from "../Components/FrameImageComponent";
import { cropImage } from '../redux/actions/action'
const mapStateToProps = (state) => ({
	workspaceItems: state.getIn(['workspaceItems']),
	workspaceWidth: state.get('workspaceWidth'),
	workspaceHeight: state.get('workspaceHeight'),
	workspaceBounds: state.get('workspaceBounds'),
	selectedItems: state.get('selectedItems'),
    selectedObjects : (state.get("selectedItems").size>0)
                        ? state.getIn(["workspaceItems"]).filter(function(obj, key){
                            return state.get("selectedItems").keyOf(key) !== undefined;
                            })
                        : null,
	zoomFactor: state.get('zoomFactor'),
	isFraming: state.get('isFraming'),
	selectedClip: state.get('selectedClip'),
})

const mapDispatchToProps = (dispatch) => ({
	toggleCrop: (data) => {
		dispatch({ type: "TOGGLE_FRAME" })
	},
	cropImage: (data, socket) => {
		dispatch(cropImage(data, socket))
	},

})

const FrameImage = connect(mapStateToProps, mapDispatchToProps)(FrameImageComponent)

export default FrameImage