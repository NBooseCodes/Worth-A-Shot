// Get the objects we need to modify
let updateEmployeeForm = document.getElementById('update-employee-form');

// Modify the objects we need
updateEmployeeForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();
    // Get form fields we need to get data from
    let inputEmployeeID = document.getElementById("employeeMySelect");
    let inputEmployeeRole = document.getElementById("employee-role");

    // Get the values from the form fields
    let employeeIDValue = inputEmployeeID.value;
    let employeeRoleValue = inputEmployeeRole.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        employeeID: employeeIDValue,
        employeeRole: employeeRoleValue
    }
    
    // AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-employee-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // resolution
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            console.log("Hit http")
            updateRow(xhttp.response, employeeIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, employeeID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("employee-table");
    console.log(data)
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == employeeID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[4];
            td.innerHTML = parsedData[0].employeeRole;
       }
    }
}