'use strict';

document.querySelector('h1').textContent += ', ' + new Date().toLocaleDateString('ru-RU', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit'
})

document.querySelector('div.description').textContent =
  '(Упражнения в мышлении, день ' + dateDiffInDays(new Date(), new Date(2019, 11, 18)) + ')'

window.h = React.createElement

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.floor((utc2 - utc1) / 86400000)
}

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

let postRenderers = []

function timestamp(year, month, day, ...rest) {
  let timestamp = String(new Date(year, month - 1, day, ...rest).getTime());
  timestamp = timestamp.substr(0, timestamp.length - 3);
  return timestamp;
}

function PostRenderer(date, render) {
  postRenderers = [{ date: timestamp(...date.split('-')), render }, ...postRenderers]
}

function renderPost(post) {
  console.log(post)
  if (post && typeof post === 'object' && post.text) {
    for (let postRenderer of postRenderers)
      if (postRenderer.date < post.date)
        return postRenderer.render(post)
    return defaultPostRenderer(post)
  }
  else return debugPostRenderer(post)
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
      this.state.response.items.map(renderPost)
    )
  }
}

function defaultPostRenderer(post) {
  let date = new Date(post.date * 1000).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  })
  date = date.charAt(0).toUpperCase() + date.substring(1)
  let text = post.text
  let desc = 'Без названия.'
  return h(React.Fragment, null,
    h('dt', null,
      h('strong', null, desc),
      h('br', null),
      h('small', null, date)
    ),
    h('dd', null, text)
  )
}

function debugPostRenderer(post) {
  let date = new Date(
    post && typeof post === 'object' && post.date ? post.date * 1000 : undefined
  ).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  })
  if (post && typeof post === 'object' && post.date)
    date = date.charAt(0).toUpperCase() + date.substring(1)
  else
    date = 'Сегодня ' + date
  let text = JSON.stringify(post, null, 2)
  let desc = 'Что-то не так ¯\\(°_o)/¯'
  return h(React.Fragment, null,
    h('dt', null,
      h('strong', null, desc),
      h('br', null),
      h('small', null, date)
    ),
    h('dd', { className: 'code' }, text)
  )
}

PostRenderer('2019-09-09', post => {
  let date = new Date(post.date * 1000).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  })
  date = date.charAt(0).toUpperCase() + date.substring(1)
  const dotIndex = post.text.indexOf('.')
  let text = post.text.substr(dotIndex + 2)
  let desc = post.text.substr(0, dotIndex + 1)
  let par = text.split('\n')
  return h(React.Fragment, null,
    h('dt', null,
      h('strong', null, desc),
      h('br', null),
      h('small', null, date)
    ),
    h('dd', null, ...par.map(v => h('p', null, v)))
  )
})

PostRenderer('2019-09-13-19', post => {
  let date = new Date(post.date * 1000).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  })
  date = date.charAt(0).toUpperCase() + date.substring(1)
  const dotIndex = post.text.indexOf('.')
  let text = post.text.replace(/[^\.]+\.[\s\n]+/, '')
  let desc = post.text.substr(0, dotIndex + 1)
  let textProps = { dangerouslySetInnerHTML: { __html: marked(text) } }
  return h(React.Fragment, null,
    h('dt', null,
      h('strong', null, desc),
      h('br', null),
      h('small', null, date)
    ),
    h('dd', textProps)
  )
})

ReactDOM.render(h(App, null), document.querySelector('.app'))
