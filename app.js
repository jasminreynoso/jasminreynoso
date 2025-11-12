// Main Application Logic
let currentPage = 1;
let itemsPerPage = 6;

// Initialize routes
router.route('home', () => {
    router.navigate('about');
});

router.route('about', () => {
    loadAboutPage();
});

router.route('projects', () => {
    loadProjectsPage();
});

router.route('blog', () => {
    loadBlogPage();
});

router.route('contact', () => {
    loadContactPage();
});

router.route('project-detail', () => {
    const id = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
    if (id) {
        loadProjectDetail(id);
    }
});

router.route('blog-detail', () => {
    const id = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
    if (id) {
        loadBlogDetail(id);
    }
});

// Load About Page
function loadAboutPage() {
    const content = `
        <div class="page">
            <h1>About Me</h1>
            <div class="about-section">
                <h3>Bio</h3>
                <p>Welcome to my personal website! I'm a passionate developer and creative thinker with a love for building innovative solutions. I enjoy exploring new technologies and sharing my journey through code and writing.</p>
            </div>
            <div class="about-section">
                <h3>Skills</h3>
                <ul>
                    <li>Full-Stack Development</li>
                    <li>JavaScript & TypeScript</li>
                    <li>React & Modern Frameworks</li>
                    <li>UI/UX Design</li>
                    <li>Problem Solving</li>
                    <li>Team Collaboration</li>
                </ul>
            </div>
            <div class="about-section">
                <h3>Interests</h3>
                <p>When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, writing technical blogs, and staying up-to-date with the latest trends in software development. I'm also passionate about design, photography, and creative problem-solving.</p>
            </div>
        </div>
    `;
    document.getElementById('app').innerHTML = content;
    updateActiveNav('about');
}

