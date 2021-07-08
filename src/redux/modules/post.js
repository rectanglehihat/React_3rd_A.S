import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";

import { actionCreators as imageActions } from "./image";


const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";

const setPost = createAction(SET_POST, (post_list, paging) => ({post_list, paging}));
const addPost = createAction(ADD_POST, (post) => ({post}));
//게시물 수정하려면 post_id랑 post가 필요함
const editPost = createAction(EDIT_POST, (post_id, post) => ({
    post_id,
    post,
  }))
 const loading = createAction(LOADING, (is_loading) => ({ is_loading }));


//리듀서가 사용할 이니셜스테이트
const initialState = {
    list: [],
    //paging처리
    paging: { start: null, next: null, size: 3 },
    is_loading: false,
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

const editPostFB = (post_id = null, post = {}) => {
    return function (dispatch, getState, {history}) {

        if(!post_id) {
            console.log("게시물 정보가 없어요!");
            return;
        }

        const _image = getState().image.preview;

        const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
        const _post = getState().post.list[_post_idx];

        console.log(_post);

        //수정할 컬렉션 가져오고
        const postDB = firestore.collection("post");
        // 프리뷰에 있는 이미지랑 이 포스트의 이미지 url이 같은지 확인
        if (_image === _post.image_url) {
            postDB
                .doc(post_id)
                .update(post)
                .then((doc) => {
                    dispatch(editPost(post_id, { ...post }));
                    history.replace("/");
                });

                return;
        }else{
            const user_id = getState().user.user.uid;
            const _upload = storage
              .ref(`images/${user_id}_${new Date().getTime()}`)
              .putString(_image, "data_url");
      
            _upload.then((snapshot) => {
              snapshot.ref
                .getDownloadURL()
                .then((url) => {
                  console.log(url);
      
                  return url;
                })
                .then((url) => {
                  postDB
                    .doc(post_id)
                    .update({ ...post, image_url: url })
                    .then((doc) => {
                      dispatch(editPost(post_id, { ...post, image_url: url }));
                      history.replace("/");
                    });
                })
                .catch((err) => {
                    window.alert("앗! 이미지 업로드에 문제가 있어요!");
                    console.log(err);
                })  
            })
        }
    }
}


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

//start = null, size=3 은 페이징대로 데이터 가져오려고
const getPostFB = (start = null, size=3) => {
    return function (dispatch, getState, { history }) {
      let _paging = getState().post.paging;
      if(_paging.start && !_paging.next){
        return;
      }

      dispatch(loading(true));
      const postDB = firestore.collection("post");

      let query = postDB.orderBy("insert_dt", "desc");

      if(start){
        query = query.startAt(start);
      }

      query.limit(size+1).get().then((docs) => {
        let post_list = [];
        // 페이징 정보
        let paging ={
          start: docs.docs[0],
          next: docs.docs.length === size+1 ? docs.docs[docs.docs.length-1] : null,
          size: size,
        }
        docs.forEach((doc) => {
          let _post = doc.data();
          let post = Object.keys(_post).reduce((acc, cur) => {

              if (cur.indexOf("user_") !== -1) {
                return {...acc, user_info: { ...acc.user_info, [cur]: _post[cur] },};
              }
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          );
          
          post_list.push(post);
        });
      // size+1이 들어갔으니까 pop해줌
      if(paging.next) {
        post_list.pop();
      }

        dispatch(setPost(post_list, paging));
      });
      return;
    };
  };

const getOnePostFB = (id) => {
  return function(dispatch, getState, {history}){
    const postDB = firestore.collection("post");

    postDB.doc(id).get().then(doc => {
        console.log(doc);
        console.log(doc.data());

        let _post = doc.data();
        let post = Object.keys(_post).reduce((acc, cur) => {

          if (cur.indexOf("user_") !== -1) {
            return {...acc, user_info: { ...acc.user_info, [cur]: _post[cur] },};
          }
          return { ...acc, [cur]: _post[cur] };
        },
        { id: doc.id, user_info: {} }
      );
      dispatch(setPost([post]));
    })
  }
}


export default handleActions({
    [SET_POST]: (state, action) => produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);

        //리스트 중복 제거
        draft.list = draft.list.reduce((acc, cur) => {
          if(acc.findIndex((a) => a.id === cur.id) === -1){
            return [...acc, cur];
          }else{
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        if(action.payload.paging){
          draft.paging = action.payload.paging;
        }
        
        draft.is_loading = false;
    }),

    [ADD_POST]: (state, action) => produce(state, (draft) => {
        //배열에 제일 앞에 붙이니까 unshift사용
        draft.list.unshift(action.payload.post);
    }),
    [EDIT_POST]: (state, action) => produce(state, (draft) => {
        //리스트에서 몇번째거를 수정할건지 알아야함
        //findIndex()는 조건에 맞는 애의 인덱스 번호를 줌
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
      [LOADING]: (state, action) => produce(state, (draft) => {
        //   데이터를 가져오는 중인 지 여부를 작성합니다.
        draft.is_loading = action.payload.is_loading;
      }),
    }, initialState
);


const actionCreators = {
    setPost,
    addPost,
    editPost,
    getPostFB,
    addPostFB,
    editPostFB,
    getOnePostFB,
  };
  
  export { actionCreators };