import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";

import firebase from "firebase/app";

import {actionCreators as postActions} from "./post"


const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";

const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({post_id, comment_list}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({post_id, comment}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: {},
  is_loading: false,
};

const addCommentFB = (post_id, contents) => {
  return function (dispatch, getState, { history }) {
    const commentDB = firestore.collection("comment");
    //댓글 누가 적었는지 
    const user_info = getState().user.user;
    //댓글 정보 만들기
    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    // firestore에 코멘트 정보를 넣기
    commentDB.add(comment).then((doc) => {
      // 댓글을 작성하면 게시글 정보에 있는 댓글 갯수도 +1 해야하니까
      const postDB = firestore.collection("post");

      comment = { ...comment, id: doc.id };

      // 리덕스에 있는 id가 이 post의 id와 같니?
      const post = getState().post.list.find((l) => l.id === post_id);

      // firestore에 저장된 값을 +1해줍니다!(이건 현재값에서 1을 더해줌)
      const increment = firebase.firestore.FieldValue.increment(1);
      
      // post에도 comment_cnt를 하나 플러스 해줍니다.
      postDB
        .doc(post_id)
        //여기 increment는 comment_cnt + 1이라 생각하면 됨 
        .update({ comment_cnt: increment })
        .then((_post) => {
          dispatch(addComment(post_id, comment));

          // 리덕스에 post가 있을 때만 post의 comment_cnt를 +1해줍니다.
          if (post) {
            dispatch(
              postActions.editPost(post_id, {
                //자바스크립트 묵시적 형변환 방지
                comment_cnt: parseInt(post.comment_cnt) + 1,
              })
            );
          }
        });
    });
  };
};

const getCommentFB = (post_id = null) => {
    return function(dispatch, getState, {history}){

    // post_id가 없으면 바로 리턴
    if(!post_id){
      return;
    }

    const commentDB =firestore.collection("comment")

    commentDB
      .where("post_id", "==", post_id)
      .orderBy("insert_dt", "desc")
      .get()
      .then((docs) => {
        let list = [];

        docs.forEach((doc) => {
          list.push({...doc.data(), id: doc.id});
        })

        dispatch(setComment(post_id, list))
      }).catch(err => {
        console.log("댓글 가져오기 실패!", post_id, err);
      })
  }
}



export default handleActions(
  {
      [SET_COMMENT]: (state, action) => produce(state, (draft) => {
        // 각각 게시글 방을 만들어준다고 생각
        // let data = {[post_id]: com_list, ...} 이런식으로
        draft.list[action.payload.post_id] = action.payload.comment_list;
      }),
      [ADD_COMMENT]: (state, action) => produce(state, (draft)=> {
        draft.list[action.payload.post_id].unshift(action.payload.comment);
      }),
      [LOADING]: (state, action) => produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      })
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  setComment,
  addComment,
  addCommentFB,
};

export { actionCreators };