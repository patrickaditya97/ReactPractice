import {connect} from 'react-redux'
import WorkspaceComponent from '../Components/WorkspaceComponent'
import { toggleCrop } from '../redux/actions/action'

const mapStateToProps = (state) => ({
    workspaceItems   : state.getIn(['workspaceItems']),
    selectedItems    : state.getIn(['selectedItems']),
    selectedChildren : state.getIn(['selectedChildren']),
    isCropping       : state.get('isCropping'),
    isFraming        : state.get('isFraming'),
    isBgCropping     : state.get('isBgCropping'),
    workspaceBounds  : state.get('workspaceBounds'),
    workspaceWidth   : state.get('workspaceWidth'),
    workspaceHeight  : state.get('workspaceHeight'),
    library          : state.get("library"),
    zoomFactor       : 1,
})

const mapDispatchToProps = (dispatch)=> ({
    toggleCrop:(data) => {
        dispatch(toggleCrop(data))
      },
})

const Workspace = connect(mapStateToProps, mapDispatchToProps)(WorkspaceComponent)

export default Workspace