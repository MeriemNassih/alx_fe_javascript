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

  // Restore last selected category
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  categoryFilter.value = lastSelectedCategory;
}

// Function to display quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem('lastSelectedCategory', selectedCategory); // Save selected category to local storage

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

// Function to show a random quote from the quotes array
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length); // Use Math.random to get a random quote
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = `<p><strong>${randomQuote.category}</strong>: "${randomQuote.text}"</p>`;
}

async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };

      // Save quote locally first
      quotes.push(newQuote);
      saveQuotes();

      // POST to mock API
      try {
          const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(newQuote)
          });

          if (!response.ok) {
              throw new Error("Network response was not ok");
          }

          alert("Quote added successfully!");
          document.getElementById("newQuoteText").value = "";
          document.getElementById("newQuoteCategory").value = "";
          populateCategories(); // Update categories in dropdown
          showRandomQuote(); // Optionally display the new quote
      } catch (error) {
          console.error("Error posting quote:", error);
          alert("Failed to add quote to server.");
      }
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

async function syncQuotes() {
  try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) throw new Error("Network response was not ok");

      const serverQuotes = await response.json();

      // Notify user about updates
      showNotification("Quotes synced with server!"); // Updated notification

      // Simple conflict resolution: overwrite local quotes with server quotes
      quotes = serverQuotes.map(quote => ({
          text: quote.body,
          category: "General" // Set a default category for the example
      }));

      saveQuotes(); // Update local storage with new quotes
      displayQuotes(quotes); // Refresh displayed quotes
  } catch (error) {
      console.error("Error fetching quotes:", error);
      showNotification("Failed to sync quotes from the server."); // Notify user on error
  }
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
setInterval(syncQuotes, 30000);

// Add event listeners
document.getElementById("addQuote").addEventListener("click", addQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes); // Add event listener for filter quotes

// Call functions to set up the application
loadQuotes();
populateCategories(); // Populate categories in dropdown on load
window.onload = () => {
  displayQuotes(quotes); // Display quotes on load
  filterQuotes(); // Ensure quotes are filtered based on the last selected category
};
