import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post";
import {actionCreators as postActions} from "../redux/modules/post";


const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);

    console.log(post_list)

    React.useEffect(() => {
        //리스트 페이지에 들어오는 순간에 포스트를 가져와서 순서대로 나오지 않기 때문에
        //즉 리스트의 길이가 있으면 getPostFB를 하지 않음.
        //따라서 이미 있던 리덕스에서 제일 앞에 막 작성한 포스트가 추가됨
        //최신순 정렬은 무한스크롤 할때! 
        if(post_list.length === 0){
            dispatch(postActions.getPostFB());
        }
    }, [])
    

    return (
        <React.Fragment>
            {/* <Post/> */}
            {post_list.map((p, idx) => {
                return <Post key={p.id} {...p} />
            })}
        </React.Fragment>
    )
}

export default PostList;