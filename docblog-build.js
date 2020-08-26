'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var apikey = 'AIzaSyCzDr38ArpkrukqI0gAN-rAYvbTCmEVyJ8';
var folder = '1yFMsHwOKYa7n9kGx_cgLavLtIGxZ-oR1';

function niceDate() {
  var date = _construct(Date, Array.prototype.slice.call(arguments)).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  });

  return date.charAt(0).toUpperCase() + date.substring(1);
}

function niceDate2() {
  return _construct(Date, Array.prototype.slice.call(arguments)).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  });
}

document.querySelector('div.description').textContent = niceDate();

var App = /*#__PURE__*/function (_React$Component) {
  _inherits(App, _React$Component);

  var _super = _createSuper(App);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _super.call(this, props);
    _this.state = {};
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      fetch("https://www.googleapis.com/drive/v3/files?q=%27".concat(folder, "%27+in+parents&key=").concat(apikey)).then(function (r) {
        return r.json();
      }).then(function (v) {
        v.files.sort(function (f1, f2) {
          return f1.name < f2.name ? 1 : -1;
        });

        _this2.setState(v);
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.files) return 'Loading...';
      return /*#__PURE__*/React.createElement("dl", {
        className: 'notes'
      }, this.state.files.map(function (props) {
        return /*#__PURE__*/React.createElement(Post, _extends({
          key: props.id
        }, props));
      }));
    }
  }]);

  return App;
}(React.Component);

function trimHtml(html) {
  html = html.slice(html.indexOf('<body') + 5);
  html = html.slice(html.indexOf('>') + 1);
  html = html.slice(0, html.lastIndexOf('</body'));
  return html;
}

var Post = /*#__PURE__*/function (_React$Component2) {
  _inherits(Post, _React$Component2);

  var _super2 = _createSuper(Post);

  function Post(props) {
    var _this3;

    _classCallCheck(this, Post);

    _this3 = _super2.call(this, props);
    _this3.state = {};
    return _this3;
  }

  _createClass(Post, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      fetch("https://www.googleapis.com/drive/v3/files/".concat(this.props.id, "/export?mimeType=text/html&key=").concat(apikey)).then(function (r) {
        return r.text();
      }).then(function (v) {
        return _this4.setState({
          html: trimHtml(v)
        });
      });
      fetch("https://www.googleapis.com/drive/v2/files/".concat(this.props.id, "?key=").concat(apikey)).then(function (r) {
        return r.json();
      }).then(function (v) {
        return _this4.setState({
          info: v
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var info = this.state.info;
      var created = info ? niceDate2(info.createdDate) : this.props.name.slice(0, 10);
      var modified = info ? niceDate2(info.modifiedDate) : this.props.name.slice(0, 10);
      var name = this.props.name.slice(10) || 'Untitled ¯\\_(ツ)_/¯';
      var textProps = {};
      if (this.state.html) textProps.dangerouslySetInnerHTML = {
        __html: this.state.html
      };else textProps.children = 'Loading...';
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", {
        id: this.props.id
      }, /*#__PURE__*/React.createElement("strong", null, name), /*#__PURE__*/React.createElement("a", {
        className: 'post-link',
        href: 'https://docs.google.com/document/d/' + this.props.id + '/edit'
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, created, " ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.7em'
        }
      }, "(edit: ", modified, ")"))), /*#__PURE__*/React.createElement("dd", textProps));
    }
  }]);

  return Post;
}(React.Component);

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector('#app'));