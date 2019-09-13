document.querySelector('h1').textContent += ', ' + new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' })

window.h = React.createElement

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
      'https://api.vk.com/method/wall.get/?extended=1&filter=owner&owner_id=-185337369&v=5.101&access_token=ab07454bab07454bab07454bdcab6b0233aab07ab07454bf654c0781053e5f1a1c59472',
    ).then(v => this.setState(v))
  }

  render() {
    if (!this.state.response)
      return 'Loading...'

    return h('dl', { className: 'notes' },
      this.state.response.items.map(item => {
        if (item.text) {
          let date = new Date(item.date * 1000).toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', minute: 'numeric', hour: 'numeric' })
          date = date.charAt(0).toUpperCase() + date.substring(1)
          const dotIndex = item.text.indexOf('.')
          let text = item.text.substr(dotIndex + 2)
          let desc = item.text.substr(0, dotIndex + 1)
          if (item.text[0] !== 'Д') {
            text = item.text
            desc = 'Без названия.'
          }
          return h(React.Fragment, null,
            h('dt', null, h('strong', null, desc), h('br', null), h('small', null, date)),
            h('dd', null, text),
            //h('dd', null, h('code', { className: 'code' }, JSON.stringify({ ...item, text: '...' }, null, 2)))
          )
        }
        else return null
      })
    )
  }
}

ReactDOM.render(h(App, null), document.querySelector('.app'))
