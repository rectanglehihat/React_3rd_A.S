import React from "react";
import {Text, Grid, Button, Image, Input} from "../elements"

import { useSelector, useDispatch } from "react-redux";
import{actionCreators as commentActions} from "../redux/modules/comment"


const CommentList = (props) => {
    const dispatch = useDispatch();
    const comment_list = useSelector((state) => state.comment.list);

    console.log(comment_list)
    const{post_id} = props;

    //처음에 코멘트 정보가 없으면 불러오기
    React.useEffect(() => {
        if(!comment_list[post_id]){
            dispatch(commentActions.getCommentFB(post_id));
        }
    }, [])

    if(!comment_list[post_id] || !post_id){
        return null;
    }

    return (
        <React.Fragment>
            <Grid padding="16px">
                {comment_list[post_id].map(c => {
                    return <CommentItem key={c.id} {...c} />
                })}
            </Grid>
        </React.Fragment>
    )
}

CommentList.defaultProps = {
    post_id: null,
  };

export default CommentList;


const CommentItem = (props) => {

    const { user_profile, user_name, user_id, post_id, insert_dt, contents } = props;
    return (
        <Grid is_flex>
            <Grid is_flex width="auto">
                <Image shaple="circle"/>
                <Text bold>{user_name}</Text>
            </Grid>

            <Grid is_flex margin="0px 4px">
                <Text margin="0px">{contents}</Text>
                <Text margin="0px">{insert_dt}</Text>
            </Grid>
        </Grid>
    )
}

CommentItem.defaultProps = {
    user_profile: "",
    user_name: "mangsu",
    user_id: "",
    post_id: 1,
    contents: "나도 피거내",
    insert_dt: "2021-01-01 19:00:00",
}

//export안해도 됨