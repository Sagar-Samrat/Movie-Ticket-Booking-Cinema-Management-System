// ======================================================
// CINEVERSE BOOKING - JAVASCRIPT
// ======================================================


// ======================================================
// 1. SEAT PRICES
// ======================================================

const regularSeatPrice = 336;
const premiumSeatPrice = 450;


// ======================================================
// 2. GET ELEMENTS
// ======================================================

// Movie selection
const movieOptions = document.querySelectorAll(
    'input[name="movie"]'
);

// Theatre selection
const theatreOptions = document.querySelectorAll(
    'input[name="theatre"]'
);

// Showtime selection
const showtimeOptions = document.querySelectorAll(
    'input[name="showtime"]'
);

// Actual seat checkboxes
const seatOptions = document.querySelectorAll(
    '.seat-layout input[type="checkbox"]'
);

// Date
const bookingDate =
    document.getElementById("bookingDate");


// ======================================================
// 3. MOVIE SELECTION
// ======================================================

movieOptions.forEach(function(movie) {

    movie.addEventListener("change", function() {

        updateBookingSummary();

    });

});


// ======================================================
// 4. THEATRE SELECTION
// ======================================================

theatreOptions.forEach(function(theatre) {

    theatre.addEventListener("change", function() {

        updateBookingSummary();

    });

});


// ======================================================
// 5. DATE SELECTION
// ======================================================

if (bookingDate) {

    bookingDate.addEventListener("change", function() {

        updateBookingSummary();

    });

}


// ======================================================
// 6. SHOWTIME SELECTION
// ======================================================

showtimeOptions.forEach(function(showtime) {

    showtime.addEventListener("change", function() {

        updateBookingSummary();

    });

});


// ======================================================
// 7. SEAT SELECTION
// ======================================================

seatOptions.forEach(function(seat) {

    // IMPORTANT:
    // Use change instead of click
    // so the checked/unchecked state is updated first.

    seat.addEventListener("change", function() {

        updateBookingSummary();

    });

});


// ======================================================
// 8. GET SELECTED MOVIE
// ======================================================

function getSelectedMovie() {

    const movie =
        document.querySelector(
            'input[name="movie"]:checked'
        );

    if (movie) {

        return movie.value;

    }

    return "No movie selected";
}


// ======================================================
// 9. GET SELECTED THEATRE
// ======================================================

function getSelectedTheatre() {

    const theatre =
        document.querySelector(
            'input[name="theatre"]:checked'
        );

    if (theatre) {

        return theatre.value;

    }

    return "No theatre selected";
}


// ======================================================
// 10. GET SELECTED DATE
// ======================================================

function getSelectedDate() {

    if (bookingDate && bookingDate.value !== "") {

        return bookingDate.value;

    }

    return "No date selected";
}


// ======================================================
// 11. GET SELECTED SHOWTIME
// ======================================================

function getSelectedShowtime() {

    const showtime =
        document.querySelector(
            'input[name="showtime"]:checked'
        );

    if (showtime) {

        return showtime.value;

    }

    return "No showtime selected";
}


// ======================================================
// 12. GET SELECTED SEATS
// ======================================================

function getSelectedSeats() {

    const selectedSeats = [];

    const checkedSeats =
        document.querySelectorAll(
            '.seat-layout input[type="checkbox"]:checked'
        );

    checkedSeats.forEach(function(seat) {

        selectedSeats.push(seat.id);

    });

    return selectedSeats;
}


// ======================================================
// 13. GET FOOD TOTAL
// ======================================================

function getFoodTotal() {

    const foodTotal =
        localStorage.getItem("foodTotal");

    if (foodTotal === null) {

        return 0;

    }

    return Number(foodTotal);
}


// ======================================================
// 14. GET PRICE OF EACH SEAT
// ======================================================

function getSeatPrice(seatId) {

    // A and B = Regular seats
    if (
        seatId.startsWith("A") ||
        seatId.startsWith("B")
    ) {

        return regularSeatPrice;

    }

    // C and D = Premium seats
    if (
        seatId.startsWith("C") ||
        seatId.startsWith("D")
    ) {

        return premiumSeatPrice;

    }

    return 0;
}


// ======================================================
// 15. CALCULATE TICKET TOTAL
// ======================================================

