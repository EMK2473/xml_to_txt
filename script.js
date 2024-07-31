document.getElementById("processButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const tagNameInput = document.getElementById("tagName");
  const file = fileInput.files[0];
  const tagName = tagNameInput.value.trim();

  if (!file) {
    alert("Please select an XML file.");
    return;
  }

  if (!tagName) {
    alert("Please enter a tag name.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(event.target.result, "text/xml");

    // Find all elements with the specified tag name
    const elements = xmlDoc.getElementsByTagName(tagName);

    // Extract text content of all elements with the specified tag name
    const textContent = Array.from(elements)
      .map((el) => el.textContent.trim())
      .join("\n");

    // Create a Blob and trigger a download
    const blob = new Blob([textContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tagName}.txt`;
    link.click();
  };

  reader.readAsText(file);
});
