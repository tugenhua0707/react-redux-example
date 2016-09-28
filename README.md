## React 数据流管理架构之 Redux 详细介绍
<h3>著名的flux的单向数据流图：</h3>
<pre>
                 _________               ____________               ___________
                |         |             |            |             |           |
                | Action  |------------▶| Dispatcher |------------▶| callbacks |
                |_________|             |____________|             |___________|
                     ▲                                                   |
                     |                                                   |
                     |                                                   |
 _________       ____|_____                                          ____▼____
|         |◀----|  Action  |                                        |         |
| Web API |     | Creators |                                        |  Store  |
|_________|----▶|__________|                                        |_________|
                     ▲                                                   |
                     |                                                   |
                 ____|________           ____________                ____▼____
                |   User       |         |   React   |              | Change  |
                | interactions |◀--------|   Views   |◀-------------| events  |
                |______________|         |___________|              |_________|

</pre>

<p>我们为什么需要这么一个单向数据流程？</p>
<p>我们先来看看MVC流程：</p>
<p>1. 模板/html = View</p>
<p>2. 填充视图的数据 = Model</p>
<p>3. 获取数据，将所有的视图组装在一起，响应用户事件，数据操作等等逻辑 == Controller</p>
<p>MVC流程和我们的flux流程或者Redux很相似，</p>
<p>1. Model 看起来像 Store，</p>
<p>2. 用户事件，数据操作 以及他们的处理程序 像 action creators -> action -> dispatcher -> callback</p>
<p>3. views 看起来像 React Views .</p>
<h3>一：上面提到action的概念, 那么什么是action呢？</h3>
<p>比如获取数据是一个action，一个点击也是一个action,等等，flux的action 首先通过调用 dispatcher -> 然后再是 Store，->
 最后通知所有的store监听器。</p>
<p>那么MVC和flux有什么不同呢？</p>
<p>下面是一个mvc的用列~</p>
<p>1）用户点击按钮A</p>
<p>2）点击按钮A的处理程序触发Model A的改变。</p>
<p>3）Model A的改变处理程序会触发Model B的改变。</p>
<p>4）Model B的改变处理程序会触发ModelB的自身重新渲染。</p>
<p>MVC中当一个应用程序出现bug的时候不好定位，因为每个view可以监听任何的Model，并且每个Model可以监听其他所有的Model，
 数据从很多模型来。</p>
<p>flux是单向数据流，flux的流程如下：</p>
<p>1) 用户点击按钮A</p>
<p>2）点击按钮A的处理程序会触发一个被分发的action，并改变StoreA；</p>
<p>3）其他的Store也被这个action通知了，所以StoreB也会对相同的action做出反应。</p>
<p>4）ViewB 因为Store A 和 Store B 的改变而收到通知，并重新渲染。</p>
<p>Store 只能被 action 修改，并且当所有的Store响应了action后，View才会最终更新，所以单向数据流过程就是如下：
 action --> store ---> view --> action --> view --> action -->.....</p>
<h3>二：什么是action creator? 它是如何关联到 action的呢？</h3>
<pre>
  var actionCreator = function(){
    // 负责构建一个action 并返回它
    return {
      type: 'AN_ACTION'
    }
  }
</pre>
<p>actionCreator 就是一个函数而已；flux一般约定action的格式是一个拥有type属性的对象，type决定如何处理action，当然action也可以有其他的属性，看自己的需要。
 我们可以直接调用actionCreator方法，我们就会得到一个action;</p>
<p>console.log(actionCreator);
 // 输出 {type:'AN_ACTION'}</p>
<p>不过上面的代码没有什么实际用处，但是在实际场景中，我们需要的是将action发送到某个地方，那么这样的过程我们称之为分发 action(Dispatching an action).
 为了分发action，我们需要一个分发函数，且 为了让任何对它感兴趣的人都感知到action的发起，我们需要一个注册处理器(handler)的机制。
 这些action的 "处理器" 在flux应用中被叫做 store。 因此流程变为 ActionCreator -> Action</p>
