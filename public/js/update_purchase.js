let updatePurchaseForm = document.getElementById('update-purchase-form');

updatePurchaseForm.addEventListener("submit", function(e) {
    console.log("Hello")
    e.preventDefault();
    let inputPurchaseID = document.getElementById("purchaseIDSelect");
    let inputWholesaler = document.getElementById("wholesalerUpdateSelect");
    let inputEmployee = document.getElementById("employeeUpdateSelect");
    let inputPaid = document.getElementById("paidUpdateSelect");
    let inputDeliveryDate = document.getElementById("deliveryDateUpdate");
    let inputDelivered = document.getElementById("deliveredUpdateSelect");

    let purchaseIDValue = inputPurchaseID.value;
    let wholesalerValue = inputWholesaler.value;
    let employeeValue = inputEmployee.value;
    let paidValue = inputPaid.value;    //This will be "0" or "1" so need to parseInt()
    let deliveryDateValue = inputDeliveryDate.value;
    let deliveredValue = inputDelivered.value; //This will be "0" or "1" so need to parseInt()

    let data = {
        purchaseID: purchaseIDValue,
        wholesaler: wholesalerValue,
        employee: employeeValue,
        paid: paidValue,
        deliveryDate: deliveryDateValue,
        delivered: deliveredValue
    }
    console.log(data);
    // Send req via AJAX

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-purchase-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updatePurchaseRow(xhttp.response, purchaseIDValue)
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("Error with input");
        }
    }
    xhttp.send(JSON.stringify(data));
})

function updatePurchaseRow(data, purchaseID) {
    let parsedData = JSON.parse(data);
    console.log(data);
    let table = document.getElementById("purchases-table");
    console.log(table.rows);
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == purchaseID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let wholesalerTD = updateRowIndex.getElementsByTagName("td")[1];
            let employeeTD = updateRowIndex.getElementsByTagName("td")[2];
            let paidTD = updateRowIndex.getElementsByTagName("td")[3];
            let deliveryTD = updateRowIndex.getElementsByTagName("td")[4];
            let deliveredTD = updateRowIndex.getElementsByTagName("td")[5];

            wholesalerTD.innerHTML = parsedData[0].wholesalerID;
            employeeTD.innerHTML = parsedData[0].employeeID;
            paidTD.innerHTML = parsedData[0].paid;
            deliveryTD.innerHTML = parsedData[0].deliveryDate;
            deliveredTD.innerHTML = parsedData[0].delivered;

        }
    }
}