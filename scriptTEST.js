
document.getElementById("processButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];


  if (!file) {
    alert("Please select an XML file.");
    return;
  }


  const reader = new FileReader();
  reader.onload = function (event) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(event.target.result, "text/xml");

    const cards = xmlDoc.getElementsByTagName("card");

    const resultLines = Array.from(cards).map(card => {
      const nameElement = card.getElementsByTagName("name")[0];
      const queryElement = card.getElementsByTagName("query")[0];

      if (nameElement && queryElement) {
        let name = nameElement.textContent.trim();
        const query = queryElement.textContent.trim().toLowerCase();

        name = name.split(/[\(\.]/)[0].trim();


        const specialCharacters = [",", "'", "-"];


        let result = name;


        specialCharacters.forEach(char => {
          if (query.includes(char)) {

            if (!name.includes(char)) {
              result = result.replace(/([^\s]+)(\s|$)/g, `$1${char}$2`);
            }
          }
        });


        result = result.replace(/([^\s])[\.,-]+$/, "$1");

        return result;
      }


      return "";
    }).filter(line => line !== "").join("\n");

    const blob = new Blob([resultLines], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "processed_data.txt";
    link.click();
  };


  reader.readAsText(file);
});
