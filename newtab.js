document.getElementById("search").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    window.location.href =
      "https://www.google.com/search?q=" + this.value;
  }
});
