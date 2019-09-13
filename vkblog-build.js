'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

document.querySelector('h1').textContent += ', ' + new Date().toLocaleDateString('ru-RU', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit'
});
window.h = React.createElement;
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

function renderPost(item) {
  for (var i = 0; i < postRenderers.length; i++) {
    var postRenderer = postRenderers[i]
    if (postRenderer.date >= item.date)
      return postRenderer(item)
  }
  return defaultPostRenderer(item)
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
      }, this.state.response.items.map(function (item) {
        if (item.text) {
          var date = new Date(item.date * 1000).toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            minute: 'numeric',
            hour: 'numeric'
          });
          date = date.charAt(0).toUpperCase() + date.substring(1);
          var dotIndex = item.text.indexOf('.');
          var text = item.text.substr(dotIndex + 2);
          var desc = item.text.substr(0, dotIndex + 1);

          if (item.text[0] !== 'Д') {
            text = item.text;
            desc = 'Без названия.';
          }

          var ddprops = { dangerouslySetInnerHTML: { __html: marked(text) } };

          return h(React.Fragment, null, h('dt', null, h('strong', null, desc), h('br', null), h('small', null, date)), h('dd', ddprops) //h('dd', null, h('code', { className: 'code' }, JSON.stringify({ ...item, text: '...' }, null, 2)))
          );
        } else return null;
      }));
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(h(App, null), document.querySelector('.app'));
