// get obejcts to modify
let updateAlcoholForm = document.getElementById('update-alcohol-form-ajax');

// modify objects
updateAlcoholForm.addEventListener("submit", function(e) {
    // stops form from submitting
    e.preventDefault();
    // gets fields we need data from
    let inputAlcoholName = document.getElementById("mySelect");
    let inputAlcoholType = document.getElementById("input-alcohol-type-update");
    let inputAlcoholPercentage = document.getElementById("input-alcohol-percentage-update");
    let inputAlcoholPrice = document.getElementById("input-alcohol-price-update");
    let inputAlcoholVolume = document.getElementById("input-alcohol-volume-update");
    let inputInventory = document.getElementById("input-inventory-update");

    let alcoholNameValue = inputAlcoholName.value; // this is alcoholID assoc w/alcoholName
    let alcoholTypeValue = inputAlcoholType.value;
    let alcoholPercentageValue = inputAlcoholPercentage.value;
    let alcoholPriceValue = inputAlcoholPrice.value;
    let alcoholVolumeValue = inputAlcoholVolume.value;
    let inventoryValue = inputInventory.value;

    let data = {
        alcoholName: alcoholNameValue,
        alcoholType: alcoholTypeValue,
        alcoholPercentage: alcoholPercentageValue,
        alcoholPrice: alcoholPriceValue,
        alcoholVolume: alcoholVolumeValue,
        inventory: inventoryValue
    }
    console.log(data);

    // ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-alcohol-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRowAlcohol(xhttp.response, alcoholNameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // send request
    xhttp.send(JSON.stringify(data));
})

function updateRowAlcohol(data, alcoholID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("alcohol-table");

    console.log(parsedData);
    for (let i = 0; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == alcoholID) {
            // Get elements of table
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let alcoholTypeTD = updateRowIndex.getElementsByTagName("td")[2];
            let alcoholPercentageTD = updateRowIndex.getElementsByTagName("td")[3];
            let wholesalePriceTD = updateRowIndex.getElementsByTagName("td")[4];
            let alcoholVolumeTD = updateRowIndex.getElementsByTagName("td")[5];
            let inventoryTD = updateRowIndex.getElementsByTagName("td")[6];

            // Change the elements' HTML display to reflect the values in the database
            alcoholTypeTD.innerHTML = parsedData[0].alcoholType;
            alcoholPercentageTD.innerHTML = parsedData[0].alcoholPercentage;
            wholesalePriceTD.innerHTML = parsedData[0].wholesalePrice;
            alcoholVolumeTD.innerHTML = parsedData[0].alcoholVolume;
            inventoryTD.innerHTML = parsedData[0].inventory;
        }
    }
}

