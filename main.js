// ─────────────────────────────────────────────
//  EXERCISE 1 · Basics & Setup
//  External script loaded via <script src="main.js">
// ─────────────────────────────────────────────
console.log("Welcome to the Community Portal");


// ─────────────────────────────────────────────
//  UTILITY · Toast notification (replaces alert)
// ─────────────────────────────────────────────
function showToast(message, type = "info", duration = 3500) {
  const icons = { success: "✅", error: "❌", info: "💬" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  document.getElementById("toast-container").appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(80px)";
    setTimeout(() => toast.remove(), 400);
  }, duration);
}


// ─────────────────────────────────────────────
//  EXERCISE 2 · Syntax, Data Types & Operators
// ─────────────────────────────────────────────
const eventName = "City Music Fest";
const eventDate = "2026-08-15";
let availableSeats = 50;

let eventInfo = `Event: ${eventName} | Date: ${eventDate} | Seats: ${availableSeats}`;
console.log("Event Info:", eventInfo);

availableSeats--;
console.log("Seats after 1 registration:", availableSeats);
availableSeats++;
console.log("Seats after 1 cancellation:", availableSeats);


// ─────────────────────────────────────────────
//  EXERCISE 5 · Objects & Prototypes
// ─────────────────────────────────────────────
class CommunityEvent {
  constructor(id, name, date, category, location, seats) {
    this.id         = id;
    this.name       = name;
    this.date       = new Date(date);
    this.category   = category;
    this.location   = location;
    this.seats      = seats;
    this.registered = 0;
  }

  checkAvailability() {
    return this.seats - this.registered > 0;
  }

  get seatsLeft() {
    return this.seats - this.registered;
  }

  get occupancyPercent() {
    return Math.round((this.registered / this.seats) * 100);
  }

  get formattedDate() {
    return this.date.toLocaleDateString("en-US", {
      weekday: "long",
      year:    "numeric",
      month:   "long",
      day:     "numeric"
    });
  }
}

function printEventDetails(ev) {
  console.log("── Event Details ──");
  Object.entries(ev).forEach(([key, value]) => console.log(`  ${key}: ${value}`));
}


// ─────────────────────────────────────────────
//  EXERCISE 6 · Arrays & Methods
// ─────────────────────────────────────────────
let eventsArray = [
  new CommunityEvent(1, "City Music Fest",    "2026-08-15", "Music",    "Central Park",    50),
  new CommunityEvent(2, "Workshop on Baking", "2026-09-01", "Food",     "Community Hall",  30),
  new CommunityEvent(3, "Art & Craft Fair",   "2026-09-10", "Art",      "Town Square",     100),
  new CommunityEvent(4, "Marathon 5K Run",    "2026-07-20", "Sports",   "City Stadium",    200),
  new CommunityEvent(5, "Jazz Night Live",    "2026-08-25", "Music",    "Riverside Venue", 80),
  new CommunityEvent(6, "Street Food Fiesta", "2026-10-05", "Food",     "Main Street",     150),
  new CommunityEvent(7, "Pottery Workshop",   "2026-11-12", "Workshop", "Art Studio",      20),
  new CommunityEvent(8, "Photography Walk",   "2026-07-05", "Art",      "Old Town",        40),
];

eventsArray.push(new CommunityEvent(9, "Dance Festival", "2026-12-01", "Music", "Open Arena", 300));
console.log("Total events after push:", eventsArray.length);

const musicEvents = eventsArray.filter(e => e.category === "Music");
console.log("Music events:", musicEvents.map(e => e.name));

const displayTitles = eventsArray.map(e => `${e.category}: ${e.name}`);
console.log("Display titles:", displayTitles);


// ─────────────────────────────────────────────
//  EXERCISE 4 · Functions, Scope, Closures, HOF
// ─────────────────────────────────────────────
function addEvent(id, name, date, category, location, seats) {
  const newEvent = new CommunityEvent(id, name, date, category, location, seats);
  eventsArray.push(newEvent);
  console.log(`Event "${name}" added. Total: ${eventsArray.length}`);
  return newEvent;
}

function makeCategoryTracker(category) {
  let totalRegistrations = 0;
  return {
    register() {
      totalRegistrations++;
      console.log(`${category} registrations: ${totalRegistrations}`);
    },
    getCount() {
      return totalRegistrations;
    }
  };
}

const musicTracker    = makeCategoryTracker("Music");
const workshopTracker = makeCategoryTracker("Workshop");
const foodTracker     = makeCategoryTracker("Food");
const sportsTracker   = makeCategoryTracker("Sports");
const artTracker      = makeCategoryTracker("Art");

const categoryTrackers = {
  Music:    musicTracker,
  Workshop: workshopTracker,
  Food:     foodTracker,
  Sports:   sportsTracker,
  Art:      artTracker
};

