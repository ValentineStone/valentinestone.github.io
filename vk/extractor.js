'use strict'
window.h = React.createElement

function toNiceDate(arg) {
  const date = new Date(arg).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  })
  return date.charAt(0).toUpperCase() + date.substring(1)
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

function timestamp(year, month, day, ...rest) {
  let timestamp = String(new Date(year, month - 1, day, ...rest).getTime());
  timestamp = timestamp.substr(0, timestamp.length - 3);
  return timestamp;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
  }
  render() {
    if (this.state.hasError) {
      if (this.state.error) {
        return h(React.Fragment, null,
          h('div', { style: { color: 'red' } }, 'Error:'),
          h('pre', null, JSON.stringify(this.state.error) ),
        )
      }
      else {
        return h(React.Fragment, null,
          h('div', { style: { color: 'red' } }, 'Error:'),
          h('pre', null, JSON.stringify(this.state.error) ),
          h('hr'),
          h('pre', null, JSON.stringify(this.state.errorInfo) ),
        )
      }
    }
    else
      return this.props.children 
  }
}


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { slices: [] }
    this.loadedCount = 0
  }
  componentDidMount() {
    this.loadPosts()
  }

  loadPosts() {
    jsonp(
      `https://api.vk.com/method/wall.get/?offset=${this.loadedCount}&extended=1&filter=owner&owner_id=74762672&v=5.101&access_token=ab07454bab07454bab07454bdcab6b0233aab07ab07454bf654c0781053e5f1a1c59472`,
    ).then(v => {
      this.loadedCount += v.response.items.length
      this.setState({ slices: [...this.state.slices, v] })
      //console.log(v)
      if (v.response.count > this.loadedCount)
        setTimeout(() => this.loadPosts())
    })
  }

  render() {
    if (!this.state.slices.length)
      return 'Loading...'

    return h('dl', { className: 'notes' },
      this.state.slices.map((value, key) => h(Slice, { value, key }))
    )
  }
}

class Slice extends React.Component {
  render() {
      return this.props.value.response.items.map((value, key) => h(Post, { value, key }))
  }
}

class Post extends React.Component {
  render() {
    const post = this.props.value
    const date = toNiceDate(post.date * 1000)
    const text = post.text
    const desc = 'No name'
    const attachments = post.attachments || []
    return h(React.Fragment, null,
      h('dt', { id: post.id },
        h('strong', null, desc),
        h('a', { className: 'link-post', href: 'https://vk.com/wall74762672_' + post.id }),
        h('br', null),
        h('small', null, date)
      ),
      h('dd', null, 
        h('div', null, text),
        ...attachments.map((value, key) => h(Attachment, { value, key }))
      )
    )
  }
}

function make_src(sizes) {
  let s = {}
  for (let v of sizes) s[v.type] = (v.url||v.src)
  return s.w || s.z || s.y || s.x || s.m || s.s
}

function make_srcset(sizes) {
  return sizes.map(v => v.width ? (v.url||v.src) + ' ' + v.width + 'w' : (v.url||v.src)).join(', ')
}

class Attachment extends React.Component {
  render() {
    const v = this.props.value
    switch (v.type) {
      case 'photo': return AttachmentPhoto(this.props.value)
      case 'doc': return AttachmentDoc(this.props.value)
      case 'audio': return AttachmentAudio(this.props.value)
      case 'link': return AttachmentLink(this.props.value.link)
      default: return AttachmentDefault(this.props.value)
    }
  }
}

function AttachmentPhoto(v) {
  return h('img', { className: 'attachment', src: make_src(v.photo.sizes) })
}
function AttachmentDoc(v) {
  switch (v.doc.type) {
    case 4: return AttachmentDocPhoto(v)
    default: return AttachmentDocDefault(v)
  }
}
function AttachmentDocPhoto(v) {
  if (0 == v.doc.preview.photo.sizes[0].width) // old photos, hadled separate
    return h('img', { className: 'attachment', src: v.doc.url})
  else
    return h('img', { className: 'attachment', src: make_src(v.doc.preview.photo.sizes) })
}

function AttachmentDocDefault(v) {
  return h('div', { className: 'attachment' },
    h('small', null,
      'Attachment doc(' + v.doc.type + ')'
    )
  )
}
function AttachmentAudio(v) {
  return h('div', { className: 'attachment' },
    h('small', null,
      'Attachment ' + v.type
    )
  )
}
function AttachmentLink(v) {
  return h('div', {className: 'box attachment'},
    v.title,
    h('br'),
    ...(v.description ? [h('small', null, v.description), h('br')] : []),
    h('small', null, h('a', { href: v.url }, v.url)),
  )
}
function AttachmentDefault(v) {
  //console.log(v)
  return h('div', null,
    h('small', null,
      'Attachment ' + v.type
    )
  )
}


ReactDOM.render(h(App, null), document.querySelector('.app'))
