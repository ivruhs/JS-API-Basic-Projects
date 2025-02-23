function generateColors() {
  const selectedColor = document
    .getElementById("color-picker")
    .value.replace("#", "");
  const selectedMode = document.getElementById("color-mode").value;
  const apiUrl = `https://www.thecolorapi.com/scheme?hex=${selectedColor}&mode=${selectedMode}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.colors);
      data.colors.forEach((color, index) => {
        const schemeElement = document.querySelector(`.scheme-${index + 1}`);
        const paraElement = document.querySelector(`.para-${index + 1}`);

        if (schemeElement) {
          schemeElement.style.backgroundColor = color.hex.value;
          schemeElement.setAttribute("data-color", color.hex.value);
        }
        if (paraElement) {
          paraElement.textContent = color.hex.value;
          paraElement.setAttribute("data-color", color.hex.value);
        }
      });

      addCopyEventListeners();
    })
    .catch((error) => console.error("Error fetching colors:", error));
}

function addCopyEventListeners() {
  document.querySelectorAll(".scheme, .color").forEach((element) => {
    element.addEventListener("click", function () {
      const colorHex = this.getAttribute("data-color");
      if (colorHex) {
        copyToClipboard(colorHex);
        showCopyTooltip(this);
      }
    });
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => console.log(`Copied: ${text}`),
    (err) => console.error("Failed to copy text:", err)
  );
}

function showCopyTooltip(element) {
  const tooltip = document.createElement("span");
  tooltip.classList.add("copy-tooltip");
  tooltip.textContent = "Copied!";

  element.appendChild(tooltip);
  tooltip.classList.add("show");

  setTimeout(() => {
    tooltip.classList.remove("show");
    setTimeout(() => tooltip.remove(), 300);
  }, 1000);
}
