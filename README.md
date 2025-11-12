# Personal Website

A modern, responsive personal website with blog, projects, and contact pages.

## Features

- **Home Page**: Welcome section with chessboard pattern layout
- **About Page**: Large photo, bio text, and side column images
- **Blog Page**: Displays blog posts with pagination (6 per page)
- **Projects Page**: Shows projects with tech stack tags and pagination (6 per page)
- **Contact Page**: Social media links (LinkedIn, Gmail, GitHub)
- **Custom Cursor**: Pixel art style black cat cursor that puffs up on hover
- **Loading Screen**: Animated cat running in a spiral pattern

## File Structure

```
personal-website/
├── index.html          # Home page
├── about.html          # About page
├── blog.html           # Blog listing page
├── projects.html       # Projects listing page
├── contact.html        # Contact page
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript (cursor, loading screen)
├── blog.js             # Blog pagination logic
├── projects.js         # Projects pagination logic
├── sample.img          # Placeholder for about page photo
├── posts/
│   ├── blog.json       # Blog posts metadata
│   └── txts/           # Blog post text files
│       ├── post1.txt
│       ├── post2.txt
│       └── ...
└── projects/
    ├── projects.json   # Projects metadata
    └── project-1/      # Project folders
        └── contents/   # Project contents
```

## Color Scheme

- `#331832` - Dark purple (primary)
- `#ef959c` - Pink (accent)
- `#fff8e8` - Cream (background)
- `#07393c` - Teal (text)
- `#cdd1c4` - Light gray (secondary)

## Customization

### Adding Blog Posts

1. Add a new entry to `posts/blog.json`:
```json
{
  "title": "Your Post Title",
  "dateAdded": "2024-01-01",
  "textFile": "post9.txt"
}
```

2. Create the corresponding text file in `posts/txts/post9.txt`

### Adding Projects

1. Add a new entry to `projects/projects.json`:
```json
{
  "title": "Your Project Title",
  "dateAdded": "2024-01-01",
  "techUsed": ["React", "Node.js"],
  "folderName": "project-9"
}
```

2. Create the project folder: `projects/project-9/contents/`

### Replacing Pixel Art with Images

The cursor and loading screen currently use CSS-based pixel art. To replace with actual images:

**For the cursor:**
- Replace the `.cat-cursor` CSS with a background image
- Add hover state with a different image (puffed tail version)

**For the loading screen:**
- Replace the `.pixel-cat` CSS with a background image or use an `<img>` tag

### About Page Photo

Replace `sample.img` with your actual photo file (`.jpg`, `.png`, etc.) and update the `src` attribute in `about.html` if needed.

### Side Column Images

Replace the placeholder emojis in `about.html` with actual `<img>` tags pointing to your images.

### Chessboard Images

Replace the placeholder divs in the chessboard grid on `index.html` with actual images.

## GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to Settings > Pages
3. Select your branch and `/ (root)` folder
4. Your site will be available at `https://yourusername.github.io/repository-name/`

## Browser Support

Works in all modern browsers. The custom cursor may not work on touch devices (tablets/phones) - the default cursor will be used instead.
