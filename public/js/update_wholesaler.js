// Citation for the following function
// Date: 5/30/2024
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

let updateWholesalerForm = document.getElementById('update-wholesaler-form');

updateWholesalerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields we need to get data from
    let inputWholesalerID = document.getElementById("mySelect");
    let inputAddress = document.getElementById("input-address");
    let inputEmail = document.getElementById("input-email");
    let inputPhone = document.getElementById("input-phone");
    let inputContactName = document.getElementById("input-contactName");


    let wholesalerIDValue = inputWholesalerID.value;
    let addressValue = inputAddress.value;
    let emailValue = inputEmail.value;
    let phoneValue = inputPhone.value;
    let contactNameValue = inputContactName.value;

    let data = {
        wholesalerID:wholesalerIDValue,
        address: addressValue,
        email: emailValue,
        phone: phoneValue,
        contactName: contactNameValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-wholesaler-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log("you're in update wholesaler .js");
            updateRow(xhttp.response, wholesalerIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, wholesalerID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("wholesaler-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == wholesalerID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].wholesalerID;
            location.reload()
       }
    }
}
