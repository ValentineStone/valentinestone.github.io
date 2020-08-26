'use strict'

const apikey = 'AIzaSyCzDr38ArpkrukqI0gAN-rAYvbTCmEVyJ8'
const folder = '1yFMsHwOKYa7n9kGx_cgLavLtIGxZ-oR1'

function niceDate() {
  const date = new Date(...arguments).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  })
  return date.charAt(0).toUpperCase() + date.substring(1)
}

function niceDate2() {
  return new Date(...arguments).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric'
  })
}

document.querySelector('div.description').textContent = niceDate()

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    fetch(
      `https://www.googleapis.com/drive/v3/files?q=%27${folder}%27+in+parents&key=${apikey}`,
    ).then(r => r.json()).then(v => {
      v.files.sort((f1, f2) => f1.name < f2.name ? 1 : -1)
      this.setState(v)
    })
  }
  render() {
    if (!this.state.files) return 'Loading...'
    return (
      <dl className={'notes'}>
        {this.state.files.map(props => <Post key={props.id} {...props}/>)}
      </dl>
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
      `https://www.googleapis.com/drive/v3/files/${this.props.id}/export?mimeType=text/html&key=${apikey}`
    ).then(r => r.text()).then(v => this.setState({ html: trimHtml(v) }))
    fetch(
      `https://www.googleapis.com/drive/v2/files/${this.props.id}?key=${apikey}`
    ).then(r => r.json()).then(v => this.setState({ info: v }))
  }
  render() {
    let info = this.state.info
    let created  = info ? niceDate2(info.createdDate)  : this.props.name.slice(0, 10)
    let modified = info ? niceDate2(info.modifiedDate) : this.props.name.slice(0, 10)
    let name = this.props.name.slice(10) || 'Untitled ¯\\_(ツ)_/¯'
    let textProps = {}
    if (this.state.html)
      textProps.dangerouslySetInnerHTML = { __html: this.state.html }
    else
      textProps.children = 'Loading...'
    return <>
      <dt id={this.props.id}>
        <strong>{name}</strong>
        <a className={'post-link'} href={'https://docs.google.com/document/d/' + this.props.id + '/edit'} />
        <br/><small>{created} <span style={{fontSize: '0.7em'}}>(edit: {modified})</span></small>
      </dt>
      <dd {...textProps} />
    </>
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'))