<h3>三：学习Redux</h3>
<p>在实际使用当中，我们不仅需要action告诉我们会发生什么，还需要告诉我们需要随之更新数据。因此我们需要提出如下疑问：</p>
<p>1. 如何在应用程序的整个生命周期内维持所有的数据？</p>
<p>2. 如何修改这些数据？</p>
<p>3. 如何把数据变更传播到整个应用程序？</p>
<p>因此Redux就来了， Redux 是一个 "可预测化状态的 javascript 容器"。</p>
<p>对于第一个问题：我们可以以我们想要的方式来维持这些数据，比如javascript对象，数组，不可变数据等。对于第二个问题：如何修改这些数据？
  我们可以使用reducer 函数修改数据，reducer函数是action的订阅者，它接收应用程序的当前状态以及发生的action，然后返回修改后的新状态。
  对于第三个问题：如何把数据变更传播到整个应用程序？</p>
<p>使用订阅者的方法来监听状态的变更情况。</p>
<p>总之：redux 提供了如下：</p>
<p>1) 存放应用程序状态的容器。</p>
<p>2） 一种把action 分发到 状态修改的机制，也就是 reducer的函数。</p>
<p>3）监听状态变化的机制。</p>
<p>我们把Redux实例叫做 store，并且使用以下方式创建：</p>
<pre>import { createStore } from 'redux'
  var store = createStore(() => {})</pre>
<p>在Redux中，Reducer与Store有什么区别？简单的来理解是：Store可以保存你的data, 而Reducer不行的，在创建Redux实例之前，需要给它一个reducer
  函数，所以每当一个action发生时，Redux都能调用这个函数。在往createStore传Reducer的过程就是给Redux绑定action的处理函数的过程。如下：</p>
<pre>
  import { createStore } from 'redux';
  var reducer = function(...args) {
    console.log("Reducer was called with args",args);
  }
  var store = createStore(reducer);
  // 输出：Reducer was called with args [ undefined, { type: '@@redux/INIT' } ]</pre>
<p>如上我们代码中并没有调用dispatch任何action，但是reducer函数被调用了，这是因为在初始化应用state的时候，Redux dispatch了一个初始化
  action({type:'@@redux/INIT'}); 在被调用时，一个reducer会得到这些参数(state,action)，在应用初始化时，state还没被初始化，因此它的值为undefined；</p>
<h3>4. 如何从 Redux 实例中 读取 state?</h3>
<p>如下代码：</p>
<pre>
   import { createStore } from 'redux';
   var reducer1 = function(state, action) {
      console.log("Reducer1 was called with args",state,'and action', action);
      // 输出 Reducer1 was called with args undefined and action { type: '@@redux/INIT' }
    }
    var store1 = createStore(reducer1);
    // 读取redux 保存的state，可以调用 getState
    console.log(store1.getState());  // undefined 
</pre>
<p>现在我们试着在 reducer 收到undefined的state的时候，给程序一个初始状态。如下代码：</p>
<pre>
  import { createStore } from 'redux';
  var reducer1 = function(state, action) {
    console.log("Reducer1 was called with args",state,'and action', action);
    // 输出 Reducer1 was called with args undefined and action { type: '@@redux/INIT' }
    if(typeof state === "undefined") {
      return {};
    }
    return state;
  }
  var store1 = createStore(reducer1);
  console.log(store1.getState());  // {} 
</pre>
<p>
  现在 Redux 初始化以后返回的state 变成 {} 了；现在我们使用ES6的语法，把上面的代码改成如下样子了；
</p>
<pre>
  import { createStore } from 'redux';
  var reducer1 = function(state = {}, action) {
    console.log("Reducer1 was called with args",state,'and action', action);
    // 输出 Reducer1 was called with args {} and action { type: '@@redux/INIT' }
    return state;
  }
  var store1 = createStore(reducer1);
  console.log(store1.getState());  // {} 
</pre>
<p>下面是一个简单的Redux完整的demo，如下：</p>
<pre>
  import { createStore } from 'redux';
  function reducer(state = 0, action) {
    switch(action.type) {
      case 'INCREMENT':
        return state + 1;

      case 'DECREMENT':
        return state - 1;

      default:
       return state;
    }
  }
  let store = createStore(reducer);
  // 监听事件
  store.subscribe(() => 
    console.log(store.getState());  // 1
  )
  // 分发一个action 
  store.dispatch({ type : 'INCREMENT'});
</pre>
<h3>5. 理解combine-reducers</h3>
<p>假如页面上有多个action的话，如果我们只有一个reducer的话，那么就不好管理，因此我们可以新建多个reducer来处理相对应的action，最后
     我们使用combineReducers 来合并所有的单个的reducer，得到一个全局的reducer；如下代码 两个reducer；代码如下：</p>
