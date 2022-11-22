import Notiflix from '../node_modules/notiflix';
import { AxiosGet } from './axionGet';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import template from './templates/gallery.hbs';

const galleryDiv = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');
const gettingRequest = new AxiosGet();
let gallery = new SimpleLightbox('.photo-card a');
gallery.on('show.simplelightbox', function () {});

form.addEventListener('submit', galleryCardsCreation);
loadBtn.addEventListener('click', galleryCardsLoading);

function galleryCardsLoading(event) {
  event.preventDefault();
  gettingRequest.page += 1;
  gettingPhotos();
}

function galleryCardsCreation(event) {
  event.preventDefault();
  if (!event.target.firstElementChild.value) {
    loadBtn.hidden = true;
    galleryDiv.innerHTML = '';
    Notiflix.Notify.warning(
      'You did not enter a search query. Please try again.'
    );
    return;
  }
  event.preventDefault();
  gettingRequest.q = event.target.firstElementChild.value;
  gettingRequest.page = 1;
  galleryDiv.innerHTML = '';
  gettingPhotos();
}

function gettingPhotos() {
  gettingRequest
    .getPhoto()
    .then(function (response) {
      const images = response.data.hits;
      loadBtn.hidden = false;
      markupGalary(images);
      const { height: cardHeight } =
        galleryDiv.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (gettingRequest.page === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
      if (Math.ceil(response.data.total / 40) === gettingRequest.page) {
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

  const item = template(images);
  galleryDiv.insertAdjacentHTML('beforeend', item);
  gallery.refresh();
  return;
}
