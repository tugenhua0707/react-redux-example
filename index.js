
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/app';
import DevTools from './containers/devTools';
import { createStore, compose } from 'redux';
import todoApp from './reducers';

// 把多个store 增强器从右到左组合起来，依次执行
const enhancer = compose(
  DevTools.instrument()
);

let store = createStore(todoApp, enhancer);
render(
  <Provider store = {store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('app')
)