<pre>
  import { createStore, combineReducers } from 'redux';

  // reducer1 
  var reducer1 = function(state = {}, action) {
    console.log('reducer1 was called with state', state, 'and action', action);
    // 输出 reducer1 was called with state {} and action {type: "@@redux/INIT"}
    // 输出 reducer1 was called with state {} and action {type: "@@redux/PROBE_UNKNOWN_ACTION_t.4.p.r.d.t.0.9.g.g.3.j.h.j.5.g.6.6.r"}
    switch (action.type) {
      case 'add':
        return {
          ...state,
          message: action.value
        }
      default:
        return state;
    }
  }
  // reducer2
  var reducer2 = function(state = [], action) {
    console.log('reducer1 was called with state', state, 'and action', action);
    // 输出 reducer1 was called with state [] and action {type: "@@redux/INIT"}
    // 输出 reducer1 was called with state [] and action {type: "@@redux/PROBE_UNKNOWN_ACTION_j.x.9.m.m.0.2.x.y.w.9.u.b.w.c.2.3.x.r"}
    switch (action.type) {
      case 'add1':
        return {
          ...state,
          message: action.value
        }
      case 'add2':
        // ....
      default:
        return state;
    }
  };
  var rootReducer = combineReducers({
    reducer1 : reducer1,
    reducer2 : reducer2
  });
  var store = createStore(rootReducer);
  console.log('store1 state init:', store.getState());
  // 输出 store1 state init: {reducer1: {}, reducer2: []}
  // 我们发现Redux 正确处理了 state的 各个部分，最终的 state完全是一个简单的对象，由 reducer1 和 reducer2 返回的部分 state 共同组成。
  // {reducer1: {}, reducer2: []}
</pre>
<p> 如上：1. 赋值给 reducer1 的初始state是一个空对象，即{}<br/>
         2. 赋值给 reducer2 的初始state 是一个空数组，即 []<br/>
    在上面多个reducer的模式下，我们可以让每个reducer 只处理 整个应用的部分state，但是我们知道，createStore 只接收一个reducer的函数，
    那么我们需要使用combineReducers 来合并所有的单个的reducer。</p>
<h3>6. 理解 dispatch-action</h3>
<p>我们绑定了 reducer，但我们还未dispatch 任何一个action，我们现在使用reducer来处理一些action的操作。</p>
<pre>
  import { createStore, combineReducers } from 'redux';

  // reducer1 
  var reducer1 = function(state = {}, action) {
    console.log('reducer1 was called with state', state, 'and action', action);
    // 输出 reducer1 was called with state {} and action {type: "@@redux/INIT"}
    // 输出 reducer1 was called with state {} and action {type: "@@redux/PROBE_UNKNOWN_ACTION_t.4.p.r.d.t.0.9.g.g.3.j.h.j.5.g.6.6.r"}
    switch (action.type) {
      case 'add':
        return {
          ...state,
          name: action.name
        }
      default:
        return state;
    }
  }
  // reducer2
  var reducer2 = function(state = [], action) {
    console.log('reducer1 was called with state', state, 'and action', action);
    // 输出 reducer1 was called with state [] and action {type: "@@redux/INIT"}
    // 输出 reducer1 was called with state [] and action {type: "@@redux/PROBE_UNKNOWN_ACTION_j.x.9.m.m.0.2.x.y.w.9.u.b.w.c.2.3.x.r"}
    switch (action.type) {
      case 'add1':
        return {
          state: state,
          item: action.item
        }
      case 'add2':
        return {
          state: state,
          item: action.item
        }
      default:
        return state;
    }
  };

  var rootReducer = combineReducers({
    reducer1 : reducer1,
    reducer2 : reducer2
  });

  var store = createStore(rootReducer);
  console.log('store1 state init:', store.getState());
  // 输出 store1 state init: {reducer1: {}, reducer2: []}
  // 让我们来dispatch我们的第一个action，为了dispatch一个action，我们需要一个dispatch函数，它会传递action。
  store.dispatch({
    type: 'add',
    name: 'kongzhi'
  });
  console.log('store1 state after:', store.getState());
  // store1 state after {reducer1:{name:'kongzhi'}, reducer2: []}
