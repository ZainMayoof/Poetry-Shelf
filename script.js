const API_URL = "https://poetrydb.org/random/6";
const poemGrid = document.querySelector("#poemGrid");
const statusMessage = document.querySelector("#statusMessage");
const refreshButton = document.querySelector("#refreshButton");

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function getExcerpt(lines) {
  const text = lines.join(" ").replace(/\s+/g, " ").trim();
  return text.length > 100 ? `${text.slice(0, 100).trim()}…` : text;
}

function renderPoems(poems) {
  poemGrid.innerHTML = poems.map((poem, index) => {
    const detailUrl = `poem.html?title=${encodeURIComponent(poem.title)}&author=${encodeURIComponent(poem.author)}`;
    return `
      <div class="col-12 col-md-6 col-xl-4">
        <article class="poem-card d-flex flex-column">
          <h2 class="poem-title">${escapeHtml(poem.title)}</h2>
          <p class="poem-author">by ${escapeHtml(poem.author)}</p>
          <p class="poem-excerpt">${escapeHtml(getExcerpt(poem.lines))}</p>
          <a class="btn view-button mt-auto" href="${detailUrl}">View Full Poem</a>
        </article>
      </div>`;
  }).join("");
}

async function loadPoems() {
  statusMessage.className = "status-message";
  statusMessage.textContent = "Loading poems…";
  poemGrid.innerHTML = "";
  refreshButton.disabled = true;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    const poems = await response.json();
    if (!Array.isArray(poems) || poems.length === 0) throw new Error("The API returned no poems.");
    renderPoems(poems);
    statusMessage.textContent = `${poems.length} poems loaded from PoetryDB.`;
  } catch (error) {
    console.error("Could not retrieve poems:", error);
    statusMessage.className = "status-message error";
    statusMessage.textContent = "The poems could not be loaded right now. Please try again.";
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", loadPoems);
loadPoems();
