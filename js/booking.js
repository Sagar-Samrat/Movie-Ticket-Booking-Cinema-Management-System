document.addEventListener("DOMContentLoaded", function () {

    const movieName = document.getElementById("movie-name");
    const ticketCount = document.getElementById("ticket-count");
    const totalPrice = document.getElementById("total-price");
    const bookingForm = document.getElementById("booking-form");
    const bookingDate = document.getElementById("booking-date");

    const ticketPrice = 200;

    // Get selected movie
    const movie = JSON.parse(localStorage.getItem("selectedMovie"));

    if (movie) {
        movieName.value = movie.title;
    } else {
        movieName.value = "No movie selected";
    }

    // Set minimum booking date to today
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    bookingDate.min = localToday;

    // Calculate ticket price
    ticketCount.addEventListener("input", function () {

        const count = Number(ticketCount.value);

        if (count >= 1 && count <= 10) {
            totalPrice.textContent = count * ticketPrice;
        } else {
            totalPrice.textContent = 0;
        }

    });

    // Confirm booking
    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const booking = {
            movie: movieName.value,
            theatre: document.getElementById("theatre").value,
            date: bookingDate.value,
            time: document.getElementById("show-time").value,
            tickets: ticketCount.value,
            total: totalPrice.textContent
        };

        localStorage.setItem("currentBooking", JSON.stringify(booking));

        alert(
            "Booking Confirmed! 🎉\n\n" +
            "Movie: " + booking.movie +
            "\nTheatre: " + booking.theatre +
            "\nTickets: " + booking.tickets +
            "\nTotal: ₹" + booking.total
        );

    });

});