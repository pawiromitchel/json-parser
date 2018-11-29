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

function doGetUsers() {
    const token = localStorage.getItem("token");
    request('http://localhost:8000/user', `GET`, token, '', (users) => {
        console.log(users);
    });
}
