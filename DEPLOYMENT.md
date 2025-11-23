# Deployment Instructions

## Prerequisites
- Node.js 16+ installed
- Git installed
- GitHub account with a repository

## Initial Setup

1. **Create GitHub Repository**
   ```bash
   # Create a new repository on GitHub (don't initialize with README)
   # Name it: automation-test-spa
   ```

2. **Initialize Project Locally**
   ```bash
   mkdir automation-test-spa
   cd automation-test-spa
   git init
   ```

3. **Copy All Files**
   - Copy all provided files maintaining the folder structure
   - Ensure the following structure:
   ```
   automation-test-spa/
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── public/
   │   └── data.json
   ├── src/
   │   ├── main.js
   │   ├── App.js
   │   ├── styles.css
   │   └── components/
   │       ├── VirtualList.js
   │       ├── DragDropList.js
   │       └── TabContainer.js
   ├── README.md
   └── DEPLOYMENT.md
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

## Local Development

1. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Opens at http://localhost:5173
   - Hot reload enabled
   - Check console for any errors

2. **Test All Features**
   - Virtual scrolling (both lists)
   - Drag and drop between lists
   - Tab navigation
   - iFrame content loading

## Build & Deploy to GitHub Pages

1. **Configure Git Remote**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/automation-test-spa.git
   ```

2. **Initial Commit**
   ```bash
   git add .
   git commit -m "Initial commit - Automation testing SPA"
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages (will be created by deploy script)
   - Folder: / (root)

4. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```
   - This builds the project and pushes to gh-pages branch
   - Wait 2-5 minutes for GitHub to deploy

5. **Access Your Site**
   ```
   https://YOUR_USERNAME.github.io/automation-test-spa/
   ```

## Alternative Deployment Options

### Netlify (Recommended Alternative)
1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify Drop**
   - Visit https://app.netlify.com/drop
   - Drag the `dist` folder to deploy
   - Get instant URL

3. **Or Use Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --dir=dist --prod
   ```

### Vercel
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Surge.sh (Simplest)
1. **Install and Deploy**
   ```bash
   npm install -g surge
   npm run build
   surge dist your-app-name.surge.sh
   ```

## Bundle Size Optimization

Current optimizations:
- Preact instead of React (3KB vs 45KB)
- Minimal dependencies
- Tree shaking enabled
- Terser minification

Expected bundle sizes:
- Main JS: ~50KB (gzipped)
- CSS: ~5KB
- Total: ~55KB gzipped

## Troubleshooting

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 16+)

### GitHub Pages 404
- Check base path in vite.config.js
- Ensure gh-pages branch exists
- Wait for deployment (can take up to 10 minutes)

### Drag & Drop Not Working
- Check Sortable.js is loaded
- Verify refs are properly attached
- Check browser console for errors

### iFrames Not Loading
- Check srcdoc content is properly escaped
- Verify Content Security Policy allows iframes
- Test in different browsers

## Performance Testing

Run Lighthouse audit:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+

## Security Considerations

- No sensitive data in repository
- All data is mock/test data
- No API keys or secrets
- CSP headers recommended for production