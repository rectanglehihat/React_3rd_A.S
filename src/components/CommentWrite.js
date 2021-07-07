import React from "react";
import {Text, Grid, Button, Image, Input} from "../elements"
import CommentList from "./CommentList";


const CommentWrtire = (props) => {
    return(
        <React.Fragment>
            <Grid padding="16px" is_flex>
                <Input placeholder="댓글을 입력해주세요!"/>
                <Button width="50px" margin="0px 2px">작성</Button>
                
            </Grid>
            <CommentList/>

        </React.Fragment>
    )
}

export default CommentWrtire;