const apiKey = 'AIzaSyCAqSgGZBnudc7r4DEra6rhLtds3P4proo';
const SYSTEM_PROMPT = 'Kamu adalah HIPMORA Assistant';
const formattedContents = [{ role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nhi' }] }];
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: formattedContents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
  })
}).then(res => res.json()).then(console.log).catch(console.error);
