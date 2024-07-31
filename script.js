// define process file button and events to listen for
document.getElementById("processButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const tagNameInput = document.getElementById("tagName");
  const file = fileInput.files[0];
  const tagName = tagNameInput.value.trim();

  // alert for no file
  if (!file) {
    alert("Please select an XML file.");
    return;
  }

  // alert if no element tag name is specified
  if (!tagName) {
    alert("Please enter a tag name.");
    return;
  }

  // create new FileReader
  const reader = new FileReader();
  reader.onload = function (event) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(event.target.result, "text/xml");

    // find all elements with the specified tag name
    const elements = xmlDoc.getElementsByTagName(tagName);

    // extract text content of all elements with the specified tag name creating new
    const textContent = Array.from(elements)
      .map((el) => el.textContent.trim())
      .join("\n");

    // create a new Blob and trigger a download
    const blob = new Blob([textContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tagName}.txt`;
    link.click();
  };

  // new file reader, read the file as text
  reader.readAsText(file);
});
