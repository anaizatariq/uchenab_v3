const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.startsWith('faculty-') && f.endsWith('.html'));

let allPrograms = [];

for (const file of files) {
    if (file === 'faculty-profile.html') continue;
    const content = fs.readFileSync(file, 'utf8');
    
    const deptMatch = content.match(/id="departments"[^>]*>([\s\S]*?)<\/section>/);
    if (deptMatch) {
        const deptContent = deptMatch[1];
        const lis = [...deptContent.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)];
        for (const li of lis) {
            let text = li[1].replace(/<[^>]+>/g, '').trim();
            // remove non-breaking spaces and extra spaces
            text = text.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
            allPrograms.push({ file, program: text });
        }
    }
}

console.log(JSON.stringify(allPrograms, null, 2));
