// Elsa Luthi and Nicole Boose
// OSU CS 340 Spring 2024

// Citation for starter code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Date: 5/24/2024

// get obejcts to modify
let updateAlcoholPurchaseForm = document.getElementById('update-alcohol-purchase-form-ajax');

// modify objects
updateAlcoholPurchaseForm.addEventListener("submit", function(e) {
    console.log("at update alcoholPurchases")
    // stops form from submitting
    e.preventDefault();
    // gets fields we need data from
    let inputAlcoholPurchaseID = document.getElementById("alcohol-purchase-id-select");
    let inputAlcoholID = document.getElementById("input-alcohol-id-update");

    let alcoholPurchaseIDValue = inputAlcoholPurchaseID.value; // this is alcoholID assoc w/alcoholName
    let alcoholIDValue = inputAlcoholID.value;


    let data = {
        alcoholPurchaseID: alcoholPurchaseIDValue,
        alcoholID: alcoholIDValue
    }


    // ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-alcohol-purchase-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRowAlcoholPurchase(xhttp.response, alcoholPurchaseIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // send request
    xhttp.send(JSON.stringify(data));
})

function updateRowAlcoholPurchase(data, alcoholPurchaseID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("alcohol-purchases-table");

    console.log(parsedData);
    for (let i = 0; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == alcoholPurchaseID) {
            // Get elements of table
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let purchaseTD = updateRowIndex.getElementsByTagName("td")[1];
            let alcoholTD = updateRowIndex.getElementsByTagName("td")[2];
            let quantityTD = updateRowIndex.getElementsByTagName("td")[3];

            // Change the elements' HTML display to reflect the values in the database
            alcoholTD.innerHTML = parsedData[0].alcoholID;
            quantityTD.innerHTML = parsedData[0].quantity;
            location.reload();

        }
    }
}