function calculateTicketTotal() {

    const selectedSeats =
        getSelectedSeats();

    let total = 0;

    selectedSeats.forEach(function(seatId) {

        total = total + getSeatPrice(seatId);

    });

    return total;
}


// ======================================================
// 16. CALCULATE FINAL TOTAL
// ======================================================

function calculateFinalTotal() {

    const ticketTotal =
        calculateTicketTotal();

    const foodTotal =
        getFoodTotal();

    return ticketTotal + foodTotal;
}


// ======================================================
// 17. UPDATE BOOKING SUMMARY
// ======================================================

function updateBookingSummary() {

    const movie =
        getSelectedMovie();

    const theatre =
        getSelectedTheatre();

    const date =
        getSelectedDate();

    const showtime =
        getSelectedShowtime();

    const seats =
        getSelectedSeats();

    const foodTotal =
        getFoodTotal();

    const finalTotal =
        calculateFinalTotal();


    // --------------------------------------------------
    // Movie
    // --------------------------------------------------

    const summaryMovie =
        document.getElementById("summaryMovie");

    if (summaryMovie) {

        summaryMovie.textContent =
            movie;

    }


    // --------------------------------------------------
    // Theatre
    // --------------------------------------------------

    const summaryTheatre =
        document.getElementById("summaryTheatre");

    if (summaryTheatre) {

        summaryTheatre.textContent =
            theatre;

    }


    // --------------------------------------------------
    // Date
    // --------------------------------------------------

    const summaryDate =
        document.getElementById("summaryDate");

    if (summaryDate) {

        summaryDate.textContent =
            date;

    }


    // --------------------------------------------------
    // Showtime
    // --------------------------------------------------

    const summaryShowtime =
        document.getElementById("summaryShowtime");

    if (summaryShowtime) {

        summaryShowtime.textContent =
            showtime;

    }


    // --------------------------------------------------
    // Seats
    // --------------------------------------------------

    const summarySeats =
        document.getElementById("summarySeats");

    if (summarySeats) {

        if (seats.length > 0) {

            summarySeats.textContent =
                seats.join(", ");

        } else {

            summarySeats.textContent =
                "No seats selected";

        }

    }


    // --------------------------------------------------
    // Food
    // --------------------------------------------------

    const summaryFood =
        document.getElementById("summaryFood");

    if (summaryFood) {

        summaryFood.textContent =
            "₹" + foodTotal;

    }


    // --------------------------------------------------
    // TOTAL
    // --------------------------------------------------

    const totalAmount =
        document.getElementById("totalAmount");

    if (totalAmount) {

        totalAmount.textContent =
            "₹" + finalTotal;

    }


    // --------------------------------------------------
    // PAYMENT TOTAL
    // --------------------------------------------------

    const paymentTotal =
        document.getElementById("paymentTotal");

    if (paymentTotal) {

        paymentTotal.textContent =
            "₹" + finalTotal;

    }


    // --------------------------------------------------
    // BOOKING FOOTER MOVIE
    // --------------------------------------------------

    const bookingMovie =
        document.getElementById("bookingMovie");

    if (bookingMovie) {

        bookingMovie.textContent =
            movie;

    }


    // --------------------------------------------------
    // BOOKING FOOTER DETAILS
    // --------------------------------------------------

    const bookingDetails =
        document.getElementById("bookingDetails");

    if (bookingDetails) {

        bookingDetails.textContent =
            theatre +
            " • " +
            date +
            " • " +
            showtime;

    }

}


// ======================================================
// 18. PAYMENT BUTTON
// ======================================================

const paymentButtons =
    document.querySelectorAll(".checkout-btn");


paymentButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        const selectedSeats =
            getSelectedSeats();


        // No seat selected
        if (selectedSeats.length === 0) {

            alert("Please select at least one seat.");

            return;

        }


        const finalTotal =
            calculateFinalTotal();


        alert(
            "Booking Summary\n\n" +

            "Movie: " +
            getSelectedMovie() +

            "\nTheatre: " +
            getSelectedTheatre() +

            "\nDate: " +
            getSelectedDate() +

            "\nShowtime: " +
            getSelectedShowtime() +

            "\nSeats: " +
            selectedSeats.join(", ") +

            "\nFood: ₹" +
            getFoodTotal() +

            "\n\nTotal Amount: ₹" +
            finalTotal
        );

    });

});


// ======================================================
// 19. RUN WHEN PAGE LOADS
// ======================================================

updateBookingSummary();