import React from "react";
import {Text, Grid, Button, Image, Input} from "../elements"
import Upload from "../shared/Upload";

import {useSelector, useDispatch} from "react-redux";
import {actionCreators as postActions} from "../redux/modules/post"
//미리보기 이미지 링크 넘겨줘서 받기
import { actionCreators as imageActions } from "../redux/modules/image";


const PostWrite = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login);
    const preview = useSelector((state) => state.image.preview);
    const post_list = useSelector((state) => state.post.list);

    // console.log(props.match.params.id)

    const post_id = props.match.params.id;
    const is_edit = post_id ? true : false;

    const {history} = props;

    let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;

    // console.log(_post)

    const [contents, setContents] = React.useState(_post ? _post.contents : "");

    React.useEffect(() => {
        if (is_edit && !_post) {
          console.log("포스트 정보가 없어요!");
          history.goBack();
    
          return;
        }
        //수정 모드일때만 이미지 모듈의 action creators에서 setPreview실행
        if (is_edit) {
            dispatch(imageActions.setPreview(_post.image_url));
          }
     }, [])

    const changeContents = (e) => {
        setContents(e.target.value);
    }

    const addPost = () => {
        dispatch(postActions.addPostFB(contents));
    }

    const editPost = () => {
        dispatch(postActions.editPostFB(post_id, {contents: contents}));
    }

    if(!is_login){
        return (
            <Grid margin="100px 0px" padding="16px" center>
              <Text size="32px" bold>앗! 잠깐!</Text>
              <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
              <Button
                _onClick={() => {history.replace("/login");}}>로그인 하러가기</Button>
            </Grid>
          );
    }

    return (
        <React.Fragment>
            <Grid padding="16px">
                <Text bold size="36px">{is_edit ? "게시글 수정" : "게시글 작성"}</Text>
                <Upload/>
            </Grid>

            <Grid padding="16px">
                <Text bold size="24px" margin="0px">미리보기</Text>
            </Grid>
            <Image 
            shape="rectangle"
            src={preview? preview : "http://via.placeholder.com/400x300"}
            />

            <Grid padding="16px">
                <Input 
                    value={contents}
                    _onChange={changeContents}
                    label="게시글 내용" 
                    placeholder="게시글을 입력해주세요" 
                    multiLine
                />
            </Grid>

            <Grid padding="16px">
                {is_edit ? (
                    <Button _onClick={editPost}>게시글 수정</Button>
                    ) : (
                    <Button _onClick={addPost}>게시글 작성</Button>
                    )}
            </Grid>
        </React.Fragment>
    )
}

export default PostWrite;