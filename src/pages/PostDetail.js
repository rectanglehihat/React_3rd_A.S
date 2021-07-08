import React from "react";
import Post from "../components/Post";
import CommentWrite from "../components/CommentWrite";
import CommentList from "../components/CommentList";

import { useSelector, useDispatch } from "react-redux";
import {actionCreators as postActions} from "../redux/modules/post"


const PostDetail = (props) => {
    const dispatch = useDispatch();

    const id = props.match.params.id;
    // console.log(id)

    // id에 맞는 게시글 정보 리덕스에서 가져오기
    const user_info = useSelector((state) => state.user.user);

    const post_list = useSelector(store => store.post.list);

    const post_idx = post_list.findIndex(p => p.id === id);
    const post = post_list[post_idx];

    // console.log(post)

    React.useEffect(() => {

        if(post){
            return;
        }

        dispatch(postActions.getOnePostFB(id));


    }, [])

    return (
        <React.Fragment>
            {post && <Post {...post} is_me={post.user_info.user_id === user_info?.uid}/>}
            <CommentWrite post_id={id}/>
            <CommentList post_id={id}t/>
        </React.Fragment>
    )
}

export default PostDetail;