// File input handling
const fileInput = document.getElementById('projectFile');
const fileLabel = document.querySelector('.file-label');
const fileNameSpan = document.querySelector('.file-name');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileNameSpan.textContent = file.name;
        fileLabel.classList.add('has-file');
    } else {
        fileNameSpan.textContent = 'No file selected';
        fileLabel.classList.remove('has-file');
    }
});

// Form submission
document.getElementById('deployForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const siteName = document.getElementById('siteName').value.trim();
    const file = fileInput.files[0];
    
    if (!siteName || !file) {
        showResult('⚠️ Please fill in the project name and upload a file', 'error');
        return;
    }
    
    // Validate site name
    if (!/^[a-z0-9-]+$/.test(siteName)) {
        showResult('⚠️ Project name can only contain lowercase letters, numbers, and hyphens', 'error');
        return;
    }
    
    // Validate file type
    const validExtensions = ['.html', '.zip', '.css', '.js'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
        showResult('⚠️ Please upload a valid file (HTML, ZIP, CSS, or JS)', 'error');
        return;
    }
    
    // Disable form during deployment
    const submitButton = document.querySelector('.submit-button');
    submitButton.disabled = true;
    
    try {
        // Show loading state
        showResult(`
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                <div class="spinner"></div>
                <span>Preparing deployment...</span>
            </div>
        `, 'loading');
        
        // Prepare form data
        const formData = new FormData();
        formData.append('siteName', siteName);
        formData.append('file', file);
        
        // Update loading message
        showResult(`
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                <div class="spinner"></div>
                <span>Deploying to Vercel...</span>
            </div>
        `, 'loading');
        
        // Send to backend API
        const response = await fetch('/api/deployment', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showResult(`
                ✅ Website successfully deployed!<br><br>
                <a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.url}</a>
                <br><br>
                <small>Your project is now live and accessible worldwide</small>
            `, 'success');
            
            // Reset form
            document.getElementById('deployForm').reset();
            fileNameSpan.textContent = 'No file selected';
            fileLabel.classList.remove('has-file');
        } else {
            showResult(`⚠️ Deployment failed: ${data.error || 'Unknown error occurred'}`, 'error');
        }
    } catch (error) {
        console.error('Deployment error:', error);
        showResult(`⚠️ Failed to connect to deployment server: ${error.message}`, 'error');
    } finally {
        submitButton.disabled = false;
    }
});

// Show result message
function showResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = message;
    resultDiv.className = `result show ${type}`;
    
    // Auto-hide loading messages after timeout if they're still loading
    if (type === 'loading') {
        setTimeout(() => {
            if (resultDiv.classList.contains('loading')) {
                showResult('⏱️ Deployment is taking longer than expected...', 'warning');
            }
        }, 30000);
    }
}

// Prevent drag and drop on window
window.addEventListener('dragover', (e) => {
    e.preventDefault();
});

window.addEventListener('drop', (e) => {
    e.preventDefault();
});

// Add drag and drop to file label
fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = 'var(--accent-color)';
    fileLabel.style.background = 'rgba(255, 255, 255, 0.08)';
});

fileLabel.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '';
    fileLabel.style.background = '';
});

fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '';
    fileLabel.style.background = '';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }
});
