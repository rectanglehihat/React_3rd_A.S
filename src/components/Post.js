import React from "react";
import { Grid, Image, Text } from "../elements";

const Post = (props) => {

    return (
      <React.Fragment>
        <Grid>
            <Grid is_flex padding="16px">
                <Image shape="circle" src={props.src}/>
                <Text bold>{props.user_info.user_name}</Text>
                <Text>{props.insert_dt}</Text>
            </Grid>
            <Grid padding="16px">
                <Text>{props.contents}</Text>
            </Grid>
            <Grid>
                <Image shape="rectangle" src={props.src}/>
            </Grid>
            <Grid padding="16px">
                <Text bold>댓글 {props.comment_cnt}개</Text>
            </Grid>
        </Grid>
      </React.Fragment>
    );
}

Post.defaultProps = {
    user_info: {
        user_name: "hyoni",
        user_profile: "https://blog.kakaocdn.net/dn/qM9y8/btqU92Jmx90/DWzhLUYbCiz7PldqnIB1gK/img.jpg",
    },
    image_url:"https://blog.kakaocdn.net/dn/qM9y8/btqU92Jmx90/DWzhLUYbCiz7PldqnIB1gK/img.jpg",
    contents: "짤 부자 박명수",
    comment_cnt: 10,
    inert_dt: "2021-02-27 10:00:00",
}

export default Post;