document.addEventListener("DOMContentLoaded", function () {

    const movie = JSON.parse(localStorage.getItem("selectedMovie"));

    if (!movie) {
        document.getElementById("detail-title").textContent = "Movie not found";
        return;
    }

    document.getElementById("detail-title").textContent = movie.title;
    document.getElementById("detail-poster").src = movie.poster;
    document.getElementById("detail-rating").textContent = "⭐ Rating: " + movie.rating;
    document.getElementById("detail-genre").textContent = "Genre: " + movie.genre;
    document.getElementById("detail-description").textContent = movie.description;

});