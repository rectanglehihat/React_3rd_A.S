import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup"
import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail"

import Header from "../components/Header";
import Grid from "../elements/Grid";
import Button from "../elements/Button";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user"
import { apiKey } from "./firebase"

import Permit from "./Permit"


function App() {
  const dispatch = useDispatch();

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key)? true : false;

  //컴포넌트 디드마운트, 업데이트 비슷. []에 인자가 없으면 안에 들어간 함수가 한번만 실행하니 디드마운트 역할
  React.useEffect(() => {
    
    if(is_session){
      dispatch(userActions.loginCheckFB());
    }

  }, [])

  return (
    <React.Fragment>
      <Grid>
        <Header/>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/signup" exact component={Signup}/>
          <Route path="/write" exact component={PostWrite}/>
          <Route path="/post/:id" exact component={PostDetail}/>
        </ConnectedRouter>
      </Grid>
      <Permit>
        <Button is_float text="+" _onClick={() => history.push('/write')}></Button>
      </Permit>
    </React.Fragment>
  );
}

export default App;