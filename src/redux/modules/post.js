import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import moment from "moment";
import "moment";


const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";


const setPost = createAction(SET_POST, (post_list) => ({post_list}));
const addPost = createAction(ADD_POST, (post) => ({post}));

//리듀서가 사용할 이니셜스테이트
const initialState = {
    list: [],
}
//게시글 하나의 디폴트 프롭스 같은것
const initialPost = {
    // id: 0,
    // user_info: {
    //     user_name: "맹수방",
    //     user_profile: "https://blog.kakaocdn.net/dn/qM9y8/btqU92Jmx90/DWzhLUYbCiz7PldqnIB1gK/img.jpg",
    // },
    image_url: "https://blog.kakaocdn.net/dn/qM9y8/btqU92Jmx90/DWzhLUYbCiz7PldqnIB1gK/img.jpg",
    contents: "",
    comment_cnt: 0,
    insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  };

const addPostFB = (contents = "") => {
    return function (dispatch, getState, { history }){
        const postDB = firestore.collection("post");

        //user_info는 유저 리덕스 안에 있는 값으로 가져옴
        const _user = getState().user.user;
        const user_info = {
            user_name: _user.user_name,
            user_id: _user.uid,
            user_profile: _user.user_profile
        };
        //_post는 위의 이니셜포스트에다가 비어있는 컨텐츠, 포스트가 작성되는 시간인 insert_dt넣어줌
        const _post = {
            ...initialPost,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
        };

        //user_info와 _post라고 만든 정보 firebase에 넣어주기
        postDB.add({...user_info, ..._post}).then((doc) => {
            // 아이디를 추가해요!
            let post = {user_info, ..._post, id: doc.id};
            dispatch(addPost(post));
            history.replace("/");
        }).catch((err) => {
            console.log('post 작성 실패!', err);
        });
    };
};


const getPostFB = () => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post");

        postDB.get().then((docs) => {
        let post_list = [];

        docs.forEach((doc) => {

            let _post = doc.data();

            //키값들을 배열로 만들어줌
            let post = Object.keys(_post).reduce((acc, cur) => {

                if(cur.indexOf("user_") !== -1){
                    return {...acc, user_info: {...acc.user_info, [cur]: _post[cur]}}
                }
                return {...acc, [cur]: _post[cur]};
            }, {id: doc.id, user_info: {}})
            post_list.push(post)
        });
        dispatch(setPost(post_list));
        })  
    }
}


export default handleActions({
    [SET_POST]: (state, action) => produce(state, (draft) => {
        draft.list = action.payload.post_list;
    }),

    [ADD_POST]: (state, action) => produce(state, (draft) => {
        //배열에 제일 앞에 붙이니까 unshift사용
        draft.list.unshift(action.payload.post);
    })
    }, initialState
);


const actionCreators = {
    setPost,
    addPost,
    getPostFB,
    addPostFB,
  };
  
  export { actionCreators };