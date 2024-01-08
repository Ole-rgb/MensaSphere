const loginname = 'admin'
const loginpass = 'admin'

const request = new XMLHttpRequest();

request.onreadystatechange = function() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            console.log("not found: " + request.responseText);
        }
    }
};

function get(variable) {
    request.open("GET", dburl + variable, false);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

function update() {
    for (var name in handlers) {
        // console.log("updating " + name);
        get(name);
    }
}

// request updates at a fixed interval (ms)
const intervalID = setInterval(update, 1000);

///////////////////////////////////////////////////////////////////////////////
// your code below

const dbname = "mensa_sphere";
const dburl = "http://127.0.0.1:5984/" + dbname + "/";
const handlers = {
    // add further handlers here
    "showSplitView" : updateView,
};

var showSplitView;

function updateView(response) {
    let tmp = showSplitView;
    showSplitView = response.checked;

    tmp != showSplitView ? toggleContainer(showSplitView) : null; 
}


function toggleContainer(showSplitView) {

    var right = document.getElementById("rightSide");
    const elements = document.querySelectorAll('.conter-container');
    if(showSplitView){
        //display the split view
        right.style.display = "";
        elements.forEach(element => {
            element.style.width = '40vw'; // Set the desired width value
        });
      //left.sytle.width = "50vw"; 
    } else {
        //display the single user view
        right.style.display = "none";
        elements.forEach(element => {
            element.style.width = '80vw'; // Set the desired width value
        });
     // left.sytle.width = "100vw"; 
    }

  }

  function toggleCardView(id){
    var card = document.getElementById(id);
    var nutData = card.getElementsByClassName("nut-data")[0];
    var arrow = card.getElementsByClassName("expand-arrow")[0];
    console.log(nutData.style.display)
    if(nutData.style.display === "initial"){
        //collapse
        card.style.width = "250px";
        nutData.style.display = "none";
        arrow.textContent = "\u276F";
    }
    else{
        //expand
        card.style.width = "500px";
        nutData.style.display = "initial";
        arrow.textContent = "\u276E";
    }
}