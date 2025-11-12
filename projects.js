// Projects Pagination
let currentPage = 1;
const itemsPerPage = 6;
let allProjects = [];

// Load projects
async function loadProjects() {
    try {
        const response = await fetch('projects/projects.json');
        const data = await response.json();
        allProjects = data.projects;
        displayProjects();
        updatePagination();
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-container').innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
}

// Display projects for current page
function displayProjects() {
    const container = document.getElementById('projects-container');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const projectsToShow = allProjects.slice(startIndex, endIndex);

    container.innerHTML = '';

    projectsToShow.forEach(project => {
        const projectElement = document.createElement('a');
        projectElement.href = `project.html?folder=${encodeURIComponent(project.folderName)}&title=${encodeURIComponent(project.title)}&date=${encodeURIComponent(project.dateAdded)}&tech=${encodeURIComponent(JSON.stringify(project.techUsed))}`;
        projectElement.className = 'project-card';
        
        const techTags = project.techUsed.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        projectElement.innerHTML = `
            <h2 class="project-title">${project.title}</h2>
            <div class="project-date">${project.dateAdded}</div>
            <div class="project-tech">${techTags}</div>
        `;
        container.appendChild(projectElement);
    });
}

// Update pagination buttons
function updatePagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = Math.ceil(allProjects.length / itemsPerPage);

    if (currentPage > 1) {
        prevBtn.style.display = 'block';
    } else {
        prevBtn.style.display = 'none';
    }

    if (currentPage < totalPages) {
        nextBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'none';
    }
}

// Event listeners
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayProjects();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(allProjects.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayProjects();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Load projects on page load
if (document.getElementById('projects-container')) {
    loadProjects();
}

