import React, { useEffect } from "react";
import {Text, Grid, Button} from "../elements/index";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { history } from "../redux/configureStore";
import { apiKey } from "../shared/firebase";


const Header = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login);

    const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

    const is_session = sessionStorage.getItem(_session_key)? true : false;

    console.log(is_session)
    if(is_login){
        return(
            <React.Fragment>
                <Grid is_flex padding="4px 16px">
                    <Grid>
                        <Text margin="0" size="24px" bold>안녕</Text>
                    </Grid>
    
                    <Grid is_flex>
                        <Button bg="#141A46" text="내정보" _onClick={() => console.log("내정보 가기")}></Button>
                        <Button bg="#141A46" text="알림" _onClick={() => console.log("알림 가기")}></Button>
                        <Button bg="#141A46" text="로그아웃" _onClick={() => {dispatch(userActions.logOut({}))}}></Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        )    
    }

    return (
        <React.Fragment>
            <Grid is_flex padding="4px 16px">
                <Grid>
                    <Text margin="0" size="24px" bold>안녕</Text>
                </Grid>

                <Grid is_flex>
                    <Button bg="#141A46" text="로그인" _onClick={() => {
                        history.push('/login')
                    }}></Button>
                    <Button bg="#141A46" text="회원가입" _onClick={() => {
                        history.push('/signup')
                    }}></Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

Header.defaultProps = {

}

export default Header;