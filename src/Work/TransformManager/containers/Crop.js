import { connect } from 'react-redux'
import CropComponent from "../Components/CropComponent";
//import { updateAudioDuration } from "../actions/index"
import { cropImage, cropBG, toggleCrop, toggleBgCrop, toggleFrame } from "../redux/actions/action"

const mapStateToProps = (state, ownProps) => ({
  selectedItems      : state.get('selectedItems'),
  cropItem           : state.getIn(["workspaceItems",state.getIn(['selectedItems', 0])]),
  zoomFactor         : state.get('zoomFactor'),
  isCropping         : state.get('isCropping'),
  isFraming          : state.get('isFraming'),
  isBgCropping       : state.get('isBgCropping'),
  workspaceBounds    : state.get('workspaceBounds'),
})
       
const mapDispatchToProps = (dispatch, ownProps) => ({
  cropImage:(data, socket) => {
    dispatch(cropImage(data, socket))
  },
  cropBG:(data, socket) => {
    dispatch(cropBG(data, socket))
  },
  toggleCrop:(data) => {
    dispatch(toggleCrop(data))
  },
  toggleBgCrop:(data) => {
    dispatch(toggleBgCrop(data))
  },
  toggleFrame:(data) => {
    dispatch(toggleFrame(data))
  },
})

const Crop = connect(
  mapStateToProps,
  mapDispatchToProps
)(CropComponent)

export default Crop