</pre>
<h3>7. dispatch-async-aciton （异步场景下的action）</h3>
<p>在上面 是同步如何分发 action 以及这些 action 如何通过 reducer 函数修改应用状态。准确地说是同步 action creator，它创建同步的 action，
  也就是当 action creator 被调用时，action 会被立即返回。
  现在我们来考虑下如何使用异步分发action，我希望的是用户点击按钮A后，过两秒后更新视图view，然后显示一个消息hello world；</p>
<pre>
  import { createStore, combineReducers } from 'redux';
   // reducer1 
   var reducer1 = function(state = {}, action) {
      console.log('reducer1 was called with state', state, 'and action', action);
      // 输出 reducer1 was called with state {} and action {type: "@@redux/INIT"}
      // 第二次输出 reducer1 was called with state {} and action {type: "add", message: "hello world"}
      switch (action.type) {
        case 'add':
          return {
            ...state,
            name: action.message
          }
        default:
          return state;
      }
   }
   var store = createStore(reducer1);
  // 下面我们希望像下面一样输出，但是会报错，因为延迟了2秒后，初始化的时候返回的不是一个对象
  var asyncActionCreator = function(msg) {
    setTimeout(function(){
      return {
        type: 'add',
        msg
      }
    },2000)
  };
  console.log("异步输出信息如下");
  store.dispatch(asyncActionCreator("hello world"));

  //下面继续优化异步的情况下 先返回一个function，该function在合适的时间dispatch一下，代码变成如下：
  var asyncActionCreator2 = function(msg) {
    return function(dispatch) {
      setTimeout(function(){
        dispatch({
          type: 'add',
          msg
        })
      },2000)
    }
  };
  console.log("异步优化如下");
  store.dispatch(asyncActionCreator2("hello world"));
  // 但是上面的代码 运行后一样会报错 如下：Uncaught Error: Actions must be plain objects. Use custom middleware for async actions.
</pre>
<h3>8. 理解 middleware 中间件</h3>
<p>什么是中间件？</p>
<p>一般来说中间件是在某个应用中A和B部分中间的那一块，比如A ----> B,那么使用中间件就会变成如下：
</p>
<p>A --> middleware1 ---> middleware2 ----> middleware3--->....----> B</p>
<p>那么中间件在Redux中是如何工作的？</p>
<p>在Redux中 的 action creator 和 reducer 之间增加一个中间件，就可以把函数转成适合Redux处理的内容。
     action ---> dispatcher ---> middleware1 --> middleware2 --> reducer
     每当一个action（或者异步的action中的某个函数）被分发时，我们的中间件就会被调用，并且在需要的时候协助 action creater 分发真正的action。
     在Redux中，中间件就是纯碎的函数。</p>
<pre>
  // 中间件遵循以下格式
    var oneMiddleware = function({dispatch,getState}) {
      return function(next) {
        return function (action) {
          // 中间件其他代码
        }
      }
    };
</pre>
<p>中间件由三个嵌套函数构成(依次调用)：</p>
<p>1）第一层向其余两层提供分发函数dispatch 和 getState函数。</p>
<p>2）第二层提供next函数，允许我们显示的将处理过的输入传递给下一个中间件或Redux。(这样的话Redux可以调用所有的Reducer)。</p>
<p>3）第三层提供从上一个中间件或从dispatch传递来的action。（这个action可以调用下一个中间件）。</p>
<p>Redux 给我们提供 异步 action creator 的中间件叫 thunk middleware, github代码在 https://github.com/gaearon/redux-thunk</p>
<p>代码如下：</p>
<pre>
  var thunkMiddleware = function({dispatch, getState}) {
    return function(next) {
      return function(action) {
        return typeof action === 'function' ? action(dispatch, getState) : next(action)
      }
    }
  };