function filterEventsByCategory(events, category, callback) {
  const result = events.filter(e =>
    category === "all" ? true : e.category === category
  );
  if (typeof callback === "function") callback(result);
  return result;
}


// ─────────────────────────────────────────────
//  EXERCISE 3 · Conditionals, Loops & Error Handling
// ─────────────────────────────────────────────
function registerUser(eventId) {
  try {
    const event = eventsArray.find(e => e.id === eventId);
    if (!event) throw new Error(`Event with ID ${eventId} not found.`);

    const { name, seats, registered } = event;

    if (registered >= seats) {
      throw new Error(`"${name}" is fully booked.`);
    }

    event.registered++;

    if (categoryTrackers[event.category]) {
      categoryTrackers[event.category].register();
    }

    console.log(`Registered for "${name}". Seats left: ${event.seatsLeft}`);
    showToast(`You're registered for "${name}"! 🎉`, "success");
    updateStatsBar();
    renderEvents(currentDisplayedEvents);
    return true;
  } catch (err) {
    console.error("Registration Error:", err.message);
    showToast(err.message, "error");
    return false;
  }
}

function cancelRegistration(eventId) {
  try {
    const event = eventsArray.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found.");
    if (event.registered <= 0) throw new Error(`No registrations to cancel for "${event.name}".`);

    event.registered--;
    console.log(`Cancelled registration for "${event.name}".`);
    showToast(`Registration cancelled for "${event.name}".`, "info");
    updateStatsBar();
    renderEvents(currentDisplayedEvents);
  } catch (err) {
    console.error("Cancellation Error:", err.message);
    showToast(err.message, "error");
  }
}


// ─────────────────────────────────────────────
//  EXERCISE 9 · Async JS, Promises & Async/Await
// ─────────────────────────────────────────────
const MOCK_API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=3";

function fetchEventsWithPromise() {
  fetch(MOCK_API_URL)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      console.log("Mock API (Promise): received", data.length, "items");
    })
    .catch(err => {
      console.warn("Mock fetch (Promise) failed:", err.message);
    });
}

async function loadEvents() {
  showLoading(true);

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const today = new Date();

    // EXERCISE 10: Spread to clone before filtering
    const clonedEvents = [...eventsArray];

    // EXERCISE 3: forEach + if-else filter for upcoming events with seats
    const validEvents = clonedEvents.filter(e => {
      const isUpcoming = e.date >= today;
      const hasSeat    = e.checkAvailability();
      return isUpcoming && hasSeat;
    });

    console.log("Events loaded:", validEvents.length, "valid upcoming events");
    currentDisplayedEvents = validEvents;
    renderEvents(validEvents);
    populateEventDropdown(validEvents);
    updateStatsBar();
    fetchEventsWithPromise();
  } catch (err) {
    console.error("Error loading events:", err.message);
    showToast("Failed to load events. Please try again.", "error");
  } finally {
    showLoading(false);
  }
}


// ─────────────────────────────────────────────
//  EXERCISE 7 · DOM Manipulation
// ─────────────────────────────────────────────
let currentDisplayedEvents = [];

function showLoading(state) {
  document.querySelector("#loading").style.display = state ? "block" : "none";
  document.querySelector("#event-container").style.display = state ? "none" : "grid";
}

function getSeatsPillClass(event) {
  const pct = event.occupancyPercent;
  if (!event.checkAvailability()) return "full";
  if (pct >= 70) return "low";
  return "";
}

function getSeatsPillLabel(event) {
  if (!event.checkAvailability()) return "Full";
  if (event.seatsLeft === 1) return "1 seat left!";
  return `${event.seatsLeft} seats left`;
}

