import React from "react";
import styled from "styled-components";

const Button = (props) => {
    const {text, _onClick, is_float, children, margin, width, padding} = props;

    const styles = {
        margin: margin,
        width: width,
        padding: padding,
      };

    if (is_float){
        return(
            <React.Fragment>
                <FloatButton onClick={_onClick}>{text ? text : children}</FloatButton>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <ElButton {...styles} onClick={_onClick}>{text ? text : children}</ElButton>
        </React.Fragment>
    )
}

Button.defaultProps = {
    text: false,
    children:null,
    _onClick: () => {},
    is_float: false,
    margin: false,
    width: "100%",
    padding: "12px 0px",
}

const ElButton = styled.button`
    width: ${(props) => props.width};
    background-color: #212121;
    color: #ffffff;
    padding: 12px 0px;
    box-sizing: border-box;
    border: none;
    padding: ${(props) => props.padding};
    ${(props) => (props.margin? `margin: ${props.margin};` : '')}
`;

const FloatButton = styled.button`
    width: 50px;
    height: 50px;
    background-color: #212121;
    color: #ffffff;

    box-sizing: border-box;
    font-size: 36px;
    font-weight: 800;
    position: fixed;
    bottom: 50px;
    right: 16px;
    text-align: center;
    border: none;
    border-radius: 50px;
    vertical-align: middle;
`;

export default Button;