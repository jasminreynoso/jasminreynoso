// Blog Pagination
let currentPage = 1;
const itemsPerPage = 6;
let allPosts = [];

// Load blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('posts/blog.json');
        const data = await response.json();
        allPosts = data.posts;
        displayPosts();
        updatePagination();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('blog-container').innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
    }
}

// Display posts for current page
async function displayPosts() {
    const container = document.getElementById('blog-container');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const postsToShow = allPosts.slice(startIndex, endIndex);

    container.innerHTML = '';

    for (const post of postsToShow) {
        try {
            const textResponse = await fetch(`posts/txts/${post.textFile}`);
            const textContent = await textResponse.text();
            
            // Get first 6 words only
            const firstLine = textContent.split('\n')[0].trim();
            const words = firstLine.split(' ').slice(0, 6).join(' ');
            const preview = words + (firstLine.split(' ').length > 6 ? '...' : '');
            
            const postElement = document.createElement('a');
            postElement.href = `post.html?file=${post.textFile}&title=${encodeURIComponent(post.title)}&date=${encodeURIComponent(post.dateAdded)}`;
            postElement.className = 'blog-post';
            postElement.innerHTML = `
                <h2 class="blog-post-title">${post.title}</h2>
                <div class="blog-post-date">${post.dateAdded}</div>
                <div class="blog-post-content">${preview}</div>
            `;
            container.appendChild(postElement);
        } catch (error) {
            console.error(`Error loading post ${post.textFile}:`, error);
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            postElement.innerHTML = `
                <h2 class="blog-post-title">${post.title}</h2>
                <div class="blog-post-date">${post.dateAdded}</div>
                <div class="blog-post-content">Error loading post content.</div>
            `;
            container.appendChild(postElement);
        }
    }
}

// Update pagination buttons
function updatePagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = Math.ceil(allPosts.length / itemsPerPage);

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
        displayPosts();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(allPosts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPosts();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Load posts on page load
if (document.getElementById('blog-container')) {
    loadBlogPosts();
}

