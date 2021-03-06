import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "../elements";

import Post from "../components/Post";
import InfinityScroll from "../shared/InfinityScroll";
import {actionCreators as postActions} from "../redux/modules/post";
import { history } from "../redux/configureStore";


const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    //게시글 하나에는 유저정보가 들어있음.
    //나도 로그인을 했으니 유저정보를 가지고 있음.(유저 리덕스에)
    //수정버튼을 달기 위해 유저정보 가져옴(uid가지고 비교)
    const user_info = useSelector((state) => state.user.user);
    const is_loading = useSelector((state) => state.post.is_loading)
    const paging = useSelector((state) => state.post.paging)

    console.log(post_list)

    React.useEffect(() => {
        //리스트 페이지에 들어오는 순간에 포스트를 가져와서 순서대로 나오지 않기 때문에
        //즉 리스트의 길이가 있으면 getPostFB를 하지 않음.
        //따라서 이미 있던 리덕스에서 제일 앞에 막 작성한 포스트가 추가됨
        //최신순 정렬은 무한스크롤 할때! 
        if(post_list.length < 2){
            dispatch(postActions.getPostFB());
        }
    }, [])
    

    return (
        <React.Fragment>
            <Grid bg={"#EFF6FF"} padding="20px 0px">
                <InfinityScroll
                    callNext={() => {
                        dispatch(postActions.getPostFB(paging.next));
                    }}
                    is_next={paging.next? true : false}
                    loading={is_loading}
                >
                    {post_list.map((p, idx) => {
                        //로그인을 안했을 경우(유저인포가 null일 경우)는 
                        //유저리덕스에 있는 유저인포를 찾을 수 없음
                        //옵셔널 체이닝 ?. 사용
                        //게시글 하나의 유저인포에 있는 유저아이디가 유저리덕스에 있는 유저인포의 uid와 같다면
                        //같은사람이니까 수정할 수 있도록 함
                        if (p.user_info.user_id === user_info?.uid){
                            return ( 
                            <Grid
                            key={p.id} 
                            bg="#ffffff"
                            margin="8px 0px"
                            _onClick={() => {
                            history.push(`/post/${p.id}`);
                            }}>
                                <Post {...p} is_me/>
                            </Grid>
                        )}else{
                            return (
                            <Grid
                            key={p.id}
                            bg="#ffffff"
                            margin="8px 0px"
                            _onClick={() => {
                            history.push(`/post/${p.id}`);
                            }}>
                                <Post {...p}/>
                            </Grid>
                        )}
                    })}
                </InfinityScroll>
            </Grid>
        </React.Fragment>
    )
}

export default PostList;