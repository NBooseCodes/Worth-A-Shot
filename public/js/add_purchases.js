// Get the objects we need to modify
let addPurchaseForm = document.getElementById('add-purchase-form');

// Modify the objects we need
addPurchaseForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let wholesalerID = document.getElementsByName("wholesalerID");
    let employeeID = document.getElementsByName("employeeID");
    let paid = document.getElementById("paid");
    let deliveryDate = document.getElementById("deliveryDate");
    let delivered = document.getElementById("delivered");
    let inventory = document.getElementById("inventory");

    // Get the values from the form fields
    let wholesalerIDValue = wholesalerID.value;
    let employeeIDValue = employeeID.value;
    let paidValue = paid.value;
    let deliveryDateValue = deliveryDate.value;
    let deliveredValue = delivered.value;
    let inventoryValue = inventory.value;

    // Put our data we want to send in a javascript object
    let data = {
        wholesalerID: wholesalerIDValue,
        employeeID: employeeIDValue,
        paid: paidValue,
        deliveryDate: deliveryDateValue,
        delivered: deliveredValue,
        inventory: inventoryValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-purchase-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            wholesalerID.value = '';
            employeeID.value = '';
            paid.value = '';
            deliveryDate.value = '';
            delivered.value = '';
            inventory.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("purchases-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let wholesalerIDCell = document.createElement("TD");
    let employeeIDCell = document.createElement("TD");
    let paidCell = document.createElement("TD");
    let deliveryDateCell = document.createElement("TD");
    let deliveredCell = document.createElement("TD");
    let inventoryCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.purchaseID;
    wholesalerIDCell.innerText = newRow.wholesalerID;
    employeeIDCell.innerText = newRow.employeeID;
    paidCell.innerText = newRow.paid;
    deliveryDateCell.innerText = newRow.deliveryDate;
    deliveredCell.innerText = newRow.wholesalePrice;
    inventoryCell.innerText = newRow.inventory;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePurchase(newRow.purchaseID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(wholesalerIDCell);
    row.appendChild(employeeIDCell);
    row.appendChild(paidCell);
    row.appendChild(deliveryDateCell);
    row.appendChild(deliveredCell);
    row.appendChild(inventoryCell);
    
    row.setAttribute('data-value', newRow.purchaseID);
    // Add the row to the table
    currentTable.appendChild(row);
}