import { connect } from 'react-redux'
import TransformManagerComponent from '../Components/TransformManagerComponent'
import { 
            updateTransformStatus, 
            resizeUpdate, 
            moveUpdate, 
            rotateUpdate, 
            toggleCrop, 
            toggleBgCrop, 
            toggleFrame
        } from '../redux/actions/action'

const mapStateToProps = (state) => ({
    workspaceItems  : state.getIn(['workspaceItems']),
    selectedItems   : state.getIn(['selectedItems']),
    selectedObjects : (state.get("selectedItems").size>0)
                        ? state.getIn(["workspaceItems"]).filter(function(obj, key){
                            return state.get("selectedItems").keyOf(key) !== undefined;
                            })
                        : null,
    zoomFactor      : state.get('zoomFactor'),
    transformStatus : state.get('transformStatus'),
    isCropping      : state.get('isCropping'),
    isFraming       : state.get('isFraming'),
    isBgCropping    : state.get('isBgCropping'),  

})


const mapDispatchToProps = (dispatch) => ({
    updateTransformStatus : (data) => { dispatch(updateTransformStatus(data)) },
    resizeUpdate          : (data) => { dispatch(resizeUpdate(data)) },
    moveUpdate            : (data) => { dispatch(moveUpdate(data)) },
    rotateUpdate          : (data) => { dispatch(rotateUpdate(data)) },
    toggleCrop            : (data) => { dispatch(toggleCrop(data)) },
    toggleBgCrop          : (data) => { dispatch(toggleBgCrop(data)) },
    toggleFrame           : (data) => { dispatch(toggleFrame(data)) },
})

const TransformManager = connect(mapStateToProps, mapDispatchToProps)(TransformManagerComponent)

export default TransformManager