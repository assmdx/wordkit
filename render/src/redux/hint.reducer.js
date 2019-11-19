/*这里应该去问主线成要一下那个配置*/


const initState = {
    fontType:"",
    totalNum:0,
    words:["happy"],
    fontSize:"",
    color:"",
    freshTimer:2
}

const CHANGE_FONTSIZE="CHANGE_FONTSIZE"

export function hint(state = initState,action) {
    switch (action.type) {
        case CHANGE_FONTSIZE:
            return Object.assign({},state, {fontSize:action.fontSize})
        default:
            return state
    }
}


export function changeFontSize(fontSize) {
    return async (dispatch) => {
        dispatch({
            type:CHANGE_FONTSIZE,
            fontSize:fontSize
        })
    }
}
