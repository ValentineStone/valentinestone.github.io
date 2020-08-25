'use strict';

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

window.h = React.createElement;

function toNiceDate(arg) {
  var date = new Date(arg).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  });
  return date.charAt(0).toUpperCase() + date.substring(1);
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

function timestamp(year, month, day) {
  for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  var timestamp = String(_construct(Date, [year, month - 1, day].concat(rest)).getTime());
  timestamp = timestamp.substr(0, timestamp.length - 3);
  return timestamp;
}

var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ErrorBoundary, _React$Component);

  function ErrorBoundary(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      hasError: false
    };
    return _this;
  }

  ErrorBoundary.getDerivedStateFromError = function getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error
    };
  };

  var _proto = ErrorBoundary.prototype;

  _proto.componentDidCatch = function componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  };

  _proto.render = function render() {
    if (this.state.hasError) {
      if (this.state.error) {
        return h(React.Fragment, null, h('div', {
          style: {
            color: 'red'
          }
        }, 'Error:'), h('pre', null, JSON.stringify(this.state.error)));
      } else {
        return h(React.Fragment, null, h('div', {
          style: {
            color: 'red'
          }
        }, 'Error:'), h('pre', null, JSON.stringify(this.state.error)), h('hr'), h('pre', null, JSON.stringify(this.state.errorInfo)));
      }
    } else return this.props.children;
  };

  return ErrorBoundary;
}(React.Component);

var App = /*#__PURE__*/function (_React$Component2) {
  _inheritsLoose(App, _React$Component2);

  function App(props) {
    var _this2;

    _this2 = _React$Component2.call(this, props) || this;
    _this2.state = {
      slices: []
    };
    _this2.loadedCount = 0;
    return _this2;
  }

  var _proto2 = App.prototype;

  _proto2.componentDidMount = function componentDidMount() {
    this.loadPosts();
  };

  _proto2.loadPosts = function loadPosts() {
    var _this3 = this;

    jsonp("https://api.vk.com/method/wall.get/?offset=" + this.loadedCount + "&extended=1&filter=owner&owner_id=74762672&v=5.101&access_token=ab07454bab07454bab07454bdcab6b0233aab07ab07454bf654c0781053e5f1a1c59472").then(function (v) {
      _this3.loadedCount += v.response.items.length;

      _this3.setState({
        slices: [].concat(_this3.state.slices, [v])
      }); //console.log(v)


      if (v.response.count > _this3.loadedCount) setTimeout(function () {
        return _this3.loadPosts();
      });
    });
  };

  _proto2.render = function render() {
    if (!this.state.slices.length) return 'Loading...';
    return h('dl', {
      className: 'notes'
    }, this.state.slices.map(function (value, key) {
      return h(Slice, {
        value: value,
        key: key
      });
    }));
  };

  return App;
}(React.Component);

var Slice = /*#__PURE__*/function (_React$Component3) {
  _inheritsLoose(Slice, _React$Component3);

  function Slice() {
    return _React$Component3.apply(this, arguments) || this;
  }

  var _proto3 = Slice.prototype;

  _proto3.render = function render() {
    return this.props.value.response.items.map(function (value, key) {
      return h(Post, {
        value: value,
        key: key
      });
    });
  };

  return Slice;
}(React.Component);

var Post = /*#__PURE__*/function (_React$Component4) {
  _inheritsLoose(Post, _React$Component4);

  function Post() {
    return _React$Component4.apply(this, arguments) || this;
  }

  var _proto4 = Post.prototype;

  _proto4.render = function render() {
    var post = this.props.value;
    var date = toNiceDate(post.date * 1000);
    var text = post.text;
    var desc = 'No name';
    var attachments = post.attachments || [];
    return h(React.Fragment, null, h('dt', {
      id: post.id
    }, h('strong', null, desc), h('a', {
      className: 'link-post',
      href: 'https://vk.com/wall74762672_' + post.id
    }), h('br', null), h('small', null, date)), h.apply(void 0, ['dd', null, h('div', null, text)].concat(attachments.map(function (value, key) {
      return h(Attachment, {
        value: value,
        key: key
      });
    }))));
  };

  return Post;
}(React.Component);

function make_src(sizes) {
  var s = {};

  for (var _iterator = _createForOfIteratorHelperLoose(sizes), _step; !(_step = _iterator()).done;) {
    var v = _step.value;
    s[v.type] = v.url || v.src;
  }

  return s.w || s.z || s.y || s.x || s.m || s.s;
}

function make_srcset(sizes) {
  return sizes.map(function (v) {
    return v.width ? (v.url || v.src) + ' ' + v.width + 'w' : v.url || v.src;
  }).join(', ');
}

var Attachment = /*#__PURE__*/function (_React$Component5) {
  _inheritsLoose(Attachment, _React$Component5);

  function Attachment() {
    return _React$Component5.apply(this, arguments) || this;
  }

  var _proto5 = Attachment.prototype;

  _proto5.render = function render() {
    var v = this.props.value;

    switch (v.type) {
      case 'photo':
        return AttachmentPhoto(this.props.value);

      case 'doc':
        return AttachmentDoc(this.props.value);

      case 'audio':
        return AttachmentAudio(this.props.value);

      case 'link':
        return AttachmentLink(this.props.value.link);

      default:
        return AttachmentDefault(this.props.value);
    }
  };

  return Attachment;
}(React.Component);

function AttachmentPhoto(v) {
  return h('img', {
    className: 'attachment',
    src: make_src(v.photo.sizes)
  });
}

function AttachmentDoc(v) {
  switch (v.doc.type) {
    case 4:
      return AttachmentDocPhoto(v);

    default:
      return AttachmentDocDefault(v);
  }
}

function AttachmentDocPhoto(v) {
  if (0 == v.doc.preview.photo.sizes[0].width) // old photos, hadled separate
    return h('img', {
      className: 'attachment',
      src: v.doc.url
    });else return h('img', {
    className: 'attachment',
    src: make_src(v.doc.preview.photo.sizes)
  });
}

function AttachmentDocDefault(v) {
  return h('div', {
    className: 'attachment'
  }, h('small', null, 'Attachment doc(' + v.doc.type + ')'));
}

function AttachmentAudio(v) {
  return h('div', {
    className: 'attachment'
  }, h('small', null, 'Attachment ' + v.type));
}

function AttachmentLink(v) {
  return h.apply(void 0, ['div', {
    className: 'box attachment'
  }, v.title, h('br')].concat(v.description ? [h('small', null, v.description), h('br')] : [], [h('small', null, h('a', {
    href: v.url
  }, v.url))]));
}

function AttachmentDefault(v) {
  //console.log(v)
  return h('div', null, h('small', null, 'Attachment ' + v.type));
}

ReactDOM.render(h(App, null), document.querySelector('.app'));