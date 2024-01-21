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

function set(name) {
    console.log("set::name = " + name);
    console.log("set::GET = " + dburl + name);
    request.open("GET", dburl + name, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
	request.withCredentials = true;
    request.send();
}

function toggleContainer(showSplitView) {

    var right = document.getElementById("rightSide");
    const elements = document.querySelectorAll('.conter-container');
    const timerContainer = document.getElementById("timer-container");
    if(showSplitView){
        //display the split view
        right.style.display = "";
        elements.forEach(element => {
            element.style.width = '40vw'; // Set the desired width value
        });

        // start timer
        timeInSeconds = 10;
        timerInterval = setInterval(updateTimerBar, 1000);

        timerContainer.style.display = "flex";
    } else {
        //display the single user view
        right.style.display = "none";
        elements.forEach(element => {
            element.style.width = '80vw'; // Set the desired width value
        });
        
        timerContainer.style.display = "none";
        clearInterval(timerInterval);
    }

  }

  function toggleCardView(id){
    var card = document.getElementById(id);
    var nutData = card.getElementsByClassName("nut-data")[0];
    var arrow = card.getElementsByClassName("expand-arrow")[0];
    console.log(nutData.style.display)
    if(nutData.style.display === "flex"){
        //collapse
        card.style.width = "250px";
        card.style.minWidth = "250px";
        nutData.style.display = "none";
        arrow.textContent = "\u276F";
    }
    else{
        //expand
        card.style.width = "600px";
        card.style.minWidth = "600px";
        nutData.style.display = "flex";
        arrow.textContent = "\u276E";
    }
}
