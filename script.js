// DOM elements
const deployForm = document.getElementById("deployForm");
const siteNameInput = document.getElementById("siteName");
const fileInput = document.getElementById("htmlFile");
const fileUploadArea = document.getElementById("fileUploadArea");
const fileInfo = document.getElementById("fileInfo");
const deployButton = document.getElementById("deployButton");
const resultDiv = document.getElementById("result");
const tokenStatusDiv = document.getElementById("tokenStatus");
const currentYearSpan = document.getElementById("currentYear");

// Token management
let currentTokenIndex = 0;
let tokenStatuses = Array(5).fill({ status: 'unknown', lastUsed: null });

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();
    
    // Initialize token status display
    initializeTokenStatus();
    
    // Setup file upload area
    setupFileUpload();
    
    // Setup form submission
    deployForm.addEventListener("submit", handleDeploy);
});

// Initialize token status display
function initializeTokenStatus() {
    tokenStatusDiv.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const tokenItem = document.createElement('div');
        tokenItem.className = 'token-item';
        tokenItem.id = `token-${i}`;
        tokenItem.innerHTML = `
            <div class="token-status-icon">
                <i class="fas fa-question-circle"></i>
            </div>
            <div class="token-number">Token ${i+1}</div>
            <div class="token-status-text">Unknown</div>
        `;
        tokenStatusDiv.appendChild(tokenItem);
    }
}

// Update token status display
function updateTokenStatus(index, status, message = '') {
    const tokenItem = document.getElementById(`token-${index}`);
    const icon = tokenItem.querySelector('.token-status-icon i');
    const statusText = tokenItem.querySelector('.token-status-text');
    
    // Remove all status classes
    tokenItem.classList.remove('active', 'error');
    
    // Update based on status
    if (status === 'active') {
        tokenItem.classList.add('active');
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#4CAF50';
        statusText.textContent = 'Active';
    } else if (status === 'error') {
        tokenItem.classList.add('error');
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#F44336';
        statusText.textContent = message || 'Error';
    } else if (status === 'unknown') {
        icon.className = 'fas fa-question-circle';
        icon.style.color = '#9E9E9E';
        statusText.textContent = 'Unknown';
    }
    
    // Store status
    tokenStatuses[index] = { status, lastUsed: new Date() };
}

// Setup file upload area
function setupFileUpload() {
    // Handle drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        fileUploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        fileUploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        fileUploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateFileInfo(e.dataTransfer.files[0]);
        }
    });
    
    // Handle file selection via click
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            updateFileInfo(fileInput.files[0]);
        }
    });
}

// Update file info display
function updateFileInfo(file) {
    fileInfo.innerHTML = `
        <i class="fas fa-file"></i> 
        <strong>${file.name}</strong> 
        (${(file.size / 1024).toFixed(1)} KB)
        <br>
        <small>Type: ${file.type || 'Unknown'}</small>
    `;
    fileInfo.classList.add('show');
}

// Get the next available token
function getNextToken() {
    // Try current token first
    if (tokenStatuses[currentTokenIndex].status !== 'error') {
        return currentTokenIndex;
    }
    
    // Find a token that hasn't errored
    for (let i = 0; i < tokenStatuses.length; i++) {
        const index = (currentTokenIndex + i + 1) % tokenStatuses.length;
        if (tokenStatuses[index].status !== 'error') {
            currentTokenIndex = index;
            return index;
        }
    }
    
    // If all tokens have errors, reset and use the first one
    currentTokenIndex = 0;
    return 0;
}

// Main deployment handler
async function handleDeploy(e) {
    e.preventDefault();
    
    const siteName = siteNameInput.value.trim();
    
    if (!siteName || fileInput.files.length === 0) {
        showResult("Please fill in the site name and upload a file", "error");
        return;
    }
    
    // Disable the button and show loading
    deployButton.disabled = true;
    deployButton.innerHTML = '<div class="spinner"></div> Deploying...';
    
    const file = fileInput.files[0];
    const tokenIndex = getNextToken();
    
    // Update token display
    updateTokenStatus(tokenIndex, 'active');
    showResult("Starting deployment process...", "loading");
    
    try {
        // Prepare form data
        const formData = new FormData();
        formData.append("siteName", siteName);
        formData.append("file", file);
        formData.append("tokenIndex", tokenIndex.toString());
        
        // Call the API endpoint
        const response = await fetch("/api/deploy", {
            method: "POST",
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResult(`Website successfully deployed!<br>
                       <a href="https://${data.url}" target="_blank">https://${data.url}</a><br><br>
                       <small>Deployment ID: ${data.deploymentId}</small>`, "success");
            
            // Reset token status after successful deployment
            updateTokenStatus(tokenIndex, 'active');
        } else {
            // Mark token as errored
            updateTokenStatus(tokenIndex, 'error', data.error || 'Error');
            
            // Try with next token if this one failed
            if (data.error && data.error.includes('token') || data.error.includes('auth')) {
                showResult(`Token error, trying with next token...`, "loading");
                
                // Small delay before retry
                setTimeout(() => {
                    const nextTokenIndex = getNextToken();
                    if (nextTokenIndex !== tokenIndex) {
                        updateTokenStatus(nextTokenIndex, 'active');
                        showResult(`Switched to Token ${nextTokenIndex + 1}, retrying...`, "loading");
                        // In a real implementation, you would retry the deployment here
                    } else {
                        showResult(`⚠️ Deployment failed: ${data.error || "Unknown error"}`, "error");
                    }
                }, 1000);
            } else {
                showResult(`⚠️ Deployment failed: ${data.error || "Unknown error"}`, "error");
            }
        }
        
    } catch (error) {
        // Mark current token as errored
        updateTokenStatus(tokenIndex, 'error', 'Network error');
        
        showResult("Connection failed to deployment server", "error");
        console.error("Deployment error:", error);
    } finally {
        // Re-enable the button
        deployButton.disabled = false;
        deployButton.innerHTML = '<i class="fas fa-rocket"></i> Deploy to Vercel';
    }
}

// Display result message
function showResult(message, type) {
    resultDiv.innerHTML = message;
    resultDiv.className = `result show ${type}`;
    
    // Add loading spinner for loading type
    if (type === "loading") {
        resultDiv.innerHTML = `<div class="spinner"></div> ${message}`;
    }
}