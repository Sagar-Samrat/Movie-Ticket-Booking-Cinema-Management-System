(function () {
    'use strict';

    // Embedded fallback so theatres work identically via both http(s):// and file://
    const FALLBACK_THEATRES = [
        {
            id: 'th_mum_01',
            name: 'CineVerse IMAX Phoenix',
            location: 'Mumbai',
            area: 'Lower Parel',
            address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel, Mumbai 400013',
            screens: 8,
            rating: 4.9,
            formats: ['IMAX', 'Dolby Atmos', '4DX'],
            amenities: ['Valet Parking', 'Gourmet Lounge', 'Wheelchair Access'],
            showtimes: ['10:30 AM', '01:45 PM', '05:15 PM', '08:45 PM'],
            image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_mum_02',
            name: 'CineVerse Icon Juhu',
            location: 'Mumbai',
            area: 'Juhu',
            address: 'Dynamic Mall, Juhu Tara Road, Juhu, Mumbai 400049',
            screens: 5,
            rating: 4.7,
            formats: ['4K Laser', 'Recliner', 'Dolby Atmos'],
            amenities: ['Express Counter', 'Recliner Pods', 'Valet Parking'],
            showtimes: ['11:15 AM', '02:30 PM', '06:00 PM', '09:30 PM'],
            image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_mum_03',
            name: 'CineVerse R-City Galleria',
            location: 'Mumbai',
            area: 'Ghatkopar',
            address: 'R-City Mall, LBS Marg, Ghatkopar West, Mumbai 400086',
            screens: 7,
            rating: 4.6,
            formats: ['2D', '3D', '4DX'],
            amenities: ['Food Court Access', 'Family Lounge', 'Parking'],
            showtimes: ['10:00 AM', '01:10 PM', '04:40 PM', '08:15 PM'],
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_del_01',
            name: 'CineVerse Select Saket',
            location: 'Delhi NCR',
            area: 'Saket',
            address: 'Select Citywalk Mall, District Centre, Saket, New Delhi 110017',
            screens: 7,
            rating: 4.8,
            formats: ['IMAX', 'Gold Class', 'Dolby Atmos'],
            amenities: ['In-Seat Dining', 'Valet Parking', 'VIP Lounge'],
            showtimes: ['10:45 AM', '02:00 PM', '05:30 PM', '09:00 PM'],
            image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_del_02',
            name: 'CineVerse Ambience Gurugram',
            location: 'Delhi NCR',
            area: 'Gurugram',
            address: 'Ambience Mall, NH-8, DLF Phase 3, Gurugram 122002',
            screens: 9,
            rating: 4.8,
            formats: ['IMAX', '4DX', 'Recliner'],
            amenities: ['Gourmet Cafe', 'Valet Parking', 'Wheelchair Access'],
            showtimes: ['11:00 AM', '02:20 PM', '05:45 PM', '09:15 PM'],
            image: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_blr_01',
            name: 'CineVerse Orion Mall',
            location: 'Bengaluru',
            area: 'Rajajinagar',
            address: 'Brigade Gateway, Dr Rajkumar Road, Rajajinagar, Bengaluru 560055',
            screens: 9,
            rating: 4.9,
            formats: ['IMAX', 'Dolby Atmos', '4K Laser'],
            amenities: ['Lakeside Plaza', 'Express Kiosk', 'Wheelchair Access'],
            showtimes: ['10:15 AM', '01:30 PM', '05:00 PM', '08:30 PM'],
            image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_blr_02',
            name: 'CineVerse Forum Koramangala',
            location: 'Bengaluru',
            area: 'Koramangala',
            address: 'The Forum Mall, Hosur Road, Koramangala, Bengaluru 560095',
            screens: 6,
            rating: 4.7,
            formats: ['4DX', 'Dolby Atmos', 'Recliner'],
            amenities: ['Snack Bar', 'Basement Parking', 'Couple Pods'],
            showtimes: ['11:30 AM', '03:00 PM', '06:30 PM', '09:45 PM'],
            image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_pun_01',
            name: 'CineVerse Phoenix Wakad',
            location: 'Pune',
            area: 'Wakad',
            address: 'Phoenix Mall of the Millennium, Wakad, Pune 411057',
            screens: 8,
            rating: 4.8,
            formats: ['IMAX', '4K Laser', 'Recliner'],
            amenities: ['Valet Parking', 'Artisan Snacks', 'VIP Lounge'],
            showtimes: ['10:30 AM', '01:50 PM', '05:20 PM', '08:50 PM'],
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_pun_02',
            name: 'CineVerse Pavillion SB Road',
            location: 'Pune',
            area: 'Shivajinagar',
            address: 'The Pavillion Mall, Senapati Bapat Road, Pune 411016',
            screens: 6,
            rating: 4.6,
            formats: ['Dolby Atmos', '2D', '3D'],
            amenities: ['Express Pickup', 'Wheelchair Access', 'Parking'],
            showtimes: ['11:10 AM', '02:40 PM', '06:10 PM', '09:20 PM'],
            image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_hyd_01',
            name: 'CineVerse AMB Jubilee Hills',
            location: 'Hyderabad',
            area: 'Gachibowli',
            address: 'Sarath City Capital Mall, Kondapur-Gachibowli, Hyderabad 500084',
            screens: 7,
            rating: 4.9,
            formats: ['4K Laser', 'Dolby Atmos', 'Recliner'],
            amenities: ['VIP Lounge', 'Gourmet Cafe', 'Valet Parking'],
            showtimes: ['10:20 AM', '01:40 PM', '05:10 PM', '08:40 PM'],
            image: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_kol_01',
            name: 'CineVerse South City',
            location: 'Kolkata',
            area: 'Jadavpur',
            address: 'South City Mall, Prince Anwar Shah Road, Kolkata 700068',
            screens: 6,
            rating: 4.7,
            formats: ['IMAX', 'Dolby Atmos', '3D'],
            amenities: ['Food Court', 'Wheelchair Access', 'Parking'],
            showtimes: ['10:45 AM', '02:15 PM', '05:45 PM', '09:05 PM'],
            image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=900&q=80'
        },
        {
            id: 'th_kol_02',
            name: 'CineVerse Quest Park Circus',
            location: 'Kolkata',
            area: 'Ballygunge',
            address: 'Quest Mall, Syed Amir Ali Avenue, Kolkata 700017',
            screens: 5,
            rating: 4.8,
            formats: ['Gold Class', '4K Laser', 'Recliner'],
            amenities: ['In-Seat Dining', 'Valet Parking', 'Lounge'],
            showtimes: ['11:30 AM', '03:00 PM', '06:20 PM', '09:35 PM'],
            image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80'
        }
    ];

    const locationFiltersEl = document.getElementById('locationFilters');
    const theatresGridEl = document.getElementById('theatresGrid');
    const searchInputEl = document.getElementById('theatreSearch');
    const formatFilterEl = document.getElementById('formatFilter');
    const resultsSummaryEl = document.getElementById('resultsSummary');

    let allTheatres = [];
    let activeLocation = 'All';

    function escapeHtml(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    async function loadTheatres() {
        try {
            const response = await fetch('../data/theatres.json');
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            const parsed = await response.json();
            allTheatres = Array.isArray(parsed) && parsed.length > 0 ? parsed : FALLBACK_THEATRES;
        } catch (err) {
            allTheatres = FALLBACK_THEATRES;
        }

        const params = new URLSearchParams(window.location.search);
        const locParam = params.get('location');
        if (locParam && allTheatres.some(t => t.location.toLowerCase() === locParam.toLowerCase())) {
            const matched = allTheatres.find(t => t.location.toLowerCase() === locParam.toLowerCase());
            activeLocation = matched.location;
        }

        renderLocationFilters();
        renderTheatres();
    }

    function renderLocationFilters() {
        const counts = allTheatres.reduce((acc, theatre) => {
            acc[theatre.location] = (acc[theatre.location] || 0) + 1;
            return acc;
        }, {});

        const locations = ['All', ...Object.keys(counts)];

        locationFiltersEl.innerHTML = locations.map(loc => {
            const count = loc === 'All' ? allTheatres.length : counts[loc];
            const label = loc === 'All' ? 'All Locations' : loc;
            const isActive = loc === activeLocation;

            return (
                '<button type="button" class="location-btn ' + (isActive ? 'active' : '') + '" data-location="' + escapeHtml(loc) + '">' +
                '<i class="bi ' + (loc === 'All' ? 'bi-globe2' : 'bi-geo-alt-fill') + '"></i>' +
                '<span>' + escapeHtml(label) + '</span>' +
                '<span class="location-count">' + count + '</span>' +
                '</button>'
            );
        }).join('');

        locationFiltersEl.querySelectorAll('.location-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                activeLocation = btn.dataset.location;
                renderLocationFilters();
                renderTheatres();
            });
        });
    }

    function getFilteredTheatres() {
        const query = searchInputEl.value.trim().toLowerCase();
        const selectedFormat = formatFilterEl.value;

        return allTheatres.filter(theatre => {
            const matchesLocation = activeLocation === 'All' || theatre.location === activeLocation;
            const matchesFormat = selectedFormat === 'All' || theatre.formats.includes(selectedFormat);
            const matchesQuery = !query ||
                theatre.name.toLowerCase().includes(query) ||
                theatre.area.toLowerCase().includes(query) ||
                theatre.location.toLowerCase().includes(query) ||
                theatre.address.toLowerCase().includes(query);
            return matchesLocation && matchesFormat && matchesQuery;
        });
    }

    function renderTheatres() {
        const filtered = getFilteredTheatres();
        const locationLabel = activeLocation === 'All' ? 'all cities' : activeLocation;
        resultsSummaryEl.textContent = 'Showing ' + filtered.length + ' theatre' + (filtered.length === 1 ? '' : 's') + ' in ' + locationLabel;

        if (filtered.length === 0) {
            theatresGridEl.innerHTML =
                '<div class="col-12">' +
                '<div class="empty-state">' +
                '<i class="bi bi-building-x"></i>' +
                '<h4>No matching theatres found</h4>' +
                '<p>Try choosing another location, clearing the search box, or switching formats.</p>' +
                '<button type="button" class="reset-btn" id="resetFiltersBtn">Reset Filters</button>' +
                '</div>' +
                '</div>';

            document.getElementById('resetFiltersBtn').addEventListener('click', function () {
                activeLocation = 'All';
                searchInputEl.value = '';
                formatFilterEl.value = 'All';
                renderLocationFilters();
                renderTheatres();
            });
            return;
        }

        theatresGridEl.innerHTML = filtered.map(theatre => {
            const bookingUrl = 'booking.html?theatre=' + encodeURIComponent(theatre.name) + '&location=' + encodeURIComponent(theatre.location);
            return (
                '<div class="col-lg-4 col-md-6">' +
                '<article class="theatre-card">' +
                '<div class="theatre-card-media">' +
                '<img src="' + escapeHtml(theatre.image) + '" alt="' + escapeHtml(theatre.name) + '">' +
                '<span class="location-badge"><i class="bi bi-geo-alt-fill"></i> ' + escapeHtml(theatre.location) + ' • ' + escapeHtml(theatre.area) + '</span>' +
                '<span class="rating-badge"><i class="bi bi-star-fill"></i> ' + escapeHtml(theatre.rating) + '</span>' +
                '</div>' +
                '<div class="theatre-card-body">' +
                '<h3>' + escapeHtml(theatre.name) + '</h3>' +
                '<p class="theatre-address">' + escapeHtml(theatre.address) + '</p>' +
                '<div class="format-tags">' +
                theatre.formats.map(f => '<span class="format-tag">' + escapeHtml(f) + '</span>').join('') +
                '</div>' +
                '<div class="showtime-label">Today\'s Showtimes</div>' +
                '<div class="showtime-row">' +
                theatre.showtimes.map(time => '<a href="' + bookingUrl + '&time=' + encodeURIComponent(time) + '" class="showtime-chip">' + escapeHtml(time) + '</a>').join('') +
                '</div>' +
                '<div class="theatre-card-footer">' +
                '<span class="screens-meta"><i class="bi bi-film"></i> ' + escapeHtml(theatre.screens) + ' Screens</span>' +
                '<div class="card-actions">' +
                '<button type="button" class="details-btn" data-theatre-id="' + escapeHtml(theatre.id) + '">Details</button>' +
                '<a href="' + bookingUrl + '" class="book-btn">Book</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</article>' +
                '</div>'
            );
        }).join('');

        theatresGridEl.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const theatre = allTheatres.find(t => t.id === btn.dataset.theatreId);
                if (theatre) {
                    openTheatreModal(theatre);
                }
            });
        });
    }

    function openTheatreModal(theatre) {
        document.getElementById('modalTheatreName').textContent = theatre.name;
        document.getElementById('modalTheatreLocation').textContent = theatre.location + ' • ' + theatre.area;
        document.getElementById('modalTheatreAddress').textContent = theatre.address;
        document.getElementById('modalTheatreScreens').textContent = theatre.screens + ' Screens • Rated ' + theatre.rating + ' / 5';

        document.getElementById('modalFormats').innerHTML = theatre.formats
            .map(f => '<span class="format-tag">' + escapeHtml(f) + '</span>')
            .join('');

        document.getElementById('modalAmenities').innerHTML = theatre.amenities
            .map(a => '<span class="amenity-pill"><i class="bi bi-check-circle-fill"></i> ' + escapeHtml(a) + '</span>')
            .join('');

        document.getElementById('modalBookBtn').href =
            'booking.html?theatre=' + encodeURIComponent(theatre.name) + '&location=' + encodeURIComponent(theatre.location);

        const modalEl = document.getElementById('theatreDetailsModal');
        if (window.bootstrap && window.bootstrap.Modal) {
            window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
    }

    searchInputEl.addEventListener('input', renderTheatres);
    formatFilterEl.addEventListener('change', renderTheatres);
    document.addEventListener('DOMContentLoaded', loadTheatres);
})();
