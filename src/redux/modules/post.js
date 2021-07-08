import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";
import "moment";

import { actionCreators as imageActions } from "./image";


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
        //getState()로 store의 상태값에 접근
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
        // 데이터가 어떤 타입인지 확인
        const _image = getState().image.preview
        console.log(typeof _image)

        const _upload = storage
            // 파일 이름은 유저의 id와 현재 시간을 밀리초로 넣기 (중복 방지)
            .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
            .putString(_image, "data_url");

        _upload.then((snapshot) => {
            snapshot.ref.getDownloadURL().then(url => {
                console.log(url);

                return url;
            }).then(url => {
            // return으로 넘겨준 값이 잘 넘어왔는지 확인
            console.log(url);

            //user_info와 _post라고 만든 정보 firebase에 넣어주기
            postDB
                .add({...user_info, ..._post, image_url: url})
                .then((doc) => {
                //아이디 추가
                let post = {user_info, ..._post, id: doc.id, image_url: url};
                dispatch(addPost(post));
                history.replace("/");

                dispatch(imageActions.setPreview(null));
            }).catch((err) => {
                window.alert("앗! 포스트 작성에 문제가 있어요!");
                console.log('post 작성 실패!', err);
            });
            })
        })  
        .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log(err);
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