// Load Projects Page
async function loadProjectsPage(page = 1) {
    currentPage = page;
    try {
        const response = await fetch('projects/projects.json');
        const projects = await response.json();
        
        const totalPages = Math.ceil(projects.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const projectsToShow = projects.slice(startIndex, endIndex);
        
        const projectsHTML = projectsToShow.map(project => `
            <div class="grid-item" onclick="router.navigate('#project-detail?id=${project.id}')">
                <div class="grid-item-title">${project.title}</div>
                <div class="grid-item-meta">${project.techStack.join(', ')}</div>
                <div class="grid-item-tags">
                    ${project.techStack.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
            </div>
        `).join('');
        
        const paginationHTML = generatePaginationHTML(page, totalPages, 'projects');
        
        const content = `
            <div class="page">
                <h1>Projects</h1>
                <div class="grid-container">
                    ${projectsHTML}
                </div>
                ${paginationHTML}
            </div>
        `;
        
        document.getElementById('app').innerHTML = content;
        updateActiveNav('projects');
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('app').innerHTML = '<div class="page"><h1>Projects</h1><p>Error loading projects. Please try again later.</p></div>';
    }
}

// Load Project Detail
async function loadProjectDetail(id) {
    try {
        const response = await fetch('projects/projects.json');
        const projects = await response.json();
        const project = projects.find(p => p.id === id);
        
        if (!project) {
            document.getElementById('app').innerHTML = '<div class="page"><h1>Project Not Found</h1></div>';
            return;
        }
        
        const linksHTML = `
            <div class="project-links">
                ${project.demoLink ? `<a href="${project.demoLink}" class="project-link" target="_blank">View Demo</a>` : ''}
                ${project.githubLink ? `<a href="${project.githubLink}" class="project-link" target="_blank">GitHub</a>` : ''}
                ${project.relatedBlogPost ? `<a href="#blog-detail?id=${project.relatedBlogPost}" class="project-link">Related Blog Post</a>` : ''}
            </div>
        `;
        
        const content = `
            <div class="page detail-page">
                <a href="#projects" class="back-btn">← Back to Projects</a>
                <div class="detail-header">
                    <h1 class="detail-title">${project.title}</h1>
                    <div class="detail-meta">
                        ${project.techStack.map(tech => `<span class="tag">${tech}</span>`).join(' ')}
                    </div>
                </div>
                <div class="detail-content">
                    <h3>Description</h3>
                    <p>${project.description}</p>
                    ${linksHTML}
                </div>
            </div>
        `;
        
        document.getElementById('app').innerHTML = content;
        updateActiveNav('');
    } catch (error) {
        console.error('Error loading project detail:', error);
    }
}

// Load Blog Page
async function loadBlogPage(page = 1) {
    currentPage = page;
    try {
        const response = await fetch('posts/posts.json');
        const posts = await response.json();
        
        const totalPages = Math.ceil(posts.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const postsToShow = posts.slice(startIndex, endIndex);
        
        const postsHTML = postsToShow.map(post => `
            <div class="grid-item" onclick="router.navigate('#blog-detail?id=${post.id}')">
                <div class="grid-item-title">${post.title}</div>
                <div class="grid-item-meta">${formatDate(post.date)}</div>
                <div class="grid-item-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
        
        const paginationHTML = generatePaginationHTML(page, totalPages, 'blog');
        
        const content = `
            <div class="page">
                <h1>Blog</h1>
                <div class="grid-container">
                    ${postsHTML}
                </div>
                ${paginationHTML}
            </div>
        `;
        
        document.getElementById('app').innerHTML = content;
        updateActiveNav('blog');
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('app').innerHTML = '<div class="page"><h1>Blog</h1><p>Error loading blog posts. Please try again later.</p></div>';
    }
}

// Load Blog Detail
async function loadBlogDetail(id) {
    try {
        const response = await fetch('posts/posts.json');
        const posts = await response.json();
        const post = posts.find(p => p.id === id);
        
        if (!post) {
            document.getElementById('app').innerHTML = '<div class="page"><h1>Post Not Found</h1></div>';
            return;
        }
        
        const contentResponse = await fetch(`posts/${post.id}.txt`);
        const content = await contentResponse.text();
        
        const tagsHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');
        
        const pageContent = `
            <div class="page detail-page">
                <a href="#blog" class="back-btn">← Back to Blog</a>
                <div class="detail-header">
                    <h1 class="detail-title">${post.title}</h1>
                    <div class="detail-meta">${formatDate(post.date)}</div>
                    <div style="margin-top: 1rem;">${tagsHTML}</div>
                </div>
                <div class="detail-content">
                    ${formatBlogContent(content)}
                </div>
            </div>
        `;
        
        document.getElementById('app').innerHTML = pageContent;
        updateActiveNav('');
    } catch (error) {
        console.error('Error loading blog detail:', error);
        document.getElementById('app').innerHTML = '<div class="page"><h1>Error</h1><p>Could not load blog post.</p></div>';
    }
}

// Load Contact Page
function loadContactPage() {
    const content = `
        <div class="page">
            <h1>Contact</h1>
            <div class="contact-container">
                <div class="contact-info">
                    <h3>Get in Touch</h3>
                    <p>Feel free to reach out via email or connect on social media!</p>
                    <p style="margin-top: 1rem;">
                        <strong>Email:</strong> 
                        <a href="mailto:your.email@example.com">your.email@example.com</a>
                    </p>
                </div>
                <div class="contact-info">
                    <h3>Social Media</h3>
                    <div class="social-links">
                        <a href="https://twitter.com/yourhandle" class="social-link" target="_blank">
                            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                            <span>Twitter</span>
                        </a>
                        <a href="https://linkedin.com/in/yourhandle" class="social-link" target="_blank">
                            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            <span>LinkedIn</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app').innerHTML = content;
    updateActiveNav('contact');
}

// Helper Functions
function generatePaginationHTML(currentPage, totalPages, route) {
    if (totalPages <= 1) return '';
    
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    
    return `
        <div class="pagination">
            <button class="pagination-btn" ${prevDisabled} onclick="loadPage('${route}', ${currentPage - 1})">
                ← Previous
            </button>
            <span class="page-info">Page ${currentPage} of ${totalPages}</span>
            <button class="pagination-btn" ${nextDisabled} onclick="loadPage('${route}', ${currentPage + 1})">
                Next →
            </button>
        </div>
    `;
}

function loadPage(type, page) {
    if (type === 'projects') {
        loadProjectsPage(page);
    } else if (type === 'blog') {
        loadBlogPage(page);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatBlogContent(text) {
    // Convert plain text to HTML paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

function updateActiveNav(active) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href').slice(1);
        if (href === active) {
            link.style.color = 'var(--color-accent)';
        } else {
            link.style.color = '';
        }
    });
}

