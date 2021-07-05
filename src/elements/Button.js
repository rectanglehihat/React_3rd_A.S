import React from "react";
import styled from "styled-components";

const Button = (props) => {
    const {text, _onClick, color, bg} = props;

    return (
        <React.Fragment>
            <ElButton bg={bg} color={color} onClick={_onClick}>{text}</ElButton>
        </React.Fragment>
    )
}

Button.defaultProps = {
    text: false,
    _onClick: () => {},
    color: null,
    bg:  null,
}

const ElButton = styled.button`
    width: 100%;
    background-color: ${(props) => props.bg};
    color: #ffffff;
    padding: 12px 0px;
    box-sizing: border-box;
    border: none;
    ${(props) => (props.margin? `margin: ${props.margin};` : '')}
`;

export default Button;