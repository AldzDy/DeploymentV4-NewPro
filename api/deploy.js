/*
//Vercel tokens - split into 5 parts
const vercelTokens = [
    "XMwtc6WUrk81uBJgQXd8DWES",  // Token 1
    "iMZdXbdEerlvL8oYWphckb7B",  // Token 2  
    "gvxjCj2AcqdjUwURpaoXhPjd",  // Token 3
    "55pVAsQhXZ5Yqwo0VGI4W0Me",  // Token 4
    "Vv5QDbKOmtHmlV4sjtodVAUc"   // Token 5
];

// Token status tracking
let tokenStatus = Array(vercelTokens.length).fill({ lastError: null, errorCount: 0 });

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    try {
        const { siteName, file, tokenIndex } = req.body;
        
        // Validate inputs
        if (!siteName || !file) {
            return res.status(400).json({ success: false, error: 'Missing site name or file' });
        }
        
        // Use the specified token index or get the next available one
        const tokenIdx = tokenIndex !== undefined ? parseInt(tokenIndex) : getNextAvailableToken();
        const token = vercelTokens[tokenIdx];
        
        if (!token) {
            return res.status(400).json({ success: false, error: 'Invalid token index' });
        }
        
        console.log(`Using token ${tokenIdx + 1} for deployment of ${siteName}`);
        
        // Step 1: Create project in Vercel
        const projectResponse = await fetch("https://api.vercel.com/v9/projects", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: siteName, framework: "static" })
        });
        
        if (!projectResponse.ok) {
            // Mark token as problematic
            tokenStatus[tokenIdx].lastError = new Date();
            tokenStatus[tokenIdx].errorCount++;
            
            const errorText = await projectResponse.text();
            console.error(`Token ${tokenIdx + 1} failed to create project:`, errorText);
            
            // Check if it's an auth error
            if (projectResponse.status === 401 || projectResponse.status === 403) {
                return res.status(401).json({ 
                    success: false, 
                    error: `Token ${tokenIdx + 1} authentication failed. Try another token.`
                });
            }
            
            return res.status(projectResponse.status).json({ 
                success: false, 
                error: `Failed to create project: ${projectResponse.status} ${projectResponse.statusText}`
            });
        }
        
        // Step 2: Prepare deployment payload based on file type
        let deploymentPayload;
        
        // Check if file is a zip
        const isZip = file.name && file.name.toLowerCase().endsWith('.zip');
        
        if (isZip) {
            // For zip files, we need to handle them differently
            // Note: Actual ZIP handling would require more complex processing
            // For this example, we'll simulate it
            deploymentPayload = {
                name: siteName,
                project: siteName,
                target: "production",
                files: [
                    {
                        file: "index.html",
                        data: Buffer.from('<html><body><h1>ZIP file deployment - placeholder</h1><p>In a real implementation, the ZIP contents would be extracted and deployed.</p></body></html>').toString('base64')
                    }
                ]
            };
        } else {
            // For HTML files, read the content
            const fileContent = await file.text();
            
            deploymentPayload = {
                name: siteName,
                project: siteName,
                target: "production",
                files: [
                    {
                        file: "index.html",
                        data: Buffer.from(fileContent).toString('base64')
                    }
                ]
            };
        }
        
        // Step 3: Deploy to Vercel
        const deploymentResponse = await fetch("https://api.vercel.com/v13/deployments", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deploymentPayload)
        });
        
        if (!deploymentResponse.ok) {
            // Mark token as problematic
            tokenStatus[tokenIdx].lastError = new Date();
            tokenStatus[tokenIdx].errorCount++;
            
            const errorText = await deploymentResponse.text();
            console.error(`Token ${tokenIdx + 1} failed to deploy:`, errorText);
            
            return res.status(deploymentResponse.status).json({ 
                success: false, 
                error: `Deployment failed: ${deploymentResponse.status} ${deploymentResponse.statusText}`
            });
        }
        
        const deploymentData = await deploymentResponse.json();
        
        // Success - clear token error status
        tokenStatus[tokenIdx].lastError = null;
        tokenStatus[tokenIdx].errorCount = 0;
        
        // Return success response
        return res.status(200).json({
            success: true,
            url: deploymentData.url || `${siteName}.vercel.app`,
            deploymentId: deploymentData.id,
            tokenUsed: tokenIdx + 1
        });
        
    } catch (error) {
        console.error('Deployment error:', error);
        return res.status(500).json({ 
            success: false, 
            error: `Internal server error: ${error.message}`
        });
    }
}

// Helper function to get the next available token
function getNextAvailableToken() {
    // Find token with no recent errors
    for (let i = 0; i < vercelTokens.length; i++) {
        const status = tokenStatus[i];
        if (!status.lastError || Date.now() - status.lastError.getTime() > 3600000) { // 1 hour
            return i;
        }
    }
    
    // If all have recent errors, use the one with the oldest error
    let oldestErrorIndex = 0;
    let oldestErrorTime = tokenStatus[0].lastError ? tokenStatus[0].lastError.getTime() : 0;
    
    for (let i = 1; i < tokenStatus.length; i++) {
        if (tokenStatus[i].lastError && tokenStatus[i].lastError.getTime() < oldestErrorTime) {
            oldestErrorIndex = i;
            oldestErrorTime = tokenStatus[i].lastError.getTime();
        }
    }
    
    return oldestErrorIndex;
}

// For Vercel serverless function compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = handler;
}
Please fix all existing errors.
*/
// Vercel tokens - split into 5 parts
const vercelTokens = [
    "XMwtc6WUrk81uBJgQXd8DWES",  // Token 1
    "iMZdXbdEerlvL8oYWphckb7B",  // Token 2  
    "gvxjCj2AcqdjUwURpaoXhPjd",  // Token 3
    "55pVAsQhXZ5Yqwo0VGI4W0Me",  // Token 4
    "Vv5QDbKOmtHmlV4sjtodVAUc"   // Token 5
];