</pre>
<p>为了让 Redux 知道我们有一个或多个中间件，我们可以使用Redux的 辅助函数 applyMiddleware, applyMiddleware 接收所有中间件作为参数，返回一个供ReduxcreateStore 调用的函数。当最后这个函数被调用时候，会产生一个Store增强器，用来将所有中间件应用到 Store的 dispatch上。
（https://github.com/rackt/redux/blob/v1.0.0-rc/src/utils/applyMiddleware.js）
下面是一个demo 如何将一个中间件 应用到 Redux store。</p>
<pre>
  import { createStore, combineReducers, applyMiddleware } from 'redux';

  var thunkMiddleware = function ({ dispatch, getState }) {
      return function(next) {
        return function (action) {
          return typeof action === 'function' ?
              action(dispatch, getState) :
              next(action)
        }
      }
  }
  const finalCreateStore = applyMiddleware(thunkMiddleware)(createStore);
  // 如果有多个中间件，可以使用 applyMiddleware(middleware1,middleware2,....)(createStore);
  var reducer1 = function(state = {}, action){
    console.log('reducer1 was called with state', state, 'and action', action);
    // 输出 reducer1 was called with state {} and action {type: "@@redux/INIT"}
    // 第二次输出 reducer1 was called with state {} and action {type: "@@redux/PROBE_UNKNOWN_ACTION_8.j.w.w.c.n.w.m.v.9.n.f.z.v.a.k.b.j.4.i"}
    // reducer1 was called with state {} and action {type: "@@redux/INIT"}
    switch (action.type) {
      case 'add':
        return {
          ...state,
          name: action.message
        }
      default:
        return state;
    }
  };
  var rootReducer = combineReducers({
    // reducer1 
    reducer1: reducer1
  });
  const store = finalCreateStore(rootReducer);
  // 上面代码可以正常运行了；我们现在再来看看异步action
  var asyncActionCreator = function(msg) {
    return function(dispatch) {
      setTimeout(function(){
        dispatch({
          type: 'add',
          msg
        })
      },2000)
    }
  };
  store.dispatch(asyncActionCreator("hello world"));

  // 2秒后 输出reducer1 was called with state {} and action  {type: "add", msg: "hello world"}
  // 2秒后 action被成功的发出去了


  // 再来看一个 log的中间件, 同时一样使用如下demo，来看看会输出什么
  function logMiddleware({dispatch, getState}) {
    return function(next) {
      return function(action) {
        console.log('logMiddleware action received:', action)
        return next(action);
      }
    }
  }
  // 通过使用 logMiddleware 试着修改上述的 finalCreateStore 调用
  const finalCreateStore2 = applyMiddleware(logMiddleware,thunkMiddleware)(createStore);
  var logReducer = function(state = {}, action){
    console.log('logReducer was called with state', state, 'and action', action);
    // 输出 logReducer was called with state {} and action {type: "@@redux/INIT"}
    // 第二次输出 logReducer was called with state {} and action {type: "@@redux/PROBE_UNKNOWN_ACTION_8.j.w.w.c.n.w.m.v.9.n.f.z.v.a.k.b.j.4.i"}
    // logReducer was called with state {} and action {type: "@@redux/INIT"}
    switch (action.type) {
      case 'add':
        return {
          ...state,
          name: action.message
        }
      default:
        return state;
    }
  };
  var rootReducer = combineReducers({
    // logReducer 
    logReducer: logReducer
  });
  const store2 = finalCreateStore2(rootReducer);
  // 上面代码可以正常运行了；我们现在再来看看异步action
  var asyncActionCreator2 = function(msg) {
    return function(dispatch) {
      setTimeout(function(){
        dispatch({
          type: 'add',
          msg
        })
      },2000)
    }
  };
  store2.dispatch(asyncActionCreator2("logReducer"));
</pre>
<p>到现在为止：</p>
<p>1）我们知道怎样写 action 和 action creator</p>
<p>2）我们知道怎么样分发action。</p>
<p>3）我们知道怎样利用中间件处理action，比如异步action。</p>
<p>对于flux流程，我们还剩下唯一的的是 如何订阅 state的更新，并且响应这些的更新；</p>
<h3>9. 理解 state-subscribe.js</h3>
<p>现在我们的flux的闭环 差最后一个了；如下：</p>
<pre>
    _________      _________       ___________
   |         |    | Change  |     |   React   |
   |  Store  |----▶ events  |-----▶   Views   |
   |_________|    |_________|     |___________|
</pre>
<p>监听Redux store更新有一个很简单的办法，如下</p>
<pre>
  store.subscribe(function(){
    console.log(store.getState());
  })
</pre>
<p>下面是一个demo如下：</p>
<pre>
  import { createStore, combineReducers } from 'redux';
   var itemsReducer = function(state = [], action) {
     switch (action.type) {
        case 'ADD_ITEM':
          return [
            ...state,
            action.item
          ]
        default:
          return state;
      }
   }; 
   var rootReducer = combineReducers({
     items:itemsReducer
   });
   var store = createStore(rootReducer);
   store.subscribe(function(){
     console.log('store has been updated. Latest store state:', store.getState());
     // 输出 store has been updated. Latest store state:{ items: [ { id: 1234, description: 'anything' } ] }
     // 在这里更新你的视图
   });
   var addItemActionCreator = function(item) {
     return {
       type: 'ADD_ITEM',
       item: item
     }
   };
  store.dispatch(addItemActionCreator({id:1234, description: 'anything'}));
