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
      console.log(v)
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
      h('dt', null,
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

function make_srcset(sizes) {
  return sizes.map(v => v.url + ' ' + v.width + 'w').join(',')
}
function make_srcset_for_doc(sizes) {
  return sizes.map(v => v.src + ' ' + v.width + 'w').join(',')
}

class Attachment extends React.Component {
  render() {
    const v = this.props.value
    switch (v.type) {
      case 'photo': return this.renderPhoto()
      case 'doc': return this.renderDoc()
      default: return this.renderDefault()
    }
  }

  renderPhoto() {
    const v = this.props.value
    return h('img', { srcSet: make_srcset(v.photo.sizes) })
  }
  renderDoc() {
    const v = this.props.value
    switch (v.doc.type) {
      case 4: return this.renderDocPhoto()
      default: return this.renderDocDefault()
    }
  }
  renderDocPhoto() {
    const v = this.props.value
    return h('img', { srcSet: make_srcset_for_doc(v.doc.preview.photo.sizes) })
  }
  renderDocDefault() {
    const v = this.props.value
    return h('div', null,
      h('small', null,
        'Attachment doc(' + v.doc.type + ')'
      )
    )
  }
  renderDefault() {
    const v = this.props.value
    return h('div', null,
      h('small', null,
        'Attachment ' + v.type
      )
    )
  }
}


ReactDOM.render(h(App, null), document.querySelector('.app'))
