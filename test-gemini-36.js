const history = [{ role: 'assistant', content: 'Halo! Selamat datang di HIPMORA.' }];
const message = 'bagaimana cara jadi tenant';
const SYSTEM_PROMPT = 'Kamu adalah HIPMORA Assistant';
const formattedContents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
formattedContents.push({ role: 'user', parts: [{ text: message }] });
if (formattedContents.length > 0) {
    formattedContents[0].parts[0].text = SYSTEM_PROMPT + '\n\n' + formattedContents[0].parts[0].text;
}
const apiKey = 'AIzaSyCAqSgGZBnudc7r4DEra6rhLtds3P4proo';
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + apiKey, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: formattedContents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
  })
}).then(res => res.json()).then(console.log).catch(console.error);
