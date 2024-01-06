function generateRandomString() {
    var array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
}

async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(str) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function pkceChallengeFromVerifier(v) {
    const hashed = await sha256(v);
    return base64urlencode(hashed);
}

function utf8_to_b64_updated(str) {
    return window.btoa(decodeURIComponent(encodeURIComponent(str)));
}

window.onload = start;

async function start() {
    var state = generateRandomString();
    var code_verifier = generateRandomString();
    var code_challenge = await pkceChallengeFromVerifier(code_verifier);

    console.log(state);
    console.log(code_verifier);
    localStorage.setItem("codeverif", code_verifier);
    console.log(code_challenge);

    var step = utf8_to_b64_updated(state + "#" + code_challenge);

    console.log(state + "#" + code_challenge);
    console.log(step);

    var step2 = "Bearer " + step;

    $.ajax({
        url: 'https://smarwastemanagement.ltn:8443/api/authorize',
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Pre-Authorization': step2
        },
        complete: function (data) {
            console.log('Load was performed.');
            console.log(data.responseJSON);
            localStorage.setItem("signInId", data.responseJSON.signInId);

            document.getElementById("myButton").onclick = function () {
                var signInId = localStorage.getItem("signInId");
                var mail = document.getElementById("emailInput").value;
                var password = document.getElementById("passwordInput").value;
                console.log(mail)
                let reqObj = {"mail": mail, "password": password, "signInId": signInId};

                $.ajax({
                    url: 'https://smarwastemanagement.ltn:8443/api/authenticate/',
                    type: 'POST',
                    data: JSON.stringify(reqObj),
                    dataType: 'json',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    success: function (data) {
                        console.log(data);
                        var code_verifier = localStorage.getItem("codeverif");
                        localStorage.setItem("mail", mail);
                        var access = "Bearer " + utf8_to_b64_updated(data.authCode + '#' + code_verifier);

                        $.ajax({
                            url: 'https://smarwastemanagement.ltn:8443/api/oauth/token',
                            type: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Post-Authorization': access
                            },
                            success: function (data) {
                                console.log(data);
                                // Store the access token using SecureStorage
                                localStorage.setItem("accesstoken", data.accessToken);


                                // Store the refresh token if needed
                                localStorage.setItem("refreshtoken",data.refreshToken);

                                // Remove the signInId
                                localStorage.removeItem("signInId");
                                console.log('ok');
                                location.href = "dashboard.html";
                            }
                        });

                    },
                    error: function (xhr, status, error) {
                        // Display an alert with the error message
                        alert("Error: " + xhr.responseText);
                    }
                });
            };
        }
    });
}
