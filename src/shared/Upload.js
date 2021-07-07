import React from "react";
import { Button } from "../elements";
import {storage} from "./firebase";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";


const Upload = (props) => {
    const dispatch = useDispatch();
    const uploading = useSelector((state) => state.image.uploading);

    const fileInput = React.useRef();

    const selectFile = (e) => {
        console.log(e)
        console.log(e.target.files)
        console.log(e.target.files[0]);
        console.log(fileInput.current.files[0]);
    }

    //이미지 스토리지에 업로드
    const uploadFB = () => {
        let image = fileInput.current?.files[0];
        // 파일 이름을 포함하여 파일의 전체 경로를 가리키는 참조를 만들기
        const _upload = storage.ref(`images/${image.name}`).put(image);
  
         // 업로드
        _upload.then((snapshot) => {
          console.log(snapshot);

        // 업로드한 파일의 다운로드 경로 가져오기
        snapshot.ref.getDownloadURL().then((url) => {
            console.log(url);
        })
        });
    }

    return (
        <React.Fragment>
            <input type="file" ref={fileInput} onChange={selectFile} disabled={uploading}/>
            <Button _onClick={uploadFB}>업로드하기</Button>
        </React.Fragment>
    )
}


export default Upload;