const loginname = 'admin'
const loginpass = 'admin'

const request = new XMLHttpRequest();

request.onreadystatechange = function() {
    console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            const response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            const json = JSON.parse(request.responseText);
            if (json.reason === "no_db_file") {
                createDB();
            } else {
                const url = request.responseURL
                const i = url.lastIndexOf("/", url.length - 1);
                const name = url.substring(i + 1);
                handlers[name]({ "_id" : name });
            }
        }
    }
};

function set(name) {
    console.log("set::name = " + name);
    console.log("set::GET = " + dburl + name);
    request.open("GET", dburl + name, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
	request.withCredentials = true;
    request.send();
}

function put(response, message) {
    console.log("put::response = " + response);
    console.log("put::message = " + message);
    request.open("PUT", dburl + response._id, true);
    request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    message["_id"] = response._id;
    if (response._rev) {
        message["_rev"] = response._rev;
    }
    const s = JSON.stringify(message);
    console.log("put: " + s);
    request.send(s);
}

function createDB() {
    request.open("PUT", dburl, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

///////////////////////////////////////////////////////////////////////////////

const dbname = "mensa_sphere";
const dburl = "http://127.0.0.1:5984/" + dbname + "/";
const handlers = {
    "showSplitView" : setView,
};


function setView(response){
    const checked = document.getElementById("showSplitView").checked;
    console.log(checked);
    put(response, {"checked" : checked})
}
