// Change the axios request in your index.html from:
const response = await axios.post('/generate', {

    // To (assuming default XAMPP port):
    const response = await axios.post('http://localhost/ngram/generate', {