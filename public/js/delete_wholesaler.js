// Citation for the following function
// Date: 5/30/2024
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteWholesaler(wholesalerID) {
    const data = {id: wholesalerID}
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/delete-wholesaler/${wholesalerID}`, true);
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
