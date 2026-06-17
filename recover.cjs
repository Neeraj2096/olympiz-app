const fs = require('fs');

const logPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fbb257df-d98a-4c2e-9094-bb319220ca3e\\.system_generated\\logs\\transcript.jsonl';
const log = fs.readFileSync(logPath, 'utf8');

const lines = log.split('\n');
let lastContent = null;

for (let line of lines) {
  if (!line.trim()) continue;
  try {
    const entry = JSON.parse(line);
    if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
      for (let call of entry.tool_calls) {
        if (call.name === 'write_to_file' || call.name === 'multi_replace_file_content') {
          if (call.args && call.args.TargetFile && call.args.TargetFile.includes('SessionInsights.jsx')) {
             if (call.name === 'write_to_file') {
                 // Check if it's the rewrite or the original
                 if (call.args.CodeContent.includes('const SAMPLE = `Teacher: What is Newton')) {
                     // This is the rewrite, ignore
                 } else {
                     lastContent = call.args.CodeContent;
                 }
             }
          }
        }
      }
    }
  } catch(e) {}
}

if (lastContent) {
  fs.writeFileSync('C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\olympiz2\\src\\pages\\educator\\SessionInsights.jsx', lastContent);
  console.log('Recovered!');
} else {
  console.log('Not found!');
}
