let dataValues;
let authIsToggled = false;
const authBlock = document.getElementById('authBlock');
authBlock.style.display = 'none';

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

const requestNoToken = (url, callback) => {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        callback(data);
    })
    .catch(error => console.error(error))
}

function doLogin() {
    const loginUrl = document.getElementById('loginUrl').value;
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    request(loginUrl, `POST`, '', {
        'username': username,
        'password': password
    }, (res) => {
        if (res.token) {
            const token = res.token;
            localStorage.setItem('token', token);
        } else {
            alert('Not authenticated');
        }
    });
}

function toggleAuth() {
    if (document.getElementById('toggleAuth').checked) {
        authIsToggled = false;
        authBlock.style.display = 'none';
    } else {
        authIsToggled = true;
        authBlock.style.display = 'block';
    }
}

function doRequestData() {

    const requestUrl = document.getElementById('requestUrl').value;

    if (authIsToggled) {
        const token = localStorage.getItem('token');
        request(requestUrl, `GET`, token, '', (data) => {
            dataValues = data;
            doGenerateViewer();
        });
    } else {
        requestNoToken(requestUrl, (data) => {
            dataValues = data;
            doGenerateViewer();
        });
    }
}

function doGenerateViewer() {
    let columns = [];
    Object.keys(dataValues[0]).forEach(col => {
        columns.push({ title: col, field: col });
    });

    createViewer(`viewer-table`, dataValues, columns);
}

function createViewer(elementID, tabledata, columns) {
    //create Tabulator on DOM element with id 'example-table'
    var table = new Tabulator(`#${elementID}`, {
        data: tabledata, //assign data to table
        layout: 'fitDataFill', //fit columns to width of table (optional)
        columns: columns,
        pagination:'local',
        paginationSize:15,
    });
}
