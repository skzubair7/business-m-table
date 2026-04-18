let currentTableId = null;
        let tableData = []; 
        let tableHistory = JSON.parse(localStorage.getItem("tableHistory")) || [];

          function startFresh() {
            document.getElementById('tablesContainer').innerHTML = ""; 
            currentTableId = Date.now(); // Unique ID for each table
            tableData = [];
            renderUI(currentTableId);
        }

        function renderUI(tableId) {
            const container = document.getElementById('tablesContainer');
            container.innerHTML = `
                <div class="table-container">
                    <h2></h2>
                    <button class="btn" onclick="addItem()">Add Item</button>
                    <button class="btn btn-history" onclick="showResult()">Total Result</button>
                    <div id="output"></div>
                    <table>
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Edit Delete</th>
                            </tr>
                        </thead>
                        <tbody id="tbody"></tbody>
                    </table>
                </div>`;
            renderRows();
        }

        function renderRows() {
            const tbody = document.getElementById('tbody');
            if(!tbody) return;
            
            tbody.innerHTML = "";
            tableData.forEach((item, index) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.price}</td>
                        <td>
                            <button class="action-btn" onclick="editItem(${item.id})">Edit</button>
                            <button class="action-btn" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>`;
            });
            saveToLocalStorage();
        }

        function addItem() {
            let name = prompt("Enter Item Name:");
            // Error Handling: Empty name check
            if (!name || name.trim() === "") return alert("Error: Name cannot be empty!");

            let priceInput = prompt("Enter Price:");
            let price = parseFloat(priceInput);
            // Error Handling: Valid number check
            if (isNaN(price) || price <= 0) return alert("Error: Please enter a valid money amount!");

            tableData.push({ id: Date.now(), name, price });
            renderRows();
        }

        // Edit using MAP
        function editItem(id) {
            let item = tableData.find(i => i.id === id);
            let newName = prompt("Edit Name:", item.name);
            let newPrice = parseFloat(prompt("Edit Price:", item.price));

            if (newName && !isNaN(newPrice)) {
                tableData = tableData.map(i => i.id === id ? { ...i, name: newName, price: newPrice } : i);
                renderRows();
            } else {
                alert("Invalid input! Changes not saved.");
            }
        }

        // Delete using FILTER
        function deleteItem(id) {
            if (confirm("Delete this item?")) {
                tableData = tableData.filter(i => i.id !== id);
                renderRows();
            }
        }

        function showResult() {
            const total = tableData.reduce((sum, i) => sum + i.price, 0);
            document.getElementById('output').innerHTML = `<h3>Total: ${total}</h3>`;
        }

        function saveToLocalStorage() {
            if (!currentTableId) return;
            const entry = { id: currentTableId, data: tableData, time: new Date().toLocaleString() };//save table as a object in storage
            const index = tableHistory.findIndex(h => h.id === currentTableId);
            
            if (index > -1) tableHistory[index] = entry;
            else tableHistory.push(entry);

            localStorage.setItem("tableHistory", JSON.stringify(tableHistory));
        }

        function openHistory() {
            const list = document.getElementById("historyList");
            list.innerHTML = "";
            tableHistory.forEach(h => {
                list.innerHTML += `<li>
                    ${h.time} 
                    <button onclick="resumeTable(${h.id})">Resume</button>
                </li>`;
            });
            document.getElementById("historyModal").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        }

        function closeHistory() {
            document.getElementById("historyModal").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }

        function resumeTable(id) {
            const record = tableHistory.find(h => h.id === id);
            if (record) {
                document.getElementById('tablesContainer').innerHTML = ""; 
                currentTableId = record.id;
                tableData = record.data;
                renderUI(currentTableId);
                closeHistory();
            }
        }

