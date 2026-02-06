const overlayRoot = document.getElementById("overlay-root");

function openOverlay(html) {
  overlayRoot.innerHTML = `
    <div class="overlay">
      <div class="overlay-box">${html}</div>
    </div>
  `;
}

function closeOverlay() {
  overlayRoot.innerHTML = "";
}