// Array of initial quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Happiness" }
];

const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Simulated server URL

// Load existing quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate the category filter dropdown
function populateCategories() {
  const categorySet = new Set(quotes.map(quote => quote.category));
  const categoryFilter = document.getElementById("categoryFilter");

  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Clear existing options

  categorySet.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });

  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  categoryFilter.value = lastSelectedCategory;
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);

  displayQuotes(filteredQuotes);
}

// Display quotes in the UI
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
  } else {
      filteredQuotes.forEach(quote => {
          quoteDisplay.innerHTML += `<p><strong>${quote.category}</strong>: "${quote.text}"</p>`;
      });
  }
}

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `<p><strong>${quote.category}</strong>: "${quote.text}"</p>`;
}

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      alert("Quote added successfully!");
      populateCategories();
      showRandomQuote();
  } else {
      alert("Please enter both the quote and the category.");
  }
}

// Export quotes as JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      populateCategories();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Sync with the server (GET request)
async function syncWithServer() {
  try {
      const response = await fetch(serverUrl);
      const serverQuotes = await response.json();
      resolveConflicts(serverQuotes);
  } catch (error) {
      console.error("Error syncing with server:", error);
  }
}

// Resolve conflicts by giving priority to server data
function resolveConflicts(serverQuotes) {
  const newQuotes = serverQuotes.map(item => ({
      text: item.title,
      category: "Server" // Example category for server data
  }));

  quotes = newQuotes; // Server data takes precedence
  saveQuotes();
  alert("Data synced with server. Conflicts resolved.");
  populateCategories();
  filterQuotes();
}

// Periodic sync every 60 seconds
setInterval(syncWithServer, 60000);

// Initialize the application
loadQuotes();
populateCategories();
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
window.onload = showRandomQuote;
