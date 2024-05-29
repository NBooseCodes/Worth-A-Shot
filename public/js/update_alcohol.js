// get obejcts to modify
let updateAlcoholForm = document.getElementById('update-alcohol-form-ajax');

// modify objects
updateAlcoholForm.addEventListener("submit", function(e) {
    // stops form from submitting
    e.preventDefault();
    // gets fields we need data from
    let inputAlcoholName = document.getElementById("mySelect");
    let inputAlcoholType = document.getElementById("input-alcohol-type-update");

    let alcoholNameValue = inputAlcoholName.value;
    let alcoholTypeValue = inputAlcoholType.value;
    console.log(alcoholNameValue);
    console.log(alcoholTypeValue);
    let data = {
        alcoholName: alcoholNameValue,
        alcoholType: alcoholTypeValue
    }

    // ajax request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-alcohol-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, alcoholNameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // send request
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, alcoholID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("alcohol-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == alcoholID) {
            console.log(table.rows[i].getAttribute("data-value"));
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[2];

            td.innerHTML = parsedData[0].alcoholName;
        }
    }
}

