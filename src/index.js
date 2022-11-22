import Notiflix from '../node_modules/notiflix';
import axios from 'axios';
import { AxiosGet } from './axionGet';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryDiv = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');
const getting = new AxiosGet();





form.addEventListener('submit', divCreate);
loadBtn.addEventListener('click', newCreations);

function newCreations(event) {
  event.preventDefault();
  getting.page +=1
  console.log(getting.page); 
  gettingPhotos();
}

function divCreate(event) {
  event.preventDefault();
  if (!event.target.firstElementChild.value) {
    Notiflix.Notify.warning(
      'You did not enter a search query. Please try again.'
    );
    return (galleryDiv.innerHTML = '');
  }

  getting.q = event.target.firstElementChild.value;
  getting.page = 1;

  gettingPhotos();

}



function gettingPhotos() {
  getting
    .getPhoto()
    .then(function (response) {     
        const images = response.data.hits;
      loadBtn.hidden = false;
      markupGalary(images);
      const { height: cardHeight } = galleryDiv
      .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
 let gallery = new SimpleLightbox('.photo-card a');

      gallery.on('show.simplelightbox', function () {
      }).refresh();

      if ((getting.page === 1)) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
      if (Math.ceil(response.data.total / 40) === getting.page) {
        loadBtn.hidden = true;
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}


function markupGalary(images) {
  if (images.length < 1) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadBtn.hidden = true;
    return;
  }
  const item = images.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `
      <div class="photo-card">
      <a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>
            `;
    }
  );

  galleryDiv.insertAdjacentHTML('beforeend', item.join(''))
  return;
}
