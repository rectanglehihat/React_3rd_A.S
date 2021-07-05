import {createAction, handleActions} from "redux-actions";
import {produce} from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";


// 액션
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";


// action creator (createAction 사용)
const logIn  = createAction(LOG_IN, (user) => ({user}));
const logOut  = createAction(LOG_OUT, (user) => ({user}));
const getUser  = createAction(GET_USER, (user) => ({user}));


// initialState(디폴트 프롭스 같은것...)
const initialState = {
    user: null,
    is_login: false,
}


// middleware actions (미들웨어 사용해서 페이지 이동)
const loginAction = (user) => {
    return function (dispatch, getState, {history}) {
        console.log(history)
        dispatch(logIn(user));
        history.push('/');
    }

}


// 리듀서(handleActions 사용)
export default handleActions({
    [LOG_IN]: (state, action) => produce(state, (draft) => {
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
    }),
    [LOG_OUT]: (state, action) => produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
    }),
    [GET_USER]: (state, action) => produce(state, (draft) => {
    }),
}, initialState);


// action creator export
const actionCreators = {
    logIn,
    logOut,
    getUser,
    loginAction,
}

export {actionCreators};