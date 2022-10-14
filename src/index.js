import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchImages } from "./js/apiGalery";
import markup from "./js/templates/markup.hbs";

let page = 1;
const perPage = 40;

let searchValue = '';

const optionsSL = {
  overlayOpacity: 0.5,
  captionsData: 'alt',
  captionDelay: 250,
};
let simpleLightbox;


const form = document.querySelector('.search-form');
const input = document.querySelector('.input');
const gallery = document.querySelector('.gallery');

fetchImages().then(response => {
    gallery.insertAdjacentHTML("beforeend", markup(response.hits))

})

form.addEventListener("submit", onSubmit)

function onSubmit(event) {
    event.preventDefault();
    searchValue = input.value.trim();
    if (searchValue === '') {
        gallery.innerHTML = '';
        // buttonLoadMore.classList.add('visually-hidden');
        Notiflix.Notify.info('You cannot search by empty field, try again.');
        return;
    } else {
        fetchImages(searchValue).then(response => {
          gallery.insertAdjacentHTML('beforeend', markup(response.hits));
          if (response.hits < 1) {
            form.reset();
            gallery.innerHTML = '';
            //   buttonLoadMore.classList.add('visually-hidden');
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          } else {
            form.reset();
            gallery.insertAdjacentHTML('beforeend', markup(response.hits));
            simpleLightbox = new SimpleLightbox(
              '.gallery a',
              optionsSL
            ).refresh();
            //   buttonLoadMore.classList.remove('visually-hidden');

            Notiflix.Notify.success(
              `Hooray! We found ${response.totalHits} images.`
            );
          }
        });
    }
}

const guard = document.querySelector('.guard');
const options = {
    root: null,
    rootMargin: '100px',
    threshold: 1
}
const observer = new IntersectionObserver(onLoad, options);

fetchImages(searchValue).then(response => {
  gallery.insertAdjacentHTML('beforeend', markup(response.hits));
  observer.observe(guard);
});

function onLoad(entries) {
  entries.forEach(entry => {
    //   console.log(entry);
      const totalPages = page * perPage;
      if (entry.isIntersecting) {
        
          page += 1;
          fetchImages(page).then(response => {
            gallery.insertAdjacentHTML('beforeend', markup(response.hits));
            if (response.totalHits === totalPages) {
              observer.unobserve(guard);
              Notiflix.Report.info(
                'Wow',
                "We're sorry, but you've reached the end of search results.",
                'Okay'
              );
            }
            gallery.insertAdjacentHTML('beforeend', markup(response.hits));

            simpleLightbox = new SimpleLightbox(
              '.gallery a',
              optionsSL
            ).refresh();
          });
        
      
        }
      });
    }
  
