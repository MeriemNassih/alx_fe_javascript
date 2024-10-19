// Array of initial quotes with text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Happiness" }
];

// Load existing quotes from local storage on initialization
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate the category filter dropdown dynamically
function populateCategories() {
  const categorySet = new Set(quotes.map(quote => quote.category));
  const categoryFilter = document.getElementById("categoryFilter");

  categorySet.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });

  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  categoryFilter.value = lastSelectedCategory;
}

// Function to display quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem('lastSelectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
}

// Display quotes in the specified element
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear current display

  if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
  } else {
      filteredQuotes.forEach(quote => {
          quoteDisplay.innerHTML += `<p><strong>${quote.category}</strong>: "${quote.text}"</p>`;
      });
  }
}

// Function to add a new quote to the array
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      alert("Quote added successfully!");
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      populateCategories(); // Update categories in dropdown
      displayQuotes(quotes); // Update displayed quotes
  } else {
      alert("Please enter both the quote and the category.");
  }
}

// Simulated server fetch function
async function fetchQuotesFromServer() {
  // Simulate fetching data from a mock API
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Fetched" // or use another field to categorize
  }));
}

// Synchronize quotes with the server
async function syncQuotes() {
  const newQuotes = await fetchQuotesFromServer();
  const updatedQuotes = [];

  // Check for conflicts and update local quotes
  newQuotes.forEach(newQuote => {
      const existingQuote = quotes.find(q => q.text === newQuote.text);
      if (!existingQuote) {
          updatedQuotes.push(newQuote);
      } else {
          // Conflict resolution: keeping the server's data
          updatedQuotes.push(newQuote);
          showNotification(`Conflict resolved for: "${newQuote.text}"`);
      }
  });

  // Update local quotes
  quotes = [...quotes, ...updatedQuotes];
  saveQuotes();
  displayQuotes(quotes);
}

// Show notifications for updates or conflicts
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  setTimeout(() => {
      notification.textContent = "";
  }, 3000);
}

// Periodically check for new quotes from the server
setInterval(syncQuotes, 10000); // Check every 10 seconds

// Add event listeners
document.getElementById("addQuote").addEventListener("click", addQuote);

// Call functions to set up the application
loadQuotes();
populateCategories(); // Populate categories in dropdown on load
window.onload = () => displayQuotes(quotes); // Display quotes on load
