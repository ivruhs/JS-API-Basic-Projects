

function searchGIFs() {
  const searchTerm = document.getElementById("search-input").value.trim();
  if (!searchTerm) return alert("Please enter a search term!");

  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(
    searchTerm
  )}&limit=10`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("gif-container");
      container.innerHTML = ""; // Clear previous results
      data.data.forEach((gif) => {
        createGIFBox(gif.images.fixed_height.url, gif.images.original.url);
      });
    })
    .catch((error) => console.error("Error fetching GIFs:", error));
}

// Function to create a GIF box and append it to the container
function createGIFBox(gifUrl, originalUrl) {
  let container = document.getElementById("gif-container");

  let box = document.createElement("div");
  box.classList.add("box");

  let img = document.createElement("img");
  img.classList.add("gif");
  img.src = gifUrl;
  img.alt = "GIF";

  let btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-container");

  let copyBtn = document.createElement("button");
  copyBtn.classList.add("copy");
  copyBtn.textContent = "📋";
  copyBtn.addEventListener("click", function () {
    copyGIFLink(originalUrl);
  });

  let downloadBtn = document.createElement("button");
  downloadBtn.classList.add("download");
  downloadBtn.textContent = "📥";
  downloadBtn.addEventListener("click", function () {
    downloadGIF(originalUrl);
  });

  btnContainer.appendChild(copyBtn);
  btnContainer.appendChild(downloadBtn);

  box.appendChild(img);
  box.appendChild(btnContainer);
  container.appendChild(box);
}

// Function to copy GIF link
function copyGIFLink(url) {
  navigator.clipboard
    .writeText(url)
    .then(() => alert("GIF link copied!"))
    .catch((err) => console.error("Error copying link:", err));
}

// Function to download GIF
function downloadGIF(url) {
  let a = document.createElement("a");
  a.href = url;
  a.download = "gif.gif";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Attach event listener to the search button (Fixed ID)
document.getElementById("search-btn").addEventListener("click", searchGIFs);


