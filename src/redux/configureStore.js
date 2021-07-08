import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";
import Comment from "./modules/comment";


// history를 스토어에서도 쓸 수 있도록 
export const history = createBrowserHistory();
// 리듀서 여러개일 때 하나로 묶기
const rootReducer = combineReducers({
    user: User,
    post: Post,
    image:Image,
    comment: Comment,
    router: connectRouter(history),
  });

// 비동기 갔다 와서 history사용 가능해짐 (.then 이후에 history 쓸 수 있음)
const middlewares = [thunk.withExtraArgument({history:history})];

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;
// 개발환경에서만 편하려고 사용(import안하고 if문 안에만 들어왔을때 사용. 즉 배포됐을때는 안보임)
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

// 크롬 확장프로그램 redux devTools
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

// 미들웨어 믂기
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// 스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();