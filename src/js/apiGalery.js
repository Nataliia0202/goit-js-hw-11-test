const perPage = 40;
let page = 1;

export function fetchImages(searchValue) {
  const searchParams = new URLSearchParams({
    key: '30517728-589fd0b92afb9aae41e5e4126',
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: perPage,
    page,
  });
  return fetch(`https://pixabay.com/api/?${searchParams}`).then(response => {
    if (!response.ok) {
    //   page += 1;
      throw new Error(response.statusText);
    }
    return response.json();
  });
}
