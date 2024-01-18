document.addEventListener('DOMContentLoaded', () => {
    let originalData; // Variable to store the original data
    const table = document.getElementById('csv-table');
    const commandField = document.getElementById('command-field');

// Fetch data from the server
fetch('/data.csv')
    .then(response => response.text())
    .then(data => {
        originalData = data; // Store the original data
        const rows = data.split('\n');
        let lowerBounds, upperBounds;

        // Loop through the rows to gather lower and upper bounds
        rows.forEach((row, index) => {
            const columns = row.split(',');
            const subjId = columns[0].trim();

            if (subjId === 'low') {
                lowerBounds = columns.slice(1).map(Number);
            } else if (subjId === 'high') {
                upperBounds = columns.slice(1).map(Number);
            }
        });

        // Loop through the rows again to apply the yellow background
        rows.forEach((row, index) => {
            const columns = row.split(',');
            const subjId = columns[0].trim();

            // Skip rows with identifiers "low" and "high"
            if (subjId === 'low' || subjId === 'high') {
                return;
            }

            const tr = document.createElement('tr');

            columns.forEach((column, colIndex) => {
                const td = document.createElement('td');
                td.textContent = column;
                
                const cellValue = parseFloat(column.trim());
                if (!isNaN(cellValue) && lowerBounds && upperBounds) {
                    if (cellValue < lowerBounds[colIndex - 1]) {
                        td.style.backgroundColor = 'yellow'; // Cell value is lower than the lower bound
                    } else if (cellValue > upperBounds[colIndex - 1]) {
                        td.style.backgroundColor = 'yellow'; // Cell value is higher than the lower bound
                    }
                }

                tr.appendChild(td);


			    if (colIndex === columns.length - 1) {
			        const selectForm = document.createElement('select');
			        const options = ['good', 'rerun', 'bad']; // MODIFY if You need custom qc labels

			        options.forEach(option => {
			            const optionElement = document.createElement('option');
			            optionElement.value = option;
			            optionElement.textContent = option;
			            if (option === column) {
			                optionElement.selected = true; // Set the selected option based on cell value
			            }
			            selectForm.appendChild(optionElement);
			        });

			        td.appendChild(selectForm);

					selectForm.addEventListener('change', function () {
					    const selectedValue = this.value;
					    if (selectedValue !== columns[colIndex]) {
					        tr.style.backgroundColor = selectedValue === 'bad' || selectedValue === 'rerun' ? 'red' : '';
					        columns[colIndex] = selectedValue;
					    }
					});
			    }
			});

            const imgTd = document.createElement('td');
            const img = document.createElement('img');
            img.src = `imgs/${subjId}.jpg`; // Assuming images are named as subjId.jpg
            img.classList.add('thumbnail'); // Optional: Add a CSS class for styling images
            imgTd.appendChild(img);
            tr.appendChild(imgTd);

            const commandButton = document.createElement('button');
            commandButton.textContent = 'Run Command';
            commandButton.addEventListener('click', () => {
                const customCommand = commandField.value.replace(/\$subj/g, subjId);
                executeCommand(customCommand);
            });

            const commandTd = document.createElement('td');
            commandTd.appendChild(commandButton);
            tr.appendChild(commandTd);

            table.appendChild(tr);
        });
    })
    .catch(error => console.error('Error:', error));

    function executeCommand(command) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `cgi-bin/launch_cmd.sh?${command}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.responseText);
            } else {
                console.error('Request failed with status:', xhr.status);
            }
        };
        xhr.onerror = function () {
            console.error('Request failed');
        };
        xhr.send();
    }

	const saveButton = document.getElementById('save-button');
	saveButton.textContent = 'Save CSV';
	saveButton.addEventListener('click', () => {
	    const modifiedData = [...table.querySelectorAll('tr')].map(row => {
	        const cells = Array.from(row.querySelectorAll('td')).slice(0, -2); // Exclude the last two columns
	        const rowData = Array.from(cells).map(cell => {
	            const select = cell.querySelector('select');
	            if (select) {
	                return select.value;
	            } else if (cell.querySelector('input[type=checkbox]')) {
	                return cell.querySelector('input[type=checkbox]').checked ? '1' : '0';
	            }
	            return cell.textContent;
	        }).join(',');
	        return rowData;
	    }).join('\n');

	    // Create a Blob and download it as a CSV file
	    const blob = new Blob([modifiedData], { type: 'text/csv' });
	    const url = window.URL.createObjectURL(blob);
	    const a = document.createElement('a');
	    a.href = url;
	    a.download = 'modified_data.csv';
	    a.click();
	    window.URL.revokeObjectURL(url);
    });

});
