document.addEventListener("DOMContentLoaded", function () {

    const genreButtons = document.querySelectorAll(".genre-btn");
    const movieCards = document.querySelectorAll(".movies-section .movie-grid .movie-card");
    const movieGrid = document.querySelector(".movies-section .movie-grid");
    const searchInput = document.querySelector(".search-box input");
    const moodCards = document.querySelectorAll(".mood-card");

    let selectedGenre = "all movies";
    let selectedMood = "";

    const moodGenres = {
        "happy": ["romance"],
        "romantic": ["romance"],
        "thrilled": ["thriller", "horror"],
        "excited": ["action"],
        "emotional": ["romance"]
    };

    // GENRE, SEARCH AND MOOD FILTER

    function filterMovies() {

        let visibleMovies = 0;

        const searchText = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        movieCards.forEach(function (card) {

            const movieMeta = card.querySelector(".movie-meta");
            const movieTitle = card.querySelector("h3");
            const movieDescription = card.querySelector(".movie-description");

            if (!movieMeta || !movieTitle) return;

            const movieGenre = movieMeta.textContent
                .split("•")[0]
                .trim()
                .toLowerCase();

            const title = movieTitle.textContent.toLowerCase();

            const description = movieDescription
                ? movieDescription.textContent.toLowerCase()
                : "";

            const matchesGenre =
                selectedGenre === "all movies" ||
                movieGenre === selectedGenre;

            const matchesSearch =
                title.includes(searchText) ||
                description.includes(searchText);

            const matchesMood =
                selectedMood === "" ||
                moodGenres[selectedMood].includes(movieGenre);

            if (matchesGenre && matchesSearch && matchesMood) {
                card.style.display = "";
                visibleMovies++;
            } else {
                card.style.display = "none";
            }

        });

        let noResults = document.querySelector(".no-movies");

        if (visibleMovies === 0) {

            if (!noResults) {
                noResults = document.createElement("p");
                noResults.className = "no-movies";
                movieGrid.appendChild(noResults);
            }

            noResults.textContent = "No movies found.";

        } else if (noResults) {
            noResults.remove();
        }

    }

    // GENRE BUTTONS

    genreButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            genreButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            selectedGenre = this.textContent.trim().toLowerCase();

            selectedMood = "";

            moodCards.forEach(function (card) {
                card.classList.remove("active");
            });

            filterMovies();

        });

    });

    // MOVIE SEARCH

    if (searchInput) {

        searchInput.addEventListener("input", function () {
            filterMovies();
        });

    }

    // MOOD RECOMMENDATIONS

    moodCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const mood = card.querySelector("h3")
                .textContent.trim().toLowerCase();

            selectedMood = mood;
            selectedGenre = "all movies";

            moodCards.forEach(function (moodCard) {
                moodCard.classList.remove("active");
            });

            card.classList.add("active");

            genreButtons.forEach(function (button) {
                button.classList.remove("active");
            });

            genreButtons[0].classList.add("active");

            filterMovies();

            document.querySelector(".movies-section")
                .scrollIntoView({ behavior: "smooth" });

        });

    });

    // MOVIE DETAILS FUNCTIONALITY

  // MOVIE DETAILS AND DIRECT BOOKING

movieCards.forEach(function (card) {

    const detailsButton = card.querySelector(".details-btn");
    const bookButton = card.querySelector(".book-btn");

    function saveMovieAndOpenPage(page) {

        const selectedMovie = {
            title: card.querySelector("h3").textContent.trim(),
            poster: card.querySelector(".movie-poster img").src,
            rating: card.querySelector(".rating").textContent.trim(),
            genre: card.querySelector(".movie-meta").textContent.split("•")[0].trim(),
            description: card.querySelector(".movie-description").textContent.trim()
        };

        localStorage.setItem(
            "selectedMovie",
            JSON.stringify(selectedMovie)
        );

        window.location.href = page;
    }

    // View Details Button
    if (detailsButton) {

        detailsButton.addEventListener("click", function (event) {

            event.preventDefault();
            saveMovieAndOpenPage("movie-details.html");

        });

    }

    // Direct Book Now Button
    if (bookButton) {

        bookButton.addEventListener("click", function (event) {

            event.preventDefault();
            saveMovieAndOpenPage("booking.html");

        });

    }

});
    filterMovies();

});