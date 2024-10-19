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

// Function to create and append the add quote form dynamically
function createAddQuoteForm() {
  const form = document.createElement("form");
  form.innerHTML = `
      <input type="text" id="newQuoteText" placeholder="Enter a new quote" required />
      <input type="text" id="newQuoteCategory" placeholder="Enter category" required />
      <button type="submit" id="addQuote">Add Quote</button>
  `;

  form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent page reload
      addQuote(); // Call the addQuote function
  });

  document.getElementById("quoteFormContainer").appendChild(form); // Append form to a container in the HTML
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

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // Format JSON with indentation
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json"; // Filename for the downloaded file
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up the URL object
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
      try {
          const importedQuotes = JSON.parse(e.target.result);
          if (Array.isArray(importedQuotes)) {
              quotes = importedQuotes;
              saveQuotes(); // Save imported quotes to local storage
              populateCategories(); // Update categories in dropdown
              displayQuotes(quotes); // Display imported quotes
              showNotification("Quotes imported successfully!"); // Notify user
          } else {
              showNotification("Invalid file format. Please upload a valid JSON file.");
          }
      } catch (error) {
          console.error("Error importing quotes:", error);
          showNotification("Failed to import quotes. Please check the file format.");
      }
  };
  reader.readAsText(file);
}

// Periodically check for new quotes from the server
setInterval(syncQuotes, 30000);

// Add event listeners
document.getElementById("showRandomQuote").addEventListener("click", showRandomQuote); // Event listener for showing random quote
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile); // Event listener for exporting quotes
document.getElementById("importQuotes").addEventListener("change", importFromJsonFile); // Event listener for importing quotes

// Call functions to set up the application
loadQuotes();
populateCategories(); // Populate categories in dropdown on load
createAddQuoteForm(); // Create and add the form for adding new quotes
window.onload = () => {
  displayQuotes(quotes); // Display quotes on load
  filterQuotes(); // Ensure quotes are filtered based on the last selected category
};
