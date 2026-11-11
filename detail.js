const API_BASE = "https://poetrydb.org/title/";
const detail = document.querySelector("#poemDetail");
const params = new URLSearchParams(window.location.search);
const title = params.get("title");
const author = params.get("author");

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

async function loadFullPoem() {
  if (!title) {
    detail.innerHTML = '<p class="status-message error">No poem was selected. Return to the shelf and choose a card.</p>';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}${encodeURIComponent(title)}`);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    const poems = await response.json();
    const poem = poems.find((item) => item.author === author) || poems[0];
    if (!poem) throw new Error("The selected poem was not found.");

    document.title = `Poetry Shelf | ${poem.title}`;
    detail.innerHTML = `
      <p class="detail-label">Full poem</p>
      <h1>${escapeHtml(poem.title)}</h1>
      <p class="detail-author">by ${escapeHtml(poem.author)}</p>
      <p class="full-poem">${escapeHtml(poem.lines.join("\n"))}</p>`;
  } catch (error) {
    console.error("Could not retrieve the full poem:", error);
    detail.innerHTML = '<p class="status-message error">This poem could not be loaded. Return to the shelf and try another card.</p>';
  }
}

loadFullPoem();