// Token status tracking
let tokenStatus = Array(vercelTokens.length).fill({ lastError: null, errorCount: 0 });

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    try {
        const { siteName, file, tokenIndex } = req.body;
        
        // Validate inputs
        if (!siteName || !file) {
            return res.status(400).json({ success: false, error: 'Missing site name or file' });
        }
        
        // Use the specified token index or get the next available one
        let tokenIdx;
        if (tokenIndex !== undefined) {
            const idx = parseInt(tokenIndex);
            if (isNaN(idx) || idx < 0 || idx >= vercelTokens.length) {
                return res.status(400).json({ success: false, error: 'Invalid token index' });
            }
            tokenIdx = idx;
        } else {
            tokenIdx = getNextAvailableToken();
        }
        const token = vercelTokens[tokenIdx];
        
        if (!token) {
            return res.status(400).json({ success: false, error: 'Invalid token index' });
        }
        
        console.log(`Using token ${tokenIdx + 1} for deployment of ${siteName}`);
        
        // Step 1: Create project in Vercel
        const projectResponse = await fetch("https://api.vercel.com/v9/projects", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: siteName, framework: "static" })
        });
        
        if (!projectResponse.ok) {
            // Mark token as problematic
            tokenStatus[tokenIdx].lastError = new Date();
            tokenStatus[tokenIdx].errorCount++;
            
            const errorText = await projectResponse.text();
            console.error(`Token ${tokenIdx + 1} failed to create project:`, errorText);
            
            // Check if it's an auth error
            if (projectResponse.status === 401 || projectResponse.status === 403) {
                return res.status(401).json({ 
                    success: false, 
                    error: `Token ${tokenIdx + 1} authentication failed. Try another token.`
                });
            }
            
            return res.status(projectResponse.status).json({ 
                success: false, 
                error: `Failed to create project: ${projectResponse.status} ${projectResponse.statusText}`
            });
        }
        
        // Step 2: Prepare deployment payload based on file type
        let deploymentPayload;
        
        // Check if file is a zip
        const isZip = file.name && file.name.toLowerCase().endsWith('.zip');
        
        if (isZip) {
            // ZIP file deployment is not implemented
            return res.status(400).json({ success: false, error: 'ZIP file deployment not supported' });
        } else {
            // For HTML files, read the content
            const fileContent = await file.text();
            
            deploymentPayload = {
                name: siteName,
                project: siteName,
                target: "production",
                files: [
                    {
                        file: "index.html",
                        data: Buffer.from(fileContent).toString('base64')
                    }
                ]
            };
        }
        
        // Step 3: Deploy to Vercel
        const deploymentResponse = await fetch("https://api.vercel.com/v13/deployments", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deploymentPayload)
        });
        
        if (!deploymentResponse.ok) {
            // Mark token as problematic
            tokenStatus[tokenIdx].lastError = new Date();
            tokenStatus[tokenIdx].errorCount++;
            
            const errorText = await deploymentResponse.text();
            console.error(`Token ${tokenIdx + 1} failed to deploy:`, errorText);
            
            return res.status(deploymentResponse.status).json({ 
                success: false, 
                error: `Deployment failed: ${deploymentResponse.status} ${deploymentResponse.statusText}`
            });
        }
        
        const deploymentData = await deploymentResponse.json();
        
        // Success - clear token error status
        tokenStatus[tokenIdx].lastError = null;
        tokenStatus[tokenIdx].errorCount = 0;
        
        // Return success response
        return res.status(200).json({
            success: true,
            url: deploymentData.url || `${siteName}.vercel.app`,
            deploymentId: deploymentData.id,
            tokenUsed: tokenIdx + 1
        });
        
    } catch (error) {
        console.error('Deployment error:', error);
        return res.status(500).json({ 
            success: false, 
            error: `Internal server error: ${error.message}`
        });
    }
}

// Helper function to get the next available token
function getNextAvailableToken() {
    // Find token with no recent errors
    for (let i = 0; i < vercelTokens.length; i++) {
        const status = tokenStatus[i];
        if (!status.lastError || Date.now() - status.lastError.getTime() > 3600000) { // 1 hour
            return i;
        }
    }
    
    // If all have recent errors, use the one with the oldest error
    let oldestErrorIndex = 0;
    let oldestErrorTime = tokenStatus[0].lastError ? tokenStatus[0].lastError.getTime() : 0;
    
    for (let i = 1; i < tokenStatus.length; i++) {
        if (tokenStatus[i].lastError && tokenStatus[i].lastError.getTime() < oldestErrorTime) {
            oldestErrorIndex = i;
            oldestErrorTime = tokenStatus[i].lastError.getTime();
        }
    }
    
    return oldestErrorIndex;
}

// For Vercel serverless function compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = handler;
}