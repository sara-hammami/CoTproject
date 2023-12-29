async function getUser() {
    const accessToken = await secureStorage.readSecureData("accessToken");
    console.log(accessToken);

    const foo = accessToken.split('.')[1];
    const res = new Uint8Array([...atob(base64.normalize(foo))].map(char => char.charCodeAt(0)));
    const decoded = JSON.parse(new TextDecoder().decode(res));
    console.log('decoded:', decoded);

    const mail = decoded.sub;

    const url = 'https://samrwastemanagement.ltn:8443/api/profile/' + mail;
    console.log(url);

    const request = {
        method: 'GET',
        path: '/',
        contentType: 'application/json',
        headers: { "Authorization": `Bearer ${accessToken}` },
    };

    return dio.request(url, {
        method: request.method,
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": request.contentType
        }
    }).then((value) => {
        const data = value.data;
        console.log('data:', data);

        const user = {
            name: data.fullname,
            email: mail
        };

        // Update HTML content
        document.getElementById('username').innerText = user.name;
        document.getElementById('useremail').innerText = user.email;

        // You can use the 'user' object as needed

        return user;
    });
}
