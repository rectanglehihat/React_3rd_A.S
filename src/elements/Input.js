import React from "react";
import styled from "styled-components";
import {Text, Grid} from "./index";


const Input = (props) => {
    const {label, placeholder, _onChange, type, multiLine, value} = props;

    if(multiLine){
        return(
            <Grid>
                <Text>{label}</Text>
                <ElTextarea
                row={10}
                placeholder={placeholder}
                _onChange={_onChange}
                value={value}
                />
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid>
                <Text margin="0px">{label}</Text>
                <ElInput type={type} placeholder={placeholder} onChange={_onChange}/>
            </Grid>
        </React.Fragment>
    )
}

Input.defaultProps = {
    label: '텍스트',
    placeholder: '텍스트를 입력해주세요.',
    _onChange: () => {},
    type: 'text',
    multiLine: false,
    value: "",
}

const ElTextarea = styled.textarea`
    border: 1px solid #212121;
    width: 100%;
    padding: 12px 4px;
    box-sizing: border-box;
`;

const ElInput = styled.input`
    border: 1px solid #212121;
    width: 100%;
    padding: 12px 4px;
    box-sizing: border-box;
`;

export default Input;