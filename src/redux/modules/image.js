import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { storage } from "../../shared/firebase";


// actions
const UPLOADING = "UPLOADING";
const UPLOAD_IMAGE = "UPLOAD_IMAGE";

// action creators
const uploading = createAction(UPLOADING, (uploading) => ({ uploading }));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({ image_url }));

// initial state
const initialState = {
    image_url: "http://via.placeholder.com/400x300",
    uploading: false,
  };

// 파이어베이스에 이미지 업로드
function uploadImageFB(image) {
    return function (dispatch, getState, {history}) {
      
      dispatch(uploading(true));
      
      console.log(`images/${new Date().getTime()}_${image.name}`);
      const _upload = storage.ref(`images/${image.name}`).put(image);
  
      _upload.then((snapshot) => {
        console.log(snapshot);
  
        snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          dispatch(uploadImage(url));
        });
      }).catch(err => {
          dispatch(uploading(false));
      });
    };
  }

// reducer
export default handleActions({
    [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
        draft.image_url = action.payload.image_url;
        draft.uploading = false;
    }),

    [UPLOADING]: (state, action) => produce(state, (draft) => {
        draft.uploading = action.payload.uploading;
    }),
}, initialState);

const actionCreators = {
    uploadImage,
    uploadImageFB,
  };
  
  export { actionCreators };