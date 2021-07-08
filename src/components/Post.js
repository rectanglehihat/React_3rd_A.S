import React from "react";
import { Grid, Image, Text, Button } from "../elements";
import { history } from "../redux/configureStore";

import HeartButton from "./HeartButton"

import { useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";


const Post = (props) => {
    const dispatch = useDispatch();

    return (
      <React.Fragment>
        <Grid>
            <Grid is_flex padding="16px">
                <Grid is_flex width="auto">
                    <Image shape="circle" src={props.src}/>
                    <Text bold>{props.user_info.user_name}</Text>
                </Grid>
                <Grid is_flex width="auto">
                    <Text>{props.insert_dt}</Text>
                    {props.is_me && 
                    <Button width="auto" padding="4px" margin="4px" _onClick={() => 
                        {history.push(`/write/${props.id}`)}}>
                        수정</Button>}
                </Grid>
            </Grid>

            <Grid padding="16px">
                <Text>{props.contents}</Text>
            </Grid>

            <Grid>
                <Image shape="rectangle" src={props.image_url}/>
            </Grid>
            
            <Grid is_flex padding="16px">
                <Text margin="0px" bold>댓글 {props.comment_cnt}개</Text>
                <Grid is_flex  width="auto">
                    <Text margin="0px" bold>
                        좋아요 {props.like_cnt}개
                    </Text>
                    <HeartButton
                        _onClick={(e) => {
                        //  이벤트 캡쳐링과 버블링을 막아요!
                        // 이벤트 캡쳐링, 버블링이 뭔지 검색해보기! :)
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(postActions.toggleLikeFB(props.id));
                        }}
                        is_like={props.is_like}
                    ></HeartButton>
                </Grid>
            </Grid>
        </Grid>
      </React.Fragment>
    );
}

Post.defaultProps = {
    user_info: {
        user_name: "방맹수",
        user_profile: "https://blog.kakaocdn.net/dn/qM9y8/btqU92Jmx90/DWzhLUYbCiz7PldqnIB1gK/img.jpg",
    },
    image_url:"https://blog.kakaocdn.net/dn/qM9y8/btqU92Jmx90/DWzhLUYbCiz7PldqnIB1gK/img.jpg",
    contents: "어후 피곤해! 어흐↗ 어흐으↗",
    comment_cnt: 10,
    insert_dt: "2021-02-27 10:00:00",
    is_me: false,
    like_cnt: null,
    is_like: false,
}

export default Post;