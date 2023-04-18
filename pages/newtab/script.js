const searchInput = document.getElementById("search-input");
const searchSuggestions = document.getElementById("search-suggestions");
let selectedIndex = -1;

searchInput.addEventListener("input", () => {
	const query = searchInput.value;
	if (!query) {
		searchSuggestions.innerHTML = "";
		return;
	}
	fetch(
		`https://suggestqueries.google.com/complete/search?output=firefox&q=${query}`
	)
		.then((response) => response.json())
		.then((data) => {
			const suggestions = data[1];
			searchSuggestions.innerHTML = "";
			for (let i = 0; i < suggestions.length; i++) {
				const suggestion = document.createElement("li");
				suggestion.textContent = suggestions[i];
				searchSuggestions.appendChild(suggestion);
			}
			selectedIndex = -1;
		})
		.catch((error) => {
			console.error("Error fetching search suggestions", error);
			searchSuggestions.innerHTML = "";
		});
});

searchInput.addEventListener("keydown", (event) => {
	if (event.key === "ArrowUp") {
		event.preventDefault();
		if (selectedIndex > 0) {
			selectedIndex--;
		}
		highlightListItem();
	} else if (event.key === "ArrowDown") {
		event.preventDefault();
		if (selectedIndex < searchSuggestions.children.length - 1) {
			selectedIndex++;
		}
		highlightListItem();
	} else if (event.key === "Enter") {
		event.preventDefault();
		if (selectedIndex >= 0) {
			const selectedSuggestion = searchSuggestions.children[selectedIndex];
			searchInput.value = selectedSuggestion.textContent;
			searchSuggestions.innerHTML = "";
			selectedIndex = -1;
			// Perform Google search
			window.location.href = `https://www.google.com/search?q=${selectedSuggestion.textContent}`;
		} else {
			// Perform Google search with input value
			window.location.href = `https://www.google.com/search?q=${searchInput.value}`;
		}
	} else if (event.key === "Escape") {
		searchSuggestions.innerHTML = "";
		selectedIndex = -1;
	}
});

function highlightListItem() {
	for (let i = 0; i < searchSuggestions.children.length; i++) {
		const listItem = searchSuggestions.children[i];
		if (i === selectedIndex) {
			listItem.classList.add("selected");
		} else {
			listItem.classList.remove("selected");
		}
	}
}