function renderEvents(events) {
  const container = document.querySelector("#event-container");
  container.innerHTML = "";

  if (events.length === 0) {
    container.innerHTML = `
      <div class="no-events">
        <span>🔍</span>
        <p>No events found matching your criteria.</p>
      </div>`;
    return;
  }

  // EXERCISE 3: forEach loop to display events
  events.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("event-card", `card-${event.category}`);

    const pillClass = getSeatsPillClass(event);
    const pillLabel = getSeatsPillLabel(event);
    const fillColor = {
      Music:    "#a78bfa",
      Food:     "#fcd34d",
      Art:      "#f9a8d4",
      Sports:   "#6ee7b7",
      Workshop: "#93c5fd",
      General:  "#8b949e"
    }[event.category] || "#8b949e";

    const fillWidth = Math.min(event.occupancyPercent, 100);

    card.innerHTML = `
      <div class="card-top">
        <span class="badge badge-${event.category}">${event.category}</span>
        <span class="seats-pill ${pillClass}">${pillLabel}</span>
      </div>
      <h3>${event.name}</h3>
      <div class="event-meta">
        <p><span class="meta-icon">📅</span>${event.formattedDate}</p>
        <p><span class="meta-icon">📍</span>${event.location}</p>
        <p><span class="meta-icon">👥</span>${event.registered} / ${event.seats} registered</p>
      </div>
      <div class="seats-bar-wrap">
        <div class="seats-bar-label">
          <span>Occupancy</span>
          <span>${event.occupancyPercent}%</span>
        </div>
        <div class="seats-bar">
          <div class="seats-bar-fill" style="width:${fillWidth}%; background:${fillColor};"></div>
        </div>
      </div>
      <div class="card-actions"></div>
    `;

    const actions = card.querySelector(".card-actions");

    // EXERCISE 8: onclick for Register button
    if (event.checkAvailability()) {
      const registerBtn = document.createElement("button");
      registerBtn.className = "btn-register";
      registerBtn.textContent = "Register Now";
      registerBtn.setAttribute("data-id", event.id);
      registerBtn.onclick = () => registerUser(event.id);
      actions.appendChild(registerBtn);
    } else {
      const fullBtn = document.createElement("button");
      fullBtn.className = "btn-full";
      fullBtn.textContent = "Fully Booked";
      fullBtn.disabled = true;
      actions.appendChild(fullBtn);
    }

    if (event.registered > 0) {
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "btn-cancel";
      cancelBtn.textContent = "Cancel Registration";
      cancelBtn.onclick = () => cancelRegistration(event.id);
      actions.appendChild(cancelBtn);
    }

    // EXERCISE 14: jQuery fadeIn for each card
    $(card).hide();
    container.appendChild(card);
    $(card).fadeIn(350);
  });
}

function updateStatsBar() {
  const totalEvents = currentDisplayedEvents.length;
  const totalSeats  = currentDisplayedEvents.reduce((sum, e) => sum + e.seats, 0);
  const totalReg    = currentDisplayedEvents.reduce((sum, e) => sum + e.registered, 0);
  document.getElementById("stat-events").textContent = totalEvents;
  document.getElementById("stat-seats").textContent  = totalSeats;
  document.getElementById("stat-reg").textContent    = totalReg;
}

function populateEventDropdown(events) {
  const select = document.querySelector("#reg-event");
  select.innerHTML = `<option value="">— Choose an event —</option>`;
  events.forEach(e => {
    const option = document.createElement("option");
    option.value = e.id;
    option.textContent = e.name;
    select.appendChild(option);
  });
}


// ─────────────────────────────────────────────
//  EXERCISE 8 · Event Handling
// ─────────────────────────────────────────────
function filterByCategory() {
  const category   = document.querySelector("#category-filter").value;
  const searchTerm = document.querySelector("#search-input").value.toLowerCase().trim();
  const today      = new Date();

  filterEventsByCategory(eventsArray, category, (filtered) => {
    const results = filtered.filter(e =>
      e.date >= today &&
      (searchTerm === "" || e.name.toLowerCase().includes(searchTerm))
    );
    currentDisplayedEvents = results;
    renderEvents(results);
    updateStatsBar();
  });
}

document.addEventListener("DOMContentLoaded", function () {

  // EXERCISE 8: keyup on search (keyup ensures the typed char is included)
  const searchInput = document.querySelector("#search-input");
  searchInput.addEventListener("keyup", function () {
    const query    = this.value.toLowerCase().trim();
    const category = document.querySelector("#category-filter").value;
    const today    = new Date();

    const results = eventsArray.filter(e => {
      const matchName = e.name.toLowerCase().includes(query);
      const matchCat  = category === "all" || e.category === category;
      const upcoming  = e.date >= today;
      return matchName && matchCat && upcoming;
    });

    currentDisplayedEvents = results;
    renderEvents(results);
    updateStatsBar();
  });

  // EXERCISE 8: onchange for category filter
  document.querySelector("#category-filter").addEventListener("change", filterByCategory);

  // Reload button
  document.querySelector("#reloadBtn").addEventListener("click", () => {
    document.querySelector("#search-input").value = "";
    document.querySelector("#category-filter").value = "all";
    loadEvents();
  });

  // EXERCISE 1: Welcome toast on page load (replaces blocking alert)
  window.addEventListener("load", () => {
    showToast("Welcome to the Community Event Portal! 🎉", "info", 4000);
  });

  loadEvents();
});


// ─────────────────────────────────────────────
//  EXERCISE 11 · Working with Forms
// ─────────────────────────────────────────────
function clearFormErrors() {
  ["name", "email", "event"].forEach(field => {
    document.getElementById(`${field}-error`).textContent = "";
    const input = document.getElementById(`reg-${field}`);
    if (input) input.classList.remove("invalid");
  });
}

