'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

window.h = React.createElement;
document.querySelector('div.description').textContent = new Date().toLocaleDateString('ru-RU', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit'
});
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

    jsonp('https://www.googleapis.com/drive/v3/files?q=%271yFMsHwOKYa7n9kGx_cgLavLtIGxZ-oR1%27+in+parents&key=AIzaSyCzDr38ArpkrukqI0gAN-rAYvbTCmEVyJ8').then(function (r) {
      r.files.sort(function (f1, f2) {
        return f1.name < f2.name ? 1 : -1;
      });

      _this2.setState(r);
    });
  };

  _proto.render = function render() {
    if (!this.state.files) return 'Loading...';
    return h('dl', {
      className: 'notes'
    }, this.state.files.map(function (props) {
      return h(Post, props);
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

    fetch('https://www.googleapis.com/drive/v3/files/' + this.props.id + '/export?mimeType=text/html&key=AIzaSyCzDr38ArpkrukqI0gAN-rAYvbTCmEVyJ8').then(function (r) {
      return r.text();
    }).then(function (v) {
      return _this4.setState({
        html: trimHtml(v)
      });
    });
  };

  _proto2.render = function render() {
    var date = this.props.name.slice(0, 10);
    var name = this.props.name.slice(10);
    var textProps = {
      dangerouslySetInnerHTML: {
        __html: this.state.html
      }
    };
    if (!this.state.html) textProps = {
      children: 'Loading...'
    };
    return h(React.Fragment, null, h('dt', null, h('strong', null, name), h('a', {
      className: 'link-post',
      href: 'https://docs.google.com/document/d/' + this.props.id + '/edit'
    }), h('br', null), h('small', null, date)), h('dd', textProps));
  };

  return Post;
}(React.Component);

ReactDOM.render(h(App, null), document.querySelector('#app'));