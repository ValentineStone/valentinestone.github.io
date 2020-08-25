'use strict'
const app = document.querySelector('#app')
const lightbox = document.querySelector('#lightbox')
const lightboxImg = lightbox.querySelector('img')
const images = []

const xhr = new XMLHttpRequest()
xhr.open('GET', location.search.slice(1) + '.md')
xhr.onload = () => {
  app.innerHTML = marked(xhr.response)
  app.querySelectorAll('img').forEach(img => {
		images.push(img.src)
		img.onclick = toggleLightbox
  })
  document.querySelector('hr').scrollIntoView()
}
xhr.send()

function toggleLightbox() {
  lightbox.style.display = null
  lightboxImg.src = this.src
}
lightbox.onclick = () => lightbox.style.display = 'none'
window.addEventListener('keyup', e => { console.log(e.key); switch (e.key) {
  case 'Escape':
    lightbox.style.display = 'none'
    break
  case 'ArrowRight':
    if (!lightbox.style.display) {
      console.log(
        images.indexOf(lightboxImg.src),
        (images.indexOf(lightboxImg.src) + 1) % images.length,
        images[(images.indexOf(lightboxImg.src) + 1) % images.length])
      lightboxImg.src = images[(images.indexOf(lightboxImg.src) + 1) % images.length]
    } break
  case 'ArrowLeft':
    if (!lightbox.style.display) {
      console.log(
        images.indexOf(lightboxImg.src),
        (images.indexOf(lightboxImg.src) + images.length - 1) % images.length,
        images[(images.indexOf(lightboxImg.src) + images.length - 1) % images.length])
      lightboxImg.src = images[(images.indexOf(lightboxImg.src) + images.length - 1) % images.length]
    } break
}})