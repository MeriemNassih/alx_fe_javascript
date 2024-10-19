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

// Function to display a random quote
function showRandomQuote() {
  // Generate a random index based on the length of the quotes array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];  // Select the quote at the random index

  // Get the quote display element from the DOM
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Insert the quote and category into the DOM
  quoteDisplay.innerHTML = `<p><strong>${quote.category}</strong>: "${quote.text}"</p>`;
}

// Function to add a new quote to the array
function addQuote() {
  // Get the values from the input fields
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  // Check if both inputs are filled
  if (newQuoteText && newQuoteCategory) {
      // Add the new quote to the quotes array
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      
      // Save updated quotes to local storage
      saveQuotes();

      // Show a confirmation alert
      alert("Quote added successfully!");

      // Clear the input fields after adding the quote
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";

      // Optionally, display the newly added quote immediately
      showRandomQuote();
  } else {
      // Show an alert if inputs are missing
      alert("Please enter both the quote and the category.");
  }
}

// Function to create the form for adding a new quote
function createAddQuoteForm() {
  // Create a form element
  const form = document.createElement("form");

  // Create input for new quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";
  form.appendChild(quoteInput);

  // Create input for new quote category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  form.appendChild(categoryInput);

  // Create a button to submit the new quote
  const submitButton = document.createElement("button");
  submitButton.type = "button"; // Prevent form submission
  submitButton.id = "addQuoteButton";
  submitButton.textContent = "Add Quote";
  form.appendChild(submitButton);

  // Append the form to the DOM (you can choose where to append it)
  const formContainer = document.getElementById("formContainer"); // Ensure you have this element in your HTML
  formContainer.appendChild(form);

  // Add an event listener to the button to add a new quote
  submitButton.addEventListener("click", addQuote);
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
      showRandomQuote(); // Optionally display a new random quote after import
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add an event listener to the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call the function to create the form for adding a new quote
createAddQuoteForm();

// Load quotes from local storage when the page is initialized
loadQuotes();

// Add JSON import input and export button to the DOM
document.body.innerHTML += `
  <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  <button onclick="exportToJson()">Export Quotes as JSON</button>
`;

// Optionally call showRandomQuote to display a random quote when the page loads
window.onload = showRandomQuote;
