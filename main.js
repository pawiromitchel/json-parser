let dataValues;

const request = (url, method, authKey = ``, body = ``, callback) => {
    const fetchHeaders = new Headers();
    fetchHeaders.append('Content-Type', 'application/json');
    fetchHeaders.append('Authorization', `key=${authKey}`);

    let options = {
        method: method,
        headers: fetchHeaders
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => console.error(error))
}

function doLogin() {
    const loginUrl = document.getElementById("loginUrl").value;
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    request(loginUrl, `POST`, '', {
        "username": username,
        "password": password
    }, (res) => {
        if (res.token) {
            const token = res.token;
            localStorage.setItem("token", token);
        } else {
            alert("Not authenticated");
        }
    });
}

function doRequestData() {
    const token = localStorage.getItem("token");
    const requestUrl = document.getElementById("requestUrl").value;
    request(requestUrl, `GET`, token, '', (users) => {
        dataValues = users;
    });
}

function doGenerateViewer() {
    let columns = [];
    Object.keys(dataValues[0]).forEach(col => {
        columns.push({ title: col, field: col });
    });

    createViewer(`viewer-table`, dataValues, columns);
}


function createViewer(elementID, tabledata, columns) {
    //create Tabulator on DOM element with id "example-table"
    var table = new Tabulator(`#${elementID}`, {
        height: 205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: tabledata, //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        columns: columns
    });
}
