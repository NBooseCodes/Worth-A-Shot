// Citation for the following function
// Date: 5/30/2024
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteAlcoholPurchase(alcoholPurchaseID) {
    const data = {id: alcoholPurchaseID}
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/delete-alcohol-purchase/${alcoholPurchaseID}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            location.reload()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
  }