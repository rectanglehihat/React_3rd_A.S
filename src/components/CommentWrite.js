import React from "react";
import {Text, Grid, Button, Image, Input} from "../elements";

import {actionCreators as commnetActions} from "../redux/modules/comment";
import {useSelector, useDispatch} from "react-redux";


const CommentWrtire = (props) => {
    const dispatch = useDispatch();
    const [comment_text, setCommentText] = React.useState("");

    const {post_id} =props;
    const onChange = (e) => {
        setCommentText(e.target.value);
    }

    //버튼 클릭시 comment_text들고 파이어스토에에 요청하고 리덕스에 추가하는 함수
    //아래 인풋에 value넣은 이유는 코멘트 달고 나서는 인풋태그에 있는 밸류 날리려고
    const write = () => {
        console.log(comment_text)
        dispatch(commnetActions.addCommentFB(post_id, comment_text))
        setCommentText("");
    }

    return(
        <React.Fragment>
            <Grid padding="16px" is_flex>
                <Input 
                    placeholder="댓글을 입력해주세요!" 
                    _onChange={onChange} 
                    value={comment_text}
                    onSubmit={write}    //엔터키로 제출
                    is_submit
                />
                <Button width="50px" margin="0px 2px" _onClick={write}>작성</Button>  
            </Grid>
        </React.Fragment>
    )
}

export default CommentWrtire;