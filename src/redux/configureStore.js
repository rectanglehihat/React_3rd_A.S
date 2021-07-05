import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";

// history를 스토어에서도 쓸 수 있도록 
export const history = createBrowserHistory();

const rootReducer = combineReducers({
    user: User,
    router: connectRouter(history),
  });

// 비동기 갔다 와서 history사용 가능해짐 (.then 이후에 history 쓸 수 있음)
const middlewares = [thunk.withExtraArgument({history:history})];

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}


const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;


const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
    );


let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();