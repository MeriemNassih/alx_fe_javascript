// Array of initial quotes with text and category
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Happiness" }
];

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

// Add an event listener to the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call the function to create the form for adding a new quote
createAddQuoteForm();

// Optionally call showRandomQuote to display a random quote when the page loads
window.onload = showRandomQuote;