</pre>
<p>我们的订阅回调成功的调用了，同时 store 现在包含了我们新增的条目。
    我们的订阅回调没有把state作为参数，为什么？既然我们没有接收新的state，我们就不能更新state的，那我们如何更新视图，如何取消订阅，如何和react一起使用？</p>
<h3>10. 理解bindActionCreators 的使用</h3>
<p>上面的 addItemActionCreator 是我们的生成 action的，所以在实际的使用中，我们使用store.dispatch(action),因此我们和上面一样，需要
    这样调用 store.dispatch(addItemActionCreator(...arg));借鉴Store对reducer的封装(减少传入的state的参数)，可以对store.dispatch
    进行再一层的封装，将多个参数转化为单个参数的形式。Redux提供了bindActionCreators就做了这件事。<br/>
    var actionCreators = bindActionCreators(actionCreators, store.dispatch);<br/>
    经过bindActionCreators 包装过后的action Creators形成了具有改变全局的state数据的多个函数，将这些函数分发到各个地方。即能通过
    调用这些函数改变全局的state。</p>
<h3>11 理解React-Redux</h3>
<p>react-redux提供了2个重要的对象，Provider 和 connect， 前者使 React 组件可被连接，后者把 React 组件和 Redux 的 store 真正连接起来。
     先来看一个简单的demo，如下：</p>
<pre>
  import { createStore } from 'redux';
  function counter(state = 0, action) {
    switch(action.type) {
      case 'INCREASE':
        return state + 1;

      case 'DECREASE':
        return state - 1;

      default:
       return state;
    }
  }
  let store = createStore(counter);
  store.subscribe(() => 
    console.log(store.getState())
  )
  const actions = {
    increase: () => ({type: 'INCREASE'}),
    decrease: () => ({type: 'DECREASE'})
  }
  store.dispatch(actions.increase()); // 1
  store.dispatch(actions.increase()); // 2
  store.dispatch(actions.increase()); // 3
</pre>
<p>使用createStore创建reducer，生成一个store，然后使用store.dispatch分发一次action，就执行一次，store内的数据就会响应的改变。</p>
<h4>1. connect 详解</h4>
<p>connect函数接收四个参数 他们分别是 mapStateToProps, mapDispatchToProps, mergeProps,和 options。
     connect([mapStateToProps],[mapDispatchToProps],[mergeProps],[options]),connect 方法完整的API如下：</p>
<pre>
  import { connect } from 'react-redux'
  const Todo = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoFunc)
</pre>
<p>上面代码中，connect方法接受2个参数：mapStateToProps 和 mapDispatchToProps. 前者负责输入逻辑，即将state映射到UI组件的参数(props)
     ，后者负责输出逻辑，即将用户对UI组件的操作映射成Action。</p>
<p>1) mapStateToProps 是一个函数，果是函数的话，执行后应该返回一个对象，里面的每一个键值对就是一个映射。比如如下代码：</p>
<pre>
  const mapStateToProps = (state) => {
    return {
      todos: xxTodo(state.todos, state.action)
    }
  }
</pre>
<p>mapStateToProps是一个函数，它接收state作为参数，返回一个对象，这个对象有一个todos属性，后面的xxTodo也是一个函数。可以从state算出
     todos的值。如下代码：</p>
<pre>
  const xxTodo = (todos, action) => {
   switch(action) {
     case 'SHOW_All':
       return todos
     case 'SHOW_COMPLETED':
       return todos.xx
     default:
      throw new Error("Unknow filter:"+todos)
   }
  }
</pre>
<p>mapStateToProps会订阅Store，每当state更新的时候，就会自动执行，重新计算UI组件的参数，从而触发UI组件的重新渲染。</p>
<p>mapStateToProps的第一个参数总是state对象，还可以有第二个参数，代表容器组件的props对象。</p>
<p>connect方法也可以省略 mapStateToProps 参数，如果省略的话，UI组件不会订阅Store，也就是说Store的更新不会引起UI组件的更新。</p>
<h4>2) mapDispatchToProps():</h4>
<p>该方法是connect的第二个参数，用来建立UI组件的参数到 store.dispatch 方法的映射，也就是说，定义了那些用户的操作应该当做Action，
     传给Store，它可以是一个函数，也可以是一个对象。如果是函数的话，会得到dispatch，ownProps(容器组件的props对象)的两个参数。</p>
