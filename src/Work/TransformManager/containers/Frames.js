import {connect} from 'react-redux'
import FramesComponent from "../Components/FramesComponent";
import {cropImage} from '../redux/actions/action'

const mapStateToProps = (state) => ({
    workspaceItems  : state.getIn(['workspaceItems']),
    workspaceBounds : state.get('workspaceBounds'),
    selectedItems   : state.getIn(['selectedItems']),
    isFraming       : state.get('isFraming'),
    zoomFactor      : state.get('zoomFactor'),
})

const mapDispatchToProps = (dispatch) => ({
    cropImage: (data, socket) => {
        dispatch(cropImage(data, socket))
    },
})

const Frames = connect(mapStateToProps, mapDispatchToProps)(FramesComponent)

export default Frames