import React from "react";
import styled from "styled-components";
import {Text, Grid, Button} from "./index";

const Header = (props) => {
    return (
        <React.Fragment>
            <Grid is_flex padding="4px 16px">
                <Grid>
                    <Text margin="0" size="24px" bold>안녕</Text>
                </Grid>

                <Grid is_flex>
                    <Button bg="#141A46" text="로그인"></Button>
                    <Button bg="#141A46" text="회원가입"></Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

Header.defaultProps = {

}

export default Header;