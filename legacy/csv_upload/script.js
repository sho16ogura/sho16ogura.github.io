function handleFile() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const contents = e.target.result;
            const lines = contents.split('\n');

            // Displaying each line of the CSV file
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            lines.forEach(line => {
                const paragraph = document.createElement('p');
                paragraph.textContent = line;
                outputDiv.appendChild(paragraph);
            });
        };

        reader.readAsText(file);
    } else {
        alert('Please select a file.');
    }
}