function showFieldError(field, message) {
  document.getElementById(`${field}-error`).textContent = message;
  const input = document.getElementById(`reg-${field}`);
  if (input) input.classList.add("invalid");
}

document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.querySelector("#registration-form");

  registrationForm.addEventListener("submit", function (e) {
    // EXERCISE 11: Prevent default form submission
    e.preventDefault();

    clearFormErrors();

    // Capture form values using form.elements
    const name    = registrationForm.elements["name"].value.trim();
    const email   = registrationForm.elements["email"].value.trim();
    const eventId = parseInt(registrationForm.elements["event"].value);

    let isValid = true;

    // EXERCISE 3: Inline validation with if-else
    if (!name || name.length < 2) {
      showFieldError("name", "Please enter your full name (at least 2 characters).");
      isValid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError("email", "Please enter a valid email address.");
      isValid = false;
    }

    if (!eventId || isNaN(eventId)) {
      showFieldError("event", "Please select an event to register for.");
      isValid = false;
    }

    if (!isValid) return;

    // EXERCISE 12: Send to mock API
    submitRegistration({ name, email, eventId });
  });

  // Clear error on input change
  ["reg-name", "reg-email", "reg-event"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => el.classList.remove("invalid"));
    }
  });
});


// ─────────────────────────────────────────────
//  EXERCISE 12 · AJAX & Fetch API
// ─────────────────────────────────────────────
function submitRegistration(userData) {
  const messageEl = document.querySelector("#form-message");
  const submitBtn = document.querySelector("#submitBtn");

  messageEl.className   = "submitting";
  messageEl.textContent = "⏳ Submitting your registration…";

  submitBtn.disabled    = true;
  submitBtn.textContent = "Submitting…";

  console.log("Submitting registration payload:", JSON.stringify(userData));

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(userData)
  })
    .then(response => {
      if (!response.ok) throw new Error("Server returned an error response.");
      return response.json();
    })
    .then(data => {
      console.log("Server response:", data);

      // EXERCISE 12: setTimeout to simulate delayed server confirmation
      setTimeout(() => {
        messageEl.className   = "success";
        messageEl.textContent = `🎉 Registered! Confirmation ID: #${data.id}`;

        submitBtn.disabled    = false;
        submitBtn.textContent = "✅ Submit Registration";

        document.querySelector("#registration-form").reset();
        clearFormErrors();

        // Register in the local event array (seat count)
        registerUser(userData.eventId);
      }, 1200);
    })
    .catch(err => {
      console.error("Fetch error:", err.message);
      messageEl.className   = "error-msg";
      messageEl.textContent = "❌ Submission failed. Please check your connection and try again.";
      submitBtn.disabled    = false;
      submitBtn.textContent = "✅ Submit Registration";
    });
}


// ─────────────────────────────────────────────
//  EXERCISE 10 · Modern JavaScript Features (ES6+)
// ─────────────────────────────────────────────

// Default parameters
function createEventCard(name, category = "General", seats = 50) {
  return { name, category, seats };
}

// Destructuring
function printEvent({ name, category, location, formattedDate }) {
  console.log(`[ES6] ${name} (${category}) @ ${location} on ${formattedDate}`);
}

// Spread to safely clone and filter
function getSafeFilteredEvents(category) {
  const cloned = [...eventsArray];
  return cloned.filter(e => e.category === category);
}

// Run ES6 demos on load
const sampleCard = createEventCard("Community Yoga", "Sports");
console.log("[ES6] Default params:", sampleCard);

const { name: firstEventName, category: firstEventCat } = eventsArray[0];
console.log(`[ES6] Destructured: name="${firstEventName}", category="${firstEventCat}"`);

const sportsEvents = getSafeFilteredEvents("Sports");
console.log("[ES6] Sports events (spread clone):", sportsEvents.map(e => e.name));

printEvent(eventsArray[0]);


// ─────────────────────────────────────────────
//  EXERCISE 14 · jQuery
// ─────────────────────────────────────────────
$(document).ready(function () {

  // jQuery click on register button (form submit)
  $('#submitBtn').click(function () {
    console.log('[jQuery] Submit button clicked');
  });

  // jQuery fadeIn on registration section
  $('#registration-section').hide().fadeIn(900);

  console.log('[jQuery] Ready. Registration section faded in.');

  /*
    jQuery Benefits:
    - Concise syntax: $('#id') vs document.getElementById('id')
    - Built-in cross-browser animations: .fadeIn(), .fadeOut(), .slideToggle()
    - Simplified AJAX: $.ajax(), $.get(), $.post()

    React / Vue advantage over jQuery:
    - React uses a Virtual DOM and component-based architecture, making it
      far better for building complex, stateful UIs at scale.
    - Vue offers reactive data binding out of the box, making UI updates
      automatic and predictable without manual DOM manipulation.
  */
});
