'use strict'
window.h = React.createElement

document.querySelector('div.description').textContent = new Date().toLocaleDateString('ru-RU', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit'
})

window.jsonpRequestId = 0
function jsonp(uri) {
  return new Promise(function (resolve, reject) {
    var id = '_' + Math.round(10000 * Math.random());
    var callbackName = 'jsonp_callback_' + (window.jsonpRequestId++) + id;
    window[callbackName] = function (data) {
      delete window[callbackName];
      var ele = document.getElementById(id);
      ele.parentNode.removeChild(ele);
      resolve(data);
    }

    var src = uri + '&callback=' + callbackName;
    var script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.addEventListener('error', reject);
    (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
  });
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    jsonp(
      'https://www.googleapis.com/drive/v3/files?q=%271yFMsHwOKYa7n9kGx_cgLavLtIGxZ-oR1%27+in+parents&key=AIzaSyCzDr38ArpkrukqI0gAN-rAYvbTCmEVyJ8',
    ).then(r => {
      r.files.sort((f1, f2) => f1.name < f2.name ? 1 : -1)
      this.setState(r)
    })
  }

  render() {
    if (!this.state.files) return 'Loading...'

    return h('dl', { className: 'notes' },
      this.state.files.map(props => h(Post, props))
    )
  }
}



function trimHtml(html) {
  html = html.slice(html.indexOf('<body') + 5)
  html = html.slice(html.indexOf('>') + 1)
  html = html.slice(0, html.lastIndexOf('</body'))
  return html
}

class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    fetch(
      'https://www.googleapis.com/drive/v3/files/' + this.props.id + '/export?mimeType=text/html&key=AIzaSyCzDr38ArpkrukqI0gAN-rAYvbTCmEVyJ8'
    ).then(r => r.text()).then(v => this.setState({ html: trimHtml(v) }))
  }

  render() {
    let date = this.props.name.slice(0, 10)
    let name = this.props.name.slice(10)
    let textProps = { dangerouslySetInnerHTML: { __html: this.state.html } }

    if (!this.state.html)
      textProps = { children: 'Loading...' }

    return h(React.Fragment, null,
      h('dt', null,
        h('strong', null, name),
        h('a', { className: 'link-post', href: 'https://docs.google.com/document/d/' + this.props.id + '/edit' }),
        h('br', null),
        h('small', null, date)
      ),
      h('dd', textProps)
    )
  }
}

ReactDOM.render(h(App, null), document.querySelector('#app'))
