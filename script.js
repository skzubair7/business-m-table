
        let tableCount = 0;
        let tableHistory = JSON.parse(localStorage.getItem("tableHistory")) || [];

        function createNewTable(resumeData = null)
         {
            tableCount++;
            const tableContainer = document.createElement('div');
            tableContainer.classList.add('table-container');
            tableContainer.id = `tableContainer${tableCount}`;
            tableContainer.innerHTML = `
                <h2>Table ${tableCount}</h2>
                <button class="btn" onclick="addItem(${tableCount})">Add Item</button>
                <button class="bt" onclick="showResult(${tableCount})">Result</button>
                <div id="output${tableCount}"></div>
                <table id="table${tableCount}">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Name</th>
                            <th>Price (Rs)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>`;
            document.getElementById('tablesContainer').appendChild(tableContainer);

            window[`names${tableCount}`] = resumeData?.names || [];
            window[`prices${tableCount}`] = resumeData?.prices || [];

            if (resumeData) {
                resumeData.names.forEach((name, index) => {
                    addToTable(name, resumeData.prices[index], tableCount);
                });
            }
        }


        function addItem(tableId)
         {
            let name = prompt("Enter the name of the item:");
            if (!name) return alert("Name cannot be empty!");

            let price = parseFloat(prompt(`Enter the price for ${name}:`));
            if (isNaN(price) || price <= 0) return alert("Please enter a valid price!");

            window[`names${tableId}`].push(name);
            window[`prices${tableId}`].push(price);
            addToTable(name, price, tableId);
            saveHistory(tableId);
        }

        function addToTable(name, price, tableId)
         {
            const table = document.getElementById(`table${tableId}`).getElementsByTagName('tbody')[0];
            const newRow = table.insertRow();

            const cell0 = newRow.insertCell(0);
            const cell1 = newRow.insertCell(1);
            const cell2 = newRow.insertCell(2);
            const cell3 = newRow.insertCell(3);

            cell0.textContent = table.rows.length;
            cell1.textContent = name;
            cell2.textContent = price.toFixed(2);
            cell3.innerHTML = `<button class="action-btn" onclick="editItem(${newRow.rowIndex - 1}, ${tableId})">Edit</button>
         <button class="action-btn" onclick="deleteItem(${newRow.rowIndex - 1}, ${tableId})">Delete</button>
            `;
        }

        function editItem(index, tableId) 
        {
            const names = window[`names${tableId}`];
            const prices = window[`prices${tableId}`];

            let newName = prompt("Enter the new name:", names[index]);
            if (!newName) return alert("Name cannot be empty!");

            let newPrice = parseFloat(prompt("Enter the new price:", prices[index]));
            if (isNaN(newPrice) || newPrice <= 0) return alert("Please enter a valid price!");

            names[index] = newName;
            prices[index] = newPrice;

            const table = document.getElementById(`table${tableId}`).getElementsByTagName('tbody')[0];
            const row = table.rows[index];
            row.cells[1].textContent = newName;
            row.cells[2].textContent = newPrice.toFixed(2);

            saveHistory(tableId);
        }

        function deleteItem(index, tableId)
         {
            const names = window[`names${tableId}`];
            const prices = window[`prices${tableId}`];

            if (!confirm("Are you sure you want to delete this item?"))
                 return;

            names.splice(index, 1);
            prices.splice(index, 1);

            const table = document.getElementById(`table${tableId}`).getElementsByTagName('tbody')[0];
            table.deleteRow(index);

            for (let i = 0; i < table.rows.length; i++) 
                {
                table.rows[i].cells[0].textContent = i + 1;
                table.rows[i].cells[3].innerHTML = `
                    <button class="action-btn" onclick="editItem(${i}, ${tableId})">Edit</button>
                    <button class="action-btn" onclick="deleteItem(${i}, ${tableId})">Delete</button>
                `;
               }
            saveHistory(tableId);
        }

        function showResult(tableId) 
        {
            const prices = window[`prices${tableId}`];

            if (prices.length === 0) return alert("No items added!");

            const sumExpression = prices.join(" + ");
            const totalSum = prices.reduce((acc, val) => acc + val, 0);

            const outputDiv = document.getElementById(`output${tableId}`);
            outputDiv.innerHTML = `
                <p>${sumExpression} = ${totalSum.toFixed(2)}</p>
                <p>Total Sum: Rs ${totalSum.toFixed(2)}</p>
            `;
        }

        function saveHistory(tableId)
         {
            const names = window[`names${tableId}`];
            const prices = window[`prices${tableId}`];
            const timestamp = new Date().toLocaleString();

            const historyEntry = {
                tableId,
                names,
                prices,
                timestamp,
            };
            
             let d=document.querySelector("#show");
    

            const existingEntryIndex = tableHistory.findIndex((entry) => entry.tableId === tableId);
            if (existingEntryIndex > -1)
                 {
                tableHistory[existingEntryIndex] = historyEntry;
            }
             else 
             {
                tableHistory.push(historyEntry);
            }

            localStorage.setItem("tableHistory", JSON.stringify(tableHistory));
        }

        function openHistory() 
        {
            const historyList = document.getElementById("historyList");
            historyList.innerHTML = "";

            tableHistory.forEach((entry) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    Table ${entry.tableId} - Last Updated: ${entry.timestamp}
                    <button onclick="resumeTable(${entry.tableId})">Resume</button>
                `;
                historyList.appendChild(li);
            });

            document.getElementById("historyModal").style.display = "block";
        }

        function closeHistory()
         {
            document.getElementById("historyModal").style.display = "none";
        }

        function resumeTable(tableId) 
        {
            const resumeData = tableHistory.find((entry) => entry.tableId === tableId);
            if (resumeData)
                 {
                createNewTable(resumeData);
                closeHistory();
            }
        }