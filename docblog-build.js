'use strict';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

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
  _inheritsLoose(App, _React$Component);

  function App(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = App.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    fetch("https://www.googleapis.com/drive/v3/files?q=%27" + folder + "%27+in+parents&key=" + apikey).then(function (r) {
      return r.json();
    }).then(function (r) {
      r.files.sort(function (f1, f2) {
        return f1.name < f2.name ? 1 : -1;
      });

      _this2.setState(r);
    });
  };

  _proto.render = function render() {
    if (!this.state.files) return 'Loading...';
    return /*#__PURE__*/React.createElement("dl", {
      className: 'notes'
    }, this.state.files.map(function (props) {
      return /*#__PURE__*/React.createElement(Post, _extends({
        key: props.id
      }, props));
    }));
  };

  return App;
}(React.Component);

function trimHtml(html) {
  html = html.slice(html.indexOf('<body') + 5);
  html = html.slice(html.indexOf('>') + 1);
  html = html.slice(0, html.lastIndexOf('</body'));
  return html;
}

var Post = /*#__PURE__*/function (_React$Component2) {
  _inheritsLoose(Post, _React$Component2);

  function Post(props) {
    var _this3;

    _this3 = _React$Component2.call(this, props) || this;
    _this3.state = {};
    return _this3;
  }

  var _proto2 = Post.prototype;

  _proto2.componentDidMount = function componentDidMount() {
    var _this4 = this;

    fetch("https://www.googleapis.com/drive/v3/files/" + this.props.id + "/export?mimeType=text/html&key=" + apikey).then(function (r) {
      return r.text();
    }).then(function (v) {
      return _this4.setState({
        html: trimHtml(v)
      });
    });
    fetch("https://www.googleapis.com/drive/v2/files/" + this.props.id + "?key=" + apikey).then(function (r) {
      return r.json();
    }).then(function (v) {
      return _this4.setState({
        info: v
      });
    });
  };

  _proto2.render = function render() {
    var info = this.state.info;
    var created = info ? niceDate2(info.createdDate) : this.props.name.slice(0, 10);
    var modified = info ? niceDate2(info.modifiedDate) : this.props.name.slice(0, 10);
    var name = this.props.name.slice(10) || 'Untitled ¯\\_(ツ)_/¯';
    var textProps = {};
    if (this.state.html) textProps.dangerouslySetInnerHTML = {
      __html: this.state.html
    };else textProps.children = 'Loading...';
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, /*#__PURE__*/React.createElement("strong", null, name), /*#__PURE__*/React.createElement("a", {
      className: 'post-link',
      href: 'https://docs.google.com/document/d/' + this.props.id + '/edit'
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, created, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7em'
      }
    }, "(edit: ", modified, ")"))), /*#__PURE__*/React.createElement("dd", textProps));
  };

  return Post;
}(React.Component);

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector('#app'));