# Vercel Deploy Tool

A professional, sleek deployment tool for Vercel with a stunning monochromatic design. Created by **AldzX505**.

![Design Preview](https://img.shields.io/badge/Design-Black%20%26%20White-000000?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

## ✨ Features

- 🎨 **Stunning UI** - Monochromatic black and white design with space-themed background
- 📦 **Multiple File Types** - Support for HTML, ZIP, CSS, and JS files
- ⚡ **Lightning Fast** - Optimized deployment process
- 🔒 **Secure** - Token-based authentication with load balancing
- 🌍 **Global CDN** - Powered by Vercel's worldwide infrastructure
- 📱 **Responsive** - Works perfectly on all devices
- 🎭 **Smooth Animations** - Professional transitions and effects

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Vercel account (optional, tokens are included)
- npm or yarn package manager

### Installation

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure

```
vercel-deploy-tool/
├── index.html          # Main HTML file
├── style.css           # Styling with animations
├── script.js           # Frontend logic
├── api/
│   └── deployment.js   # Backend API handler
├── package.json        # Dependencies
├── vercel.json         # Vercel configuration
└── README.md          # Documentation
```

## 🎯 Usage

1. **Enter Project Name**
   - Use lowercase letters, numbers, and hyphens only
   - Example: `my-awesome-site`

2. **Upload Your File**
   - **HTML files**: Single page applications
   - **ZIP files**: Complete projects (must contain index.html)
   - **CSS files**: Stylesheet with auto-generated HTML wrapper
   - **JS files**: JavaScript with auto-generated HTML wrapper

3. **Click Deploy**
   - Wait for deployment to complete
   - Access your site at `https://your-project-name.vercel.app`

## 🔧 Configuration

### Vercel Tokens

Tokens are stored in `api/deployment.js`:

```javascript
const vercelToken = [
    "YOUR_TOKEN_1",
    "YOUR_TOKEN_2",
    // Add more tokens for load balancing
];
```

### Customization

- **Background Image**: Change the URL in `style.css` (line 22)
- **Colors**: Modify CSS variables in `:root` section
- **WhatsApp Link**: Update the href in `index.html` (line 115)

## 🎨 Design Features

- **Orbitron Font**: Futuristic headers
- **JetBrains Mono**: Clean, professional body text
- **Animated Elements**: Smooth transitions and hover effects
- **Glassmorphism**: Frosted glass effect on cards
- **Particle Background**: Dynamic space-themed imagery
- **Responsive Grid**: Adapts to all screen sizes

## 📦 Supported File Types

| File Type | Description | Auto-Generated |
|-----------|-------------|----------------|
| `.html` | Single HTML file | None |
| `.zip` | Complete project archive | None (must have index.html) |
| `.css` | Stylesheet only | HTML wrapper |
| `.js` | JavaScript file | HTML wrapper |

## 🔐 Security Features

- Token rotation for load balancing
- CORS protection
- Input validation
- Secure file processing
- Error handling

## 📱 Contact & Support

- **Creator**: AldzX505
- **WhatsApp**: [Join Channel](https://whatsapp.com/channel/0029VajUu8kFfOXCdvXvjq3R)

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🙏 Credits

- Design & Development: **AldzX505**
- Hosting: Vercel
- Background: Unsplash
- Icons: Heroicons

## 🐛 Troubleshooting

### Common Issues

**Q: Deployment fails with "project_already_exists"**  
A: The project name is already taken. Try a different name.

**Q: ZIP file deployment fails**  
A: Ensure your ZIP contains an `index.html` file at the root level.

**Q: CSS/JS files don't display correctly**  
A: These files are automatically wrapped in HTML. Deploy as ZIP for full control.

**Q: "Connection failed to Vercel"**  
A: Check your internet connection and Vercel API status.

## 🚀 Deployment Tips

1. Use meaningful project names
2. Test files locally before deploying
3. Keep file sizes reasonable (<50MB)
4. Use ZIP files for multi-file projects
5. Check Vercel dashboard for deployment status

---

**Made with 🖤 by AldzX505**
