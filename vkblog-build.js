'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

document.querySelector('h1').textContent += ', ' + new Date().toLocaleDateString('ru-RU', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit'
});
document.querySelector('div.description').textContent = '(Упражнения в мышлении, день ' + dateDiffInDays(new Date(), new Date(2019, 11, 18)) + ')';
window.h = React.createElement; // a and b are javascript Date objects

function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / 86400000);
}

window.jsonpRequestId = 0;

function jsonp(uri) {
  return new Promise(function (resolve, reject) {
    var id = '_' + Math.round(10000 * Math.random());
    var callbackName = 'jsonp_callback_' + window.jsonpRequestId++ + id;

    window[callbackName] = function (data) {
      delete window[callbackName];
      var ele = document.getElementById(id);
      ele.parentNode.removeChild(ele);
      resolve(data);
    };

    var src = uri + '&callback=' + callbackName;
    var script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.addEventListener('error', reject);
    (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script);
  });
}

var postRenderers = [];

function timestamp(year, month, day) {
  for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  var timestamp = String(_construct(Date, [year, month - 1, day].concat(rest)).getTime());
  timestamp = timestamp.substr(0, timestamp.length - 3);
  return timestamp;
}

function PostRenderer(date, render) {
  postRenderers = [{
    date: timestamp.apply(void 0, _toConsumableArray(date.split('-'))),
    render
  }].concat(_toConsumableArray(postRenderers));
}

function renderPost(post) {
  console.log(post);

  if (post && typeof post === 'object' && post.text) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = postRenderers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var postRenderer = _step.value;
        if (postRenderer.date < post.date) return postRenderer.render(post);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return defaultPostRenderer(post);
  } else return debugPostRenderer(post);
}

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this.state = {};
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      jsonp('https://api.vk.com/method/wall.get/?extended=1&filter=owner&owner_id=-185337369&v=5.101&access_token=ab07454bab07454bab07454bdcab6b0233aab07ab07454bf654c0781053e5f1a1c59472').then(function (v) {
        return _this2.setState(v);
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.response) return 'Loading...';
      return h('dl', {
        className: 'notes'
      }, this.state.response.items.map(renderPost));
    }
  }]);

  return App;
}(React.Component);

function defaultPostRenderer(post) {
  var date = new Date(post.date * 1000).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  });
  date = date.charAt(0).toUpperCase() + date.substring(1);
  var text = post.text;
  var desc = 'Без названия.';
  return h(React.Fragment, null, h('dt', null, h('strong', null, desc), h('br', null), h('small', null, date)), h('dd', null, text));
}

function debugPostRenderer(post) {
  return null;
  var date = new Date(post && typeof post === 'object' && post.date ? post.date * 1000 : undefined).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
  if (post && typeof post === 'object' && post.date) date = date.charAt(0).toUpperCase() + date.substring(1);else date = 'Сегодня ' + date;
  var text = JSON.stringify(post, null, 2);
  var desc = 'Что-то не так ¯\\(°_o)/¯';
  return h(React.Fragment, null, h('dt', null, h('strong', null, desc), h('br', null), h('small', null, date)), h('dd', {
    className: 'code'
  }, text));
}

PostRenderer('2019-09-09', function (post) {
  var date = new Date(post.date * 1000).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  });
  date = date.charAt(0).toUpperCase() + date.substring(1);
  var dotIndex = post.text.indexOf('.');
  var text = post.text.substr(dotIndex + 2);
  var desc = post.text.substr(0, dotIndex + 1);
  var par = text.split('\n');
  return h(React.Fragment, null, h('dt', null, h('strong', null, desc), h('br', null), h('small', null, date)), h.apply(void 0, ['dd', null].concat(_toConsumableArray(par.map(function (v) {
    return h('p', null, v);
  })))));
});
PostRenderer('2019-09-13-19', function (post) {
  var date = new Date(post.date * 1000).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  });
  date = date.charAt(0).toUpperCase() + date.substring(1);
  var dotIndex = post.text.indexOf('.');
  var text = post.text.replace(/[^\.]+\.[\s\n]+/, '');
  var desc = post.text.substr(0, dotIndex + 1);
  var textProps = {
    dangerouslySetInnerHTML: {
      __html: marked(text)
    }
  };
  return h(React.Fragment, null, h('dt', null, h('strong', null, desc), h('br', null), h('small', null, date)), h('dd', textProps));
});
ReactDOM.render(h(App, null), document.querySelector('.app'));
