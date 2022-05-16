'use strict';

var images = [];
var xhr = new XMLHttpRequest();
xhr.open('GET', location.search.slice(1) + '.md');

xhr.onload = function () {
  document.querySelector('#app').innerHTML = marked.parse(this.response);
  onReady();
};

xhr.send();

function onReady() {
  document.querySelectorAll('img').forEach(function (img) {
    images.push(img.src);
    img.onclick = toggleLightbox;
    //document.querySelector('hr').scrollIntoView();
  });
  var lightbox = document.querySelector('#lightbox');
  var lightboxImg = document.createElement('img');
  lightbox.querySelector('p').appendChild(lightboxImg);

  function toggleLightbox() {
    lightbox.style.display = null;
    lightboxImg.src = this.src;
  }

  lightbox.onclick = function () {
    return lightbox.style.display = 'none';
  };

  window.addEventListener('keyup', function (e) {
    console.log(e.key);

    switch (e.key) {
      case 'Escape':
        lightbox.style.display = 'none';
        break;

      case 'ArrowRight':
        if (!lightbox.style.display) {
          console.log(images.indexOf(lightboxImg.src), (images.indexOf(lightboxImg.src) + 1) % images.length, images[(images.indexOf(lightboxImg.src) + 1) % images.length]);
          lightboxImg.src = images[(images.indexOf(lightboxImg.src) + 1) % images.length];
        }

        break;

      case 'ArrowLeft':
        if (!lightbox.style.display) {
          console.log(images.indexOf(lightboxImg.src), (images.indexOf(lightboxImg.src) + images.length - 1) % images.length, images[(images.indexOf(lightboxImg.src) + images.length - 1) % images.length]);
          lightboxImg.src = images[(images.indexOf(lightboxImg.src) + images.length - 1) % images.length];
        }

        break;
    }
  });
}