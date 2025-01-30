document.addEventListener("DOMContentLoaded", () => {
    loadContent("all"); // Default to showing everything

    document.getElementById("filter-all").addEventListener("click", () => loadContent("all"));
    document.getElementById("filter-projects").addEventListener("click", () => loadContent("projects"));
    document.getElementById("filter-blog").addEventListener("click", () => loadContent("blog"));
});

async function loadContent(type) {
    const workContainer = document.getElementById("work-container");
    workContainer.innerHTML = ""; // Clear previous content

    if (type === "all" || type === "blog") {
        await loadBlogPosts(workContainer);
    }
    if (type === "all" || type === "projects") {
        await loadProjects(workContainer);
    }
}

async function loadBlogPosts(container) {
    try {
        const response = await fetch("content/blog.json");
        const blogPosts = await response.json();

        blogPosts.forEach(async (post) => {
            let content = await fetch(`content/blog/${post.file}`).then(res => res.text());
            let article = document.createElement("article");
            article.classList.add("post", "blog");
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.summary}</p>
                <a href="#" onclick="viewBlog('${post.file}')">Read More</a>
            `;
            container.appendChild(article);
        });
    } catch (error) {
        console.error("Error loading blog posts:", error);
    }
}

async function loadProjects(container) {
    try {
        const response = await fetch("content/projects.json");
        const projects = await response.json();

        projects.forEach((project) => {
            let article = document.createElement("article");
            article.classList.add("post", "projects");
            article.innerHTML = `
                <h2>${project.title}</h2>
                <p>${project.summary}</p>
                <p><strong>Tech Stack:</strong> ${project.tech_stack}</p>
                <a href="content/projects/${project.folder}/index.html">View Project</a>
            `;
            container.appendChild(article);
        });
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

function viewBlog(filename) {
    window.location.href = `content/blog/${filename}`;
}
