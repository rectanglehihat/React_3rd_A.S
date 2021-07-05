import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Grid from "../elements/Grid";

import PostList from "../pages/PostList";

function App() {
  return (
    <React.Fragment>
      <Grid>
        <BrowserRouter>
          <Route path="/" exact component={PostList}/>
        </BrowserRouter>
      </Grid>
    </React.Fragment>
  );
}

export default App;