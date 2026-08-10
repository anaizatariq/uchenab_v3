const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.startsWith('faculty-') && f.endsWith('.html'));

function getLink(prog) {
    prog = prog.toLowerCase();
    
    // Allied / Medical
    if (prog.includes('medical lab')) return 'ug-medical-lab-sciences-bs.html';
    if (prog.includes('radiography') || prog.includes('imaging')) return 'ug-medical-imaging-sciences-bs.html';
    if (prog.includes('nutrition') || prog.includes('dietetics')) return 'ug-dietetics-and-nutritional-sciences.html';
    if (prog.includes('physical therapy') || prog.includes('dpt')) return 'ug-doctor-of-physio-therapy-dpt.html';
    if (prog.includes('pharmacy') || prog.includes('pharm-d')) return 'ug-doctor-of-pharmacy-pharm-d.html';
    if (prog.includes('food science') && prog.includes('bs')) return 'ug-dietetics-and-nutritional-sciences.html'; // fallback
    if (prog.includes('food science') && prog.includes('mphil')) return 'pg-food-science-and-technology-mphil.html';
    if (prog.includes('pharmaceutics')) return 'pg-pharmaceutics-mphil.html';
    if (prog.includes('pharmacology')) return 'pg-pharmacology-mphil.html';
    
    // Business
    if (prog.includes('bba') || prog.includes('business admin')) return 'ug-business-administration-bba.html';
    if (prog.includes('accounting') && prog.includes('bs')) return 'ug-accounting-and-finance-bs.html';
    if (prog.includes('accounting') && prog.includes('mphil')) return 'pg-accounting-and-finance-mphil.html';
    if (prog.includes('aviation')) return 'undergraduate.html'; // no aviation page found
    if (prog.includes('management science')) return 'pg-management-sciences-mphil.html';
    
    // Humanities
    if (prog.includes('english') && !prog.includes('mphil') && !prog.includes('linguistics') && !prog.includes('literature')) return 'ug-bs-english.html';
    if (prog.includes('linguistics')) return 'pg-english-applied-linguistics-mphil.html';
    if (prog.includes('literature')) return 'pg-english-literature-mphil.html';
    
    // Engineering / Tech
    if (prog.includes('civil')) return 'ug-civil-engineering-technology-bsc.html';
    if (prog.includes('computer science') && prog.includes('ms')) return 'pg-computer-science-ms.html';
    if (prog.includes('computer science') && !prog.includes('ms')) return 'ug-computer-science-bs.html';
    if (prog.includes('software engineering') && prog.includes('ms')) return 'pg-software-engineering-ms.html';
    if (prog.includes('software engineering') && !prog.includes('ms')) return 'ug-software-engineering-bs.html';
    if (prog.includes('data science')) return 'ug-data-science-bsds.html';
    if (prog.includes('information tech') || prog.includes('it')) return 'pg-information-technology-ms.html';
    
    // Sciences
    if (prog.includes('mathematics') && prog.includes('mphil')) return 'pg-mathematics-mphil.html';
    if (prog.includes('mathematics') && !prog.includes('mphil')) return 'ug-mathematics-bs.html';
    if (prog.includes('physics') && prog.includes('mphil')) return 'pg-physics-mphil.html';
    if (prog.includes('physics') && !prog.includes('mphil')) return 'ug-physics-bs.html';
    
    // default
    return prog.includes('mphil') || prog.includes('ms') ? 'postgraduate.html' : 'undergraduate.html';
}

for (const file of files) {
    if (file === 'faculty-profile.html') continue;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const deptRegex = /<section data-acad-reveal class="mb-5"[^>]*id="departments"[^>]*>([\s\S]*?)<\/section>/;
    const match = content.match(deptRegex);
    
    if (match) {
        const deptContent = match[1];
        const lis = [...deptContent.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)];
        let programs = [];
        
        for (const li of lis) {
            let text = li[1].replace(/<[^>]+>/g, '').trim();
            text = text.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
            if (text) {
                programs.push(text);
            }
        }
        
        // Ensure unique programs
        programs = [...new Set(programs)];
        
        let newHtml = `<section data-acad-reveal class="mb-5 pb-4" id="departments">
<h2 class="uc-section-title mb-5">Departments & Programs</h2>
`;

        if (programs.length > 0) {
            newHtml += `<div class="row g-4">\n`;
            for (const prog of programs) {
                const link = getLink(prog);
                newHtml += `  <div class="col-md-6 col-lg-4">
    <a class="uc-hub-card h-100" href="${link}">
      <h3 class="uc-simple-card__title mb-4" style="font-size: 1.15rem; line-height: 1.4;">${prog}</h3>
      <span class="uc-simple-card__btn mt-auto" style="align-self: flex-start; padding: 0.4rem 1rem; font-size: 0.75rem;">Explore <i class="bi bi-arrow-right"></i></span>
    </a>
  </div>\n`;
            }
            newHtml += `</div>\n`;
        } else {
            // If no <li> found, it means it's empty or says "Information will be shared soon"
            newHtml += `<div class="uc-rich"><p class="uc-editorial-text">Program details for this faculty will be updated soon. Please check our <a href="course-catalog.html">Course Catalog</a> for a full list of degrees.</p></div>\n`;
        }

        newHtml += `</section>`;
        
        content = content.replace(deptRegex, newHtml);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
}
