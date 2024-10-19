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

    // Save last selected category from local storage
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}

// Function to display quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    
    // Save selected category to local storage
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

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");

    quoteDisplay.innerHTML = `<p><strong>${quote.category}</strong>: "${quote.text}"</p>`;
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
        showRandomQuote(); // Optionally display the new quote
    } else {
        alert("Please enter both the quote and the category.");
    }
}

// Implement JSON Export
function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Implement JSON Import
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories(); // Update categories in dropdown after import
        showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Add event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call functions to set up the application
loadQuotes();
populateCategories(); // Populate categories in dropdown on load
window.onload = showRandomQuote; // Display a random quote on load
