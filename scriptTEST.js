// Define process file button and events to listen for
document.getElementById("processButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  // Alert for no file
  if (!file) {
    alert("Please select an XML file.");
    return;
  }

  // Create new FileReader
  const reader = new FileReader();
  reader.onload = function (event) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(event.target.result, "text/xml");

    // Find all <card> elements
    const cards = xmlDoc.getElementsByTagName("card");

    // Extract and process the data
    const resultLines = Array.from(cards).map(card => {
      const nameElement = card.getElementsByTagName("name")[0];
      const queryElement = card.getElementsByTagName("query")[0];

      if (nameElement && queryElement) {
        let name = nameElement.textContent.trim();
        const query = queryElement.textContent.trim().toLowerCase();

        // Trim the name to remove anything after '(' or '.'
        name = name.split(/[\(\.]/)[0].trim();

        // Define characters to check for
        const specialCharacters = [",", "'", "-"];

        // Process name to handle special characters
        let result = name;

        // Check for special characters in the query and add missing characters
        specialCharacters.forEach(char => {
          if (query.includes(char)) {
            // Check if the name already includes this special character
            if (!name.includes(char)) {
              result = result.replace(/([^\s]+)(\s|$)/g, `$1${char}$2`);
            }
          }
        });

        // Remove any leading or trailing punctuation
        result = result.replace(/([^\s])[\.,-]+$/, "$1");

        return result;
      }

      // Default to empty string if no matching condition
      return "";
    }).filter(line => line !== "").join("\n");

    // Create a new Blob and trigger a download
    const blob = new Blob([resultLines], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "processed_data.txt";
    link.click();
  };

  // Read the file as text
  reader.readAsText(file);
});
