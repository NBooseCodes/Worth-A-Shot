let updateAlcoholForm = document.getElementById('update-alcohol-form');

updateAlcoholForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let inputAlcoholName = document.getElementById("mySelect");
    let inputAlcoholType = document.getElementById("input-alcohol-type-update");

    let alcoholNameValue = inputAlcoholName.ariaValueMax;
    let alcoholTypeValue = inputAlcoholType.ariaValueMax;

    let data = {
        alcoholName: alcoholNameValue,
        alcoholType: alcoholTypeValue
    }

    var xhttp = new XMLHttpRequest();

    xhttp.open("PUT", "/put-alcohol", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, alcoholNameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, alcoholID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("alcohol-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == alcoholID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[2];

            td.innerHTML = parsedData[0].name;
        }
    }
}

