import {connect} from 'react-redux'
import FrameImageComponent from "../Components/FrameImageComponent";
import {cropImage} from '../redux/actions/action'
const mapStateToProps = (state) => ({
    workspaceItems  : state.getIn(['workspaceItems']),
    workspaceWidth  : state.get('workspaceWidth'),
    workspaceHeight : state.get('workspaceHeight'),
    workspaceBounds : state.get('workspaceBounds'),
    selectedItems   : state.get('selectedItems'),
    zoomFactor      : state.get('zoomFactor'),
    isFraming       : state.get('isFraming'),
})

const mapDispatchToProps = (dispatch) => ({

    cropImage: (data, socket) => {
        dispatch(cropImage(data, socket))
    },
    
})

const FrameImage = connect(mapStateToProps, mapDispatchToProps)(FrameImageComponent)

export default FrameImage