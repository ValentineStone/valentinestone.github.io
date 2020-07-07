'use strict';

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

var App = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(App, _React$Component);

  function App(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      slices: []
    };
    _this.loadedCount = 0;
    return _this;
  }

  var _proto = App.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.loadPosts();
  };

  _proto.loadPosts = function loadPosts() {
    var _this2 = this;

    jsonp("https://api.vk.com/method/wall.get/?offset=" + this.loadedCount + "&extended=1&filter=owner&owner_id=74762672&v=5.101&access_token=ab07454bab07454bab07454bdcab6b0233aab07ab07454bf654c0781053e5f1a1c59472").then(function (v) {
      _this2.loadedCount += v.response.items.length;

      _this2.setState({
        slices: [].concat(_this2.state.slices, [v])
      });

      console.log(v);
      if (v.response.count > _this2.loadedCount) setTimeout(function () {
        return _this2.loadPosts();
      });
    });
  };

  _proto.render = function render() {
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

var Slice = /*#__PURE__*/function (_React$Component2) {
  _inheritsLoose(Slice, _React$Component2);

  function Slice() {
    return _React$Component2.apply(this, arguments) || this;
  }

  var _proto2 = Slice.prototype;

  _proto2.render = function render() {
    return this.props.value.response.items.map(function (value, key) {
      return h(Post, {
        value: value,
        key: key
      });
    });
  };

  return Slice;
}(React.Component);

var Post = /*#__PURE__*/function (_React$Component3) {
  _inheritsLoose(Post, _React$Component3);

  function Post() {
    return _React$Component3.apply(this, arguments) || this;
  }

  var _proto3 = Post.prototype;

  _proto3.render = function render() {
    var post = this.props.value;
    var date = toNiceDate(post.date * 1000);
    var text = post.text;
    var desc = 'No name';
    var attachments = post.attachments || [];
    return h(React.Fragment, null, h('dt', null, h('strong', null, desc), h('a', {
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

function make_srcset(sizes) {
  return sizes.map(function (v) {
    return v.url + ' ' + v.width + 'w';
  }).join(',');
}

function make_srcset_for_doc(sizes) {
  return sizes.map(function (v) {
    return v.src + ' ' + v.width + 'w';
  }).join(',');
}

var Attachment = /*#__PURE__*/function (_React$Component4) {
  _inheritsLoose(Attachment, _React$Component4);

  function Attachment() {
    return _React$Component4.apply(this, arguments) || this;
  }

  var _proto4 = Attachment.prototype;

  _proto4.render = function render() {
    var v = this.props.value;

    switch (v.type) {
      case 'photo':
        return this.renderPhoto();

      case 'doc':
        return this.renderDoc();

      default:
        return this.renderDefault();
    }
  };

  _proto4.renderPhoto = function renderPhoto() {
    var v = this.props.value;
    return h('img', {
      srcSet: make_srcset(v.photo.sizes)
    });
  };

  _proto4.renderDoc = function renderDoc() {
    var v = this.props.value;

    switch (v.doc.type) {
      case 4:
        return this.renderDocPhoto();

      default:
        return this.renderDocDefault();
    }
  };

  _proto4.renderDocPhoto = function renderDocPhoto() {
    var v = this.props.value;
    return h('img', {
      srcSet: make_srcset_for_doc(v.doc.preview.photo.sizes)
    });
  };

  _proto4.renderDocDefault = function renderDocDefault() {
    var v = this.props.value;
    return h('div', null, h('small', null, 'Attachment doc(' + v.doc.type + ')'));
  };

  _proto4.renderDefault = function renderDefault() {
    var v = this.props.value;
    return h('div', null, h('small', null, 'Attachment ' + v.type));
  };

  return Attachment;
}(React.Component);

ReactDOM.render(h(App, null), document.querySelector('.app'));