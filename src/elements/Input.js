import React from "react";
import styled from "styled-components";
import {Text, Grid} from "./index";


const Input = (props) => {
    const {label, placeholder, _onChange, type, multiLine, value, is_submit, onSubmit} = props;

    if(multiLine){
        return(
            <Grid>
                {label && <Text margin="20px 0px 0px 0px">{label}</Text>}
                <ElTextarea
                rows={10}
                value={value}
                placeholder={placeholder}
                onChange={_onChange}
                value={value}
                />
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid>
                {label && <Text margin="0px">{label}</Text>}
                {is_submit ? (    //로그인시 입력 안되는거는 value때문. 그래서 나눠줌.
                    <ElInput                  
                        type={type} 
                        placeholder={placeholder} 
                        onChange={_onChange} 
                        value={value}
                        onKeyPress={(e) => {
                            if(e.key === "Enter"){
                                onSubmit(e);
                            }
                        }}
                        />
                ) : (
                    <ElInput                  
                        type={type} 
                        placeholder={placeholder} 
                        onChange={_onChange} 
                        />
                )
            }
            </Grid>
        </React.Fragment>
    )
}

Input.defaultProps = {
    label: false,
    placeholder: '텍스트를 입력해주세요.',
    _onChange: () => {},
    type: 'text',
    multiLine: false,
    value: "",
    is_submit: false,  //작성 버튼 누른 후 인풋에 있던 글 없애려고
    onSubmit: () => {},
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