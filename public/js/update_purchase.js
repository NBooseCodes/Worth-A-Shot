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

    // Send req via AJAX

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-purchase-ajax", true);
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

function updateRow(data, purchaseID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("purchases-table");
    let j = 1;
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute(data-value) == purchaseID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let wholesalerTD = updateRowIndex.getElementsByTagName("td")[1];
            let employeeTD = updateRowIndex.getElementsByTagName("td")[2];
            wholesalerTD.innerHTML = parsedData[0].wholesaler;
            employeeTD.innerHTML = parsedData[0].employee;

        }
    }
}