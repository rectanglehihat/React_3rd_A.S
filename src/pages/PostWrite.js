import React from "react";
import {Text, Grid, Button, Image, Input} from "../elements"
import Upload from "../shared/Upload";

import {useSelector, useDispatch} from "react-redux";
import {actionCreators as postActions} from "../redux/modules/post"


const PostWrite = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login);
    const preview = useSelector((state) => state.image.preview);

    const {history} = props;

    const [contents, setContents] = React.useState('');

    const changeContents = (e) => {
        setContents(e.target.value);
    }

    const addPost = () => {
        dispatch(postActions.addPostFB(contents));
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
                <Text bold size="36px">게시글 작성</Text>
                <Upload>추가하기</Upload>
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
                <Button _onClick={addPost}>
                    게시글 작성
                </Button>
            </Grid>
        </React.Fragment>
    )
}

PostWrite.defaultProps = {

}

export default PostWrite;