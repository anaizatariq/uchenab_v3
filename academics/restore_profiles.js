const fs = require('fs');
const path = require('path');

const v1Dir = 'd:/uchenab project/Uchenab-v1/academics/';
const v2Dir = 'd:/uchenab project/uchenab-v2/academics/';

const files = fs.readdirSync(v1Dir).filter(f => f.startsWith('faculty-of-') && f.endsWith('.html'));

for (let file of files) {
    const v1Path = path.join(v1Dir, file);
    const v2Path = path.join(v2Dir, file);
    
    if (!fs.existsSync(v2Path)) continue;
    
    const v1Content = fs.readFileSync(v1Path, 'utf8');
    let v2Content = fs.readFileSync(v2Path, 'utf8');
    
    // Check if v2 already has faculty-members
    if (v2Content.includes('id="faculty-members"')) {
        console.log(`Skipping ${file}, already has faculty-members section`);
        continue;
    }
    
    // Find where the faculty cards start in V1
    const facultyCardIndex = v1Content.indexOf('class="faculty-card');
    if (facultyCardIndex === -1) {
        console.log(`No faculty cards found in V1 ${file}`);
        continue;
    }
    
    // Backtrack to find the container <div class="row ...">
    let rowStart = v1Content.lastIndexOf('<div class="row', facultyCardIndex);
    if (rowStart === -1) {
        console.log(`Could not find row start for ${file}`);
        continue;
    }
    
    let extractedHTML = '';
    let match;
    let divRegex = /<\/?div\b[^>]*>/gi;
    divRegex.lastIndex = rowStart;
    let divCount = 0;
    
    while ((match = divRegex.exec(v1Content)) !== null) {
        if (match[0].toLowerCase().startsWith('<div')) {
            divCount++;
        } else if (match[0].toLowerCase().startsWith('</div')) {
            divCount--;
        }
        
        if (divCount === 0) {
            extractedHTML = v1Content.substring(rowStart, match.index + match[0].length);
            break;
        }
    }
    
    if (extractedHTML !== '') {
        const newSection = `
<section data-acad-reveal class="mb-5 pb-5 border-bottom" id="faculty-members">
<h2 class="uc-section-title mb-5">Faculty Members</h2>
${extractedHTML}
</section>
`;

        const departmentsRegex = /(<section[^>]*id="departments"[^>]*>[\s\S]*?<\/section>)/i;
        if (departmentsRegex.test(v2Content)) {
            v2Content = v2Content.replace(departmentsRegex, `$1\n${newSection}`);
            fs.writeFileSync(v2Path, v2Content, 'utf8');
            console.log(`Restored profiles in ${file}`);
        } else {
            console.log(`Could not find #departments in V2 ${file}`);
        }
    } else {
        console.log(`Failed to extract HTML for ${file}`);
    }
}
