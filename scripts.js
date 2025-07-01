
function showWelcomeMessage() {
  const dynamicContent = document.getElementById("dynamicContent");
  dynamicContent.innerHTML = `
    <div class="welcome-message">
      <h2>👋 Welcome!</h2>
      <p>We’re happy to have you here!</p>
      <p>Discover full-body workout videos, expert guidance, and essential nutrition information</p>
      <p>Let’s get started on your fitness journey 💪</p>
    </div>
  `;
}

window.addEventListener("DOMContentLoaded", () => {
  showItem(currentIndex);
});

let isOpen = true;

function toggleAllSubsections() {
  const allSubsections = document.querySelectorAll('.subsection-list');
  const arrow = document.getElementById('mainArrow');

  allSubsections.forEach(list => {
    list.style.display = isOpen ? 'none' : 'block';
  });

  arrow.textContent = isOpen ? '▼' : '▲';
  isOpen = !isOpen;
}

function showVideo(videoSrc) {
  const dynamicContent = document.getElementById("dynamicContent");
  dynamicContent.innerHTML = `
    <video controls autoplay style="width: 100%; border-radius: 10px;">
      <source src="${videoSrc}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  `;
}

function showQuiz(quizId) {
  const dynamicContent = document.getElementById("dynamicContent");
  let quizHTML = "";

  if (quizId === "quiz1") {
    quizHTML = `
     <div class="quiz-container">
      <h2>📝 Quiz 1: Warm-Up</h2>
      <form id="quizForm">
        <p>What is the purpose of warming up?</p>
        <label><input type="radio" name="q1" value="a"> To tire the muscles</label><br>
        <label><input type="radio" name="q1" value="b"> To prevent injuries and prepare the body</label><br>
        <label><input type="radio" name="q1" value="c"> To build strength</label><br>
        <button type="button" onclick="submitQuiz('q1', 'b')">Submit</button>
      </form>
      <p id="quizResult" style="margin-top: 10px; font-weight: bold;"></p>
      </div>
    `;
  } else if (quizId === "quiz2") {
    quizHTML = `
     <div class="quiz-container">
      <h2>📝 Quiz 3: Nutrition</h2>
      <form id="quizForm">
        <p>What is the most important macronutrient for muscle repair?</p>
        <label><input type="radio" name="q2" value="a"> Fats</label><br>
        <label><input type="radio" name="q2" value="b"> Carbohydrates</label><br>
        <label><input type="radio" name="q2" value="c"> Protein</label><br>
        <button type="button" onclick="submitQuiz('q2', 'c')">Submit</button>
      </form>
      <p id="quizResult" style="margin-top: 10px; font-weight: bold;"></p>
      </div>
    `;
  } else if (quizId === "quiz3") {
    quizHTML = `
     <div class="quiz-container">
      <h2>📝 Quiz 2: Mistakes</h2>
      <form id="quizForm">
        <p>Which of the following is a common mistake in fitness?</p>
        <label><input type="radio" name="q3" value="a">Do both cardio and resistance exercises</label><br>
        <label><input type="radio" name="q3" value="b"> Skipping rest days</label><br>
        <label><input type="radio" name="q3" value="c"> Eating balanced meals</label><br>
        <button type="button" onclick="submitQuiz('q3', 'b')">Submit</button>
      </form>
      <p id="quizResult" style="margin-top: 10px; font-weight: bold;"></p>
      </div>
    `;
  }

  dynamicContent.innerHTML = quizHTML;
}

function submitQuiz(questionName, correctAnswer) {
  const result = document.getElementById("quizResult");
  const answer = document.querySelector(`input[name="${questionName}"]:checked`);

  if (!answer) {
    showPopup("❗ Please select an answer.", "orange"); 
    return;
  }

  if (answer.value === correctAnswer) {
    showPopup("✅ Correct! Well done!", "#4caf50"); 
  } else {
    showPopup("❌ Incorrect. Try again!", "red"); 
  }
}

function showPopup(message, bgColor) {
  const popup = document.getElementById("popupMessage");
  popup.textContent = message;
  popup.style.backgroundColor = bgColor;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2500);
}

const locations = {
  jeddah: { coords: [21.543333, 39.172778], name: "Jeddah Branch" },
  riyadh: { coords: [24.7136, 46.6753], name: "Riyadh Branch" },
  eastern: { coords: [26.4207, 50.0888], name: "Eastern Province Branch" }
};

let map;
let markers = {};
let mapInitialized = false;

function initializeMap() {
  map = L.map('map').setView([24.7136, 46.6753], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markers = {
    jeddah: L.marker(locations.jeddah.coords).bindPopup(locations.jeddah.name),
    riyadh: L.marker(locations.riyadh.coords).bindPopup(locations.riyadh.name),
    eastern: L.marker(locations.eastern.coords).bindPopup(locations.eastern.name)
  };

  showAll();
  mapInitialized = true;
}

function showMap(event = null) {
  if (event instanceof Event) event.preventDefault();
  
  // ⬅️ This line updates currentIndex to match courseItems
  currentIndex = courseItems.findIndex(item => item.type === "map");

  const dynamicContent = document.getElementById("dynamicContent");

  dynamicContent.innerHTML = `
    <div class="quiz-container">
      <h2>📍 Fitness Academy Locations</h2>
      <div style="margin-bottom: 20px;">
        <button onclick="showOnly('jeddah')">Show Jeddah</button>
        <button onclick="showOnly('riyadh')">Show Riyadh</button>
        <button onclick="showOnly('eastern')">Show Eastern Province</button>
        <button onclick="showAll()">Show All</button>
      </div>
      <div id="map" style="height: 500px; border-radius: 10px;"></div>
    </div>
  `;

  setTimeout(() => {
    if (mapInitialized) {
      map.remove();
      mapInitialized = false;
    }
    initializeMap();
  }, 100);
}


function showAll() {
  clearMarkers();
  for (let key in markers) {
    markers[key].addTo(map);
  }
  map.setView([24.5, 44], 5.8);
}

function showOnly(city) {
  clearMarkers();
  markers[city].addTo(map);
  map.setView(locations[city].coords, 11);
}

function clearMarkers() {
  for (let key in markers) {
    map.removeLayer(markers[key]);
  }
}

const courseItems = [
  { type: "welcome" },
  { type: "video", src: "Videos/warmup.mp4" },
  { type: "quiz", id: "quiz1" },
  { type: "video", src: "Videos/lunges.mp4" },
  { type: "video", src: "Videos/deadlift.mp4" },
  { type: "video", src: "Videos/arnoldpress.mp4" },
  { type: "video", src: "Videos/benchpress.mp4" },
  { type: "video", src: "Videos/pushup.mp4" },
  { type: "video", src: "Videos/widegrip.mp4" },
  { type: "video", src: "Videos/bentover.mp4" },
  { type: "video", src: "Videos/cardio.mp4" },
  { type: "video", src: "Videos/cooldown.mp4" },
  { type: "video", src: "Videos/MISTAKES.mp4" },
  { type: "quiz", id: "quiz3" },
  { type: "map" },
  { type: "video", src: "Videos/calc.mp4" },
  { type: "quiz", id: "quiz2" },
  { type: "video", src: "Videos/bestfood.mp4" }
];

let currentIndex = 0;

function showItem(index) {
  const item = courseItems[index];
  switch (item.type) {
    case "welcome": showWelcomeMessage(); break;
    case "video": showVideo(item.src); break;
    case "quiz": showQuiz(item.id); break;
    case "map": showMap(); break;
  }
}

document.getElementById("nextButton").addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= courseItems.length) currentIndex = 0;
  showItem(currentIndex);
});
