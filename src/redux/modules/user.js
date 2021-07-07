import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

import { auth } from "../../shared/firebase";
import firebase from "firebase/app";


// actions(액션타입 정하기)
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  is_login: false,
};

// middleware actions
// firebase에서 로그인 하는 함수
const loginFB = (id, pwd) => {
  return function (dispatch, getState, {history}){
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
      auth
      .signInWithEmailAndPassword(id, pwd)
      .then((user) => {
        console.log(user);

        dispatch(setUser({
            user_name: user.user.displayName,  //위에서 콜솔로 찍은 user안에서 user에 있는 displayName
            id: id,
            user_profile: "",
            uid: user.user.uid,
          })
        );

        history.push("/");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
    });
  })
}};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, {history}){

     auth
      .createUserWithEmailAndPassword(id, pwd)
      .then((user) => {

        console.log(user);
        
        auth.currentUser.updateProfile({
          displayName: user_name, //바꾸고 싶은거 넣기
        }).then(()=>{ //업뎃 성공하면 리덕스에 바뀐내용 집어넣기
          dispatch(
            setUser({
            user_name: user_name,   
            id: id, 
            user_profile: '', 
            uid: user.user.uid
          }));
          history.push('/');
        }).catch((error) => {
          console.log(error);
        });

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
        // ..
      });
  }
}

//리덕스에 데이터 다시 넣기(새로고침시 헤더 날아가니까 막아주기)
const loginCheckFB = () => {
  return function (dispatch, getState, {history}){
    auth.onAuthStateChanged((user) => {
      if(user){
        dispatch(
          setUser({
          user_name: user.displayName,
          user_profile: '',
          id: user.email,
          uid: user.uid,
        })
      )}else{
        dispatch(logOut());
      }
    }
  )}
}

//로그아웃시 firebase에서도 데이터 날아가게
const logoutFB = () => {
  return function (dispatch, getState, {history}){
    auth.signOut().then(() => {
      dispatch(logOut());
      history.replace('/');
    });
  };
};


// reducer
export default handleActions({
    [SET_USER]: (state, action) => produce(state, (draft) => {
        setCookie("is_login", "success"); //원래는 토큰 들어감
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) => produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

// action creator export
const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };