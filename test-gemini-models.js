const apiKey = 'AIzaSyCAqSgGZBnudc7r4DEra6rhLtds3P4proo';
fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey)
.then(res => res.json()).then(data => console.log(data.models.map(m => m.name).join(', '))).catch(console.error);
