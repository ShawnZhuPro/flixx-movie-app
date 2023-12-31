// Global variables for storing current page, search details, and API keys
const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  API_KEY: "5c4710e79ebd24278e9ed66fc6c66084",
  API_URL: "https://api.themoviedb.org/3/",
};

// Fetches and displays the 20 most popular movies
async function displayPopularMovies() {
  // Fetches movie data and generates HTML for each movie card
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;

    // Appends each movie card to the 'popular-movies' section
    document.querySelector("#popular-movies").appendChild(div);
  });
}

// Fetches and displays the 20 most popular TV shows
async function displayPopularShows() {
  // Fetches TV show data and generates HTML for each show card
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
          ${
            show.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />`
              : `<img
          src="../images/no-image.jpg"
          class="card-img-top"
          alt="${show.name}"
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small>
          </p>
        </div>
      `;

    // Appends each show card to the 'popular-shows' section
    document.querySelector("#popular-shows").appendChild(div);
  });
}

// Fetches and displays detailed information about a specific movie
async function displayMovieDetails() {
  // Gives us the movie ID through parsing the URL
  const movieId = window.location.search.split("=")[1];

  // Fetches movie data and generates HTML for the movie details
  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");

  // Generates HTML structure for movie details
  div.innerHTML = `
      <div class="details-top">
      <div>
      ${
        movie.poster_path
          ? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
      />`
          : `<img
      src="../images/no-image.jpg"
      class="card-img-top"
      alt="${movie.title}"
    />`
      }
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
          ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
        </ul>
        <a href="${
          movie.homepage
        }" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
          movie.budget
        )}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
          movie.revenue
        )}</li>
        <li><span class="text-secondary">Runtime:</span> ${
          movie.runtime
        } minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${movie.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(", ")}
      </div>
    </div>
      `;

  // Appends to the 'movie-details' section
  document.querySelector("#movie-details").appendChild(div);

  // Fetches and embeds the movie trailer
  fetchMovieTrailer(movieId);
}

// Fetches and displays detailed information about a specific TV show
async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  // Fetches TV show data
  const show = await fetchAPIData(`tv/${showId}`);

  // Overlay for background image
  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");

  // Generates HTML structure for TV show details
  div.innerHTML = `
      <div class="details-top">
      <div>
      ${
        show.poster_path
          ? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />`
          : `<img
      src="../images/no-image.jpg"
      class="card-img-top"
      alt="${show.name}"
    />`
      }
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
        <p>
          ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
        </ul>
        <a href="${
          show.homepage
        }" target="_blank" class="btn">Visit show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number of Episodes:</span> ${
          show.number_of_episodes
        }</li>
        <li><span class="text-secondary">Last Episode To Air:</span> ${
          show.last_episode_to_air.name
        }</li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${show.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(", ")}
      </div>
    </div>
      `;

  // Appends to the 'show-details' section
  document.querySelector("#show-details").appendChild(div);
}

// Display backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
  // Creates a background image and appends it to the respective details section
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// Searches for Movies/Shows based on user input
async function search() {
  // Fetches search parameters from URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  // Makes API request based on search criteria and displays search results if user inputted text
  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }

    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term");
  }
}

// Displays search results and handles pagination
function displaySearchResults(results) {
  // Clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  // Generates HTML structure for search results and displays them
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === "movie" ? result.title : result.name
              }"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === "movie" ? result.title : result.name}"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === "movie"
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>
        `;

    document.querySelector("#search-results-heading").innerHTML = `
              <h2>${results.length} of ${global.search.totalResults} 
              Results for ${global.search.term}</h2>
    `;

    document.querySelector("#search-results").appendChild(div);
  });

  // Handles pagination and displays page navigation buttons
  displayPagination();
}

// Create & Display Pagination for Search
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
            <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Previous page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

// Fetches genres and displays genre buttons
async function displayGenres() {
  // Fetches genre data from API and generates buttons for each genre
  const genresData = await fetchAPIData("genre/movie/list");
  const genres = genresData.genres;

  const genreButtonsContainer = document.createElement("div");
  genreButtonsContainer.classList.add("genre-buttons");

  // Adds event listeners to genre buttons for filtering movies by genre
  genres.forEach((genre) => {
    const button = document.createElement("button");
    button.classList.add("btn", "genre-btn");
    button.setAttribute("data-genre-id", genre.id);
    button.textContent = genre.name;

    button.addEventListener("click", () => {
      loadGenrePage(genre.id, genre.name);
    });

    genreButtonsContainer.appendChild(button);
  });

  const targetElement = document.querySelector(".genre-filter .container");
  targetElement.appendChild(genreButtonsContainer);
}

// Loads movies of a selected genre and updates display
async function loadGenrePage(genreId, genreName) {
  // Destructures results from fetchGenreAPIData to movies variable
  const { results: movies } = await fetchGenreAPIData(genreId);

  const moviesContainer = document.querySelector("#popular-movies");
  moviesContainer.innerHTML = ""; // Clear previous content

  // Updates display
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `
              <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}" />
            `
                : `
              <img src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}" />
            `
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release Date: ${
                movie.release_date
              }</small>
            </p>
          </div>
        `;
    moviesContainer.appendChild(div);
  });

  // Update heading for the genre movies
  const genreHeading = document.querySelector(".genre-filter h3");
  genreHeading.textContent = `Selected Genre: ${genreName}`;
}

// Display movies in a slider
async function displaySlider() {
  // Restructure results
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
          1
        )} / 10
      </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}

// Initializes the Swiper slider for displaying movies
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: true,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },

    effect: "coverflow",
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    centeredSlides: true,
  });
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  showSpinner();

  const response = await fetch(
    `${global.API_URL}${endpoint}?api_key=${global.API_KEY}&languag=en-US`
  );

  const data = await response.json();

  hideSpinner();

  // Returns the fetched data as JSON
  return data;
}

// Make request to search
async function searchAPIData() {
  showSpinner();

  const response = await fetch(
    `${global.API_URL}search/${global.search.type}?api_key=${global.API_KEY}&languag=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();

  // Returns search results along with pagination details
  return data;
}

// Make request to fetch API data for genres
async function fetchGenreAPIData(genreId) {
  showSpinner();

  const response = await fetch(
    `${global.API_URL}discover/movie?api_key=${global.API_KEY}&with_genres=${genreId}`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// Shows loading spinner animation
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

// Hides loading spinner animation
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// Function to fetch and display movie trailer
async function fetchMovieTrailer(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${global.API_KEY}&language=en-US`
  );
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const trailerKey = data.results[0].key; // Assuming the first video is a trailer

    // Embedding YouTube video into the trailer container
    const trailerContainer = document.getElementById("trailer-container");
    trailerContainer.innerHTML = `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
      `;
  }
}

// Alert message for empty user searches
function showAlert(message, className = "error") {
  const alertElement = document.createElement("div");
  alertElement.classList.add("alert", className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertElement);

  setTimeout(() => alertElement.remove(), 3000);
}

function addCommasToNumber(number) {
  // Regular expression
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayGenres();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      search();
      break;
  }

  highlightActiveLink();
}

// Initializes web page when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