<pre>
  const mapDispatchToProps = (
      dispatch,
      ownProps
   ) => {
     return {
        onClick: () => {
          dispatch({
            type: 'xxxx'
          });
        }
     }
   }
</pre>
<p>mapDispatchToProps 作为函数，应该返回一个对象，该对象的每个键值对都是一个映射，定义了UI组件的参数怎样发出Action。
     如果mapDispatchToProps 是一个对象，它的每个键名也是对应UI组件的同名参数，键值应该是一个函数，会被当做 Action creator，
     返回的Action会由Redux自动发出。比如如下代码：</p>
<pre>
  const mapDispatchToProps = {
     onClick: (filter) => {
       type: 'xxx'
     }
   }
</pre>
<h4>3) Provider 组件</h4>
<p>connect方法生成容器组件后， 需要让容器组件拿到 state对象，才能生成UI组件的参数。React-Redux 提供 Provider 组件， 可以让容器组件拿到state。比如如下代码：</p>

    import { Provider } from 'react-redux'
    import { createStore } from 'redux'
    import todoApp from './reducers'
    import App from './components/App'

    let store = createStore(todoApp);
    render(
     <Provider store = {store}>
       <App />
     </Provider>,
     document.getElementById('root')
    ) 

<p>代码中，Provider在根组件外面包了一层，这样的花，App的所有子组件默认都可以拿到state了。下面来看一个demo
     </p>
<p>下面是一个计数器组件，它是一个纯的 UI 组件。</p>
    class Counter extends Component {
      render() {
        const { value, onIncreaseClick } = this.props
        return (
          <div>
            <span>{value}</span>
            <button onClick={onIncreaseClick}>Increase</button>
          </div>
        )
      }
    }
<p>上面代码中，这个 UI 组件有两个参数：value和onIncreaseClick。前者需要从state计算得到，后者需要向外发出 Action。
    接着，定义value到state的映射，以及onIncreaseClick到dispatch的映射</p>
<pre>
  function mapStateToProps(state) {
    return {
      value: state.count
    }
  }
  function mapDispatchToProps(dispatch) {
    return {
      onIncreaseClick: () => dispatch(increaseAction)
    }
  }
  // Action Creator
  const increaseAction = { type: 'increase' }
</pre>
<p>然后，使用connect方法生成容器组件。</p>
<pre>
  const App = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Counter)
</pre>
<p>然后，定义这个组件的 Reducer。</p>
<pre>
  // Reducer
  function counter(state = { count: 0 }, action) {
    const count = state.count
    switch (action.type) {
      case 'increase':
        return { count: count + 1 }
      default:
        return state
    }
  }
</pre>
<p>最后，生成store对象，并使用Provider在根组件外面包一层。最后是所有的代码如下：</p>
    import React, { Component, PropTypes } from 'react';
    import ReactDOM from 'react-dom';
    import { createStore } from 'redux';
    import { Provider, connect } from 'react-redux';

    // React component
    class Counter extends Component {
      render() {
        const { value, onIncreateClick } = this.props;
        return (
          <div>
            <span>{value}</span>
            <button onClick = {onIncreateClick}>Increase</button>
          </div>
        )
      }
    }
    Counter.propTypes = {
      value: PropTypes.number.isRequired,
      onIncreateClick: PropTypes.func.isRequired
    }

    // Action 
    const increaseAction = { type: 'increase'}

    // Reducer
    function counter(state = { count:0 }, action) {
      const count = state.count;
      switch(action.type) {
        case 'increase':
          return {count: count + 1 }
        default:
          return state;
      }
    }

    // Store 
    const store = createStore(counter);

    function mapStateToProps(state) {
      return {
        value: state.count
      }
    }

    function mapDispatchToProps(dispatch) {
      return {
        onIncreateClick: () => dispatch(increaseAction)
      }
    }

    // Connected Component
    const App = connect(
      mapStateToProps,
      mapDispatchToProps
    )(Counter)

    ReactDOM.render(
      <Provider store = {store}>
        <App />
      </Provider>,
      document.getElementById('app')
    )

