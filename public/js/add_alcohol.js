// Get the objects we need to modify
let addAlcoholForm = document.getElementById('add-alcohol-form');

// Modify the objects we need
addAlcoholForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAlcoholName = document.getElementById("input-alcoholName");
    let inputAlcoholType = document.getElementById("input-alcoholType");
    let inputAlcoholPercentage = document.getElementById("input-alcoholPercentage");
    let inputWholesalePrice = document.getElementById("input-wholesalePrice");
    let inputAlcoholVolume = document.getElementById("input-alcoholVolume");
    let inputInventory = document.getElementById("input-inventory");

    // Get the values from the form fields
    let alcoholNameValue = inputAlcoholName.value;
    let alcoholTypeValue = inputAlcoholType.value;
    let alcoholPercentageValue = inputAlcoholPercentage.value;
    let wholesalePriceValue = inputWholesalePrice.value;
    let alcoholVolumeValue = inputAlcoholVolume.value;
    let inventoryValue = inputInventory.value;

    // Put our data we want to send in a javascript object
    let data = {
        alcoholName: alcoholNameValue,
        alcoholType: alcoholTypeValue,
        alcoholPercentage: alcoholPercentageValue,
        wholesalePrice: wholesalePriceValue,
        alcoholVolume: alcoholVolumeValue,
        inventory: inventoryValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-alcohol-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAlcoholName.value = '';
            inputAlcoholType.value = '';
            inputAlcoholPercentage.value = '';
            inputWholesalePrice.value = '';
            inputAlcoholVolume.value = '';
            inputInventory.value = '';
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
    let currentTable = document.getElementById("alcohol-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let alcoholNameCell = document.createElement("TD");
    let alcoholTypeCell = document.createElement("TD");
    let alcoholPercentageCell = document.createElement("TD");
    let wholesalePriceCell = document.createElement("TD");
    let alcoholVolumeCell = document.createElement("TD");
    let inventoryCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.alcoholID;
    alcoholNameCell.innerText = newRow.alcoholName;
    alcoholTypeCell.innerText = newRow.alcoholType;
    alcoholPercentageCell.innerText = newRow.alcoholPercentage;
    wholesalePriceCell.innerText = newRow.wholesalePrice;
    alcoholVolumeCell.innerText = newRow.alcoholVolume;
    inventoryCell.innerText = newRow.inventory;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAlcohol(newRow.alcoholID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(alcoholNameCell);
    row.appendChild(alcoholTypeCell);
    row.appendChild(alcoholPercentageCell);
    row.appendChild(wholesalePriceCell);
    row.appendChild(alcoholVolumeCell);
    row.appendChild(inventoryCell);
    
    row.setAttribute('data-value', newRow.alcoholID);
    // Add the row to the table
    currentTable.appendChild(row);
}