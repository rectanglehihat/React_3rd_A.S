import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Grid from "../elements/Grid";

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Header from "../elements/Header";
import Signup from "../pages/Signup"

function App() {
  return (
    <React.Fragment>
      <Grid>
        <Header/>
        <BrowserRouter>
          <Route path="/" exact component={PostList}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/signup" exact component={Signup}/>
        </BrowserRouter>
      </Grid>
    </React.Fragment>
  );
}

export default App;