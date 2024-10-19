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
    } else {
      // Show an alert if inputs are missing
      alert("Please enter both the quote and the category.");
    }
  }
  
  // Add an event listener to the "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  