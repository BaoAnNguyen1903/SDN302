const axios = require('axios');

axios.get('http://127.0.0.1:3000')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    });
