const searchInput = document.getElementById("search");

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const query = this.value.trim();
    if (query !== "") {
      window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
    }
  }
});
