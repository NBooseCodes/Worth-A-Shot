// Elsa Luthi and Nicole Boose
// OSU CS 340 Spring 2024

// Citation for starter code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Date: 5/24/2024

function deletePurchase(purchaseID) {
    const data = {id: purchaseID}
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/delete-purchase/${purchaseID}`, true);
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
