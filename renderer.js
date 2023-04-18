onload = () => {
  const webview = document.querySelector("webview");
  const indicator = document.querySelector(".indicator");

  const loadstart = () => {
    indicator.innerText = "loading...";
  };

  const loadstop = () => {
    indicator.innerText = "";
  };

  webview.addEventListener("did-start-loading", loadstart);
  webview.addEventListener("did-stop-loading", loadstop);
};

// Back buttons
// JavaScript code to handle the back and forward buttons
const webview = document.getElementById("webview");
const backButton = document.getElementById("back-button");
const forwardButton = document.getElementById("forward-button");

backButton.addEventListener("click", () => {
  if (webview.canGoBack()) {
    webview.goBack();
  }
});

forwardButton.addEventListener("click", () => {
  if (webview.canGoForward()) {
    webview.goForward();
  }
});

webview.addEventListener("did-navigate", () => {
  backButton.disabled = !webview.canGoBack();
  forwardButton.disabled = !webview.canGoForward();
});

const refreshButton = document.getElementById("refresh-button");

refreshButton.addEventListener("click", () => {
  webview.reload();
});

const homeButton = document.getElementById("home-button");

homeButton.addEventListener("click", () => {
  const homepage = `file://${location.pathname}/../pages/newtab/index.html`;
  webview.loadURL(homepage);
});

// Adress bar

const urlInput = document.getElementById("url-input");
const autocomplete = document.getElementById("autocomplete");

let suggestions = [];
let activeSuggestion = -1;

function loadUrl() {
  const url = urlInput.value;
  if (isUrl(url)) {
    webview.loadURL(url);
  } else {
    webview.loadURL(
      `https://www.google.com/search?q=${encodeURIComponent(url)}`
    );
    console.log(encodeURIComponent(url));
  }
  hideAutocomplete();
}

function searchAutocomplete() {
  const searchTerm = urlInput.value;
  if (searchTerm.length > 0) {
    fetch(
      `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(
        searchTerm
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data[1]) {
          suggestions = data[1].slice(0, 5);
          showAutocomplete();
        } else {
          suggestions = [];
          hideAutocomplete();
        }
      })
      .catch(() => {
        suggestions = [];
        hideAutocomplete();
      });
  } else {
    hideAutocomplete();
  }
}

function setActiveSuggestion(index) {
  const items = autocomplete.querySelectorAll(".autocomplete-item");
  if (index < 0) {
    index = items.length - 1;
  } else if (index >= items.length) {
    index = 0;
  }
  activeSuggestion = index;
  items.forEach((item) => {
    item.classList.remove("active");
  });
  items[activeSuggestion].classList.add("active");
}

function showAutocomplete() {
  autocomplete.innerHTML = "";
  suggestions.forEach((suggestion) => {
    const item = document.createElement("div");
    item.classList.add("autocomplete-item");
    item.innerText = suggestion;
    item.addEventListener("click", () => {
      urlInput.value = suggestion;
      loadUrl();
    });
    autocomplete.appendChild(item);
  });
  autocomplete.style.display = "block";
}

function hideAutocomplete() {
  activeSuggestion = -1;
  suggestions = [];
  autocomplete.innerHTML = "";
  autocomplete.style.display = "none";
}

function isUrl(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

function getWebviewUrl() {
  return webview.getURL();
}

urlInput.addEventListener("input", searchAutocomplete);
urlInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    setActiveSuggestion(activeSuggestion - 1);
    urlInput.value = suggestions[activeSuggestion];
  } else if (event.key === "ArrowDown") {
    event.preventDefault();

    setActiveSuggestion(activeSuggestion + 1);
    urlInput.value = suggestions[activeSuggestion];
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (activeSuggestion >= 0) {
      urlInput.value = suggestions[activeSuggestion];
    }
    loadUrl();
  }
});
urlInput.addEventListener("focus", () => {
  urlInput.value = "";
  hideAutocomplete();
});
urlInput.addEventListener("blur", () => {
  urlInput.value = getWebviewUrl();
  hideAutocomplete();
});
webview.addEventListener("did-finish-load", () => {
  urlInput.value = getWebviewUrl();
  hideAutocomplete();
});

document.addEventListener("click", (event) => {
  if (!urlInput.contains(event.target)) {
    hideAutocomplete();
  }
});
