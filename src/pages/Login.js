import React from "react";
import { Text, Grid, Input, Button } from "../elements"


const Login = (props) => {
    return (
        <React.Fragment>
            <Grid padding="16px">
                <Text size="32px" bold>로그인</Text>

                <Grid padding="16px 0px">
                    <Input
                        label="아이디"
                        placeholder="아이디를 입력해주세요."
                        _onChange={() => {console.log("아이디 입력!!")}}
                    />
                </Grid>

                <Grid padding="16px 0px">
                    <Input
                        label="패스워드"
                        placeholder="패스워드 입력해주세요."
                        _onChange={() => {console.log("패스워드 입력!!")}}
                        type="password"
                    />
                </Grid>
                <Button bg="#EC8B5E" text="로그인하기" _onclick={() => {console.log("로그인완료")}}></Button>
            </Grid>
        </React.Fragment>
    )
}

export default Login;