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

fix dari Gemini
result 
*/
let VERCEL_TOKEN_1 = "XMwtc6WUrk81uBJgQXd8DWES";
let VERCEL_TOKEN_1 = "XMwtc6WUrk81uBJgQXd8DWES";
let VERCEL_TOKEN_1 = "XMwtc6WUrk81uBJgQXd8DWES";
let VERCEL_TOKEN_1 = "XMwtc6WUrk81uBJgQXd8DWES";
let VERCEL_TOKEN_1 = "XMwtc6WUrk81uBJgQXd8DWES";

// Note: Store your tokens in Vercel Dashboard as VERCEL_TOKEN_1, VERCEL_TOKEN_2, etc.
const vercelTokens = [
    process.env.VERCEL_TOKEN_1,
    process.env.VERCEL_TOKEN_2,
    process.env.VERCEL_TOKEN_3,
    process.env.VERCEL_TOKEN_4,
    process.env.VERCEL_TOKEN_5
].filter(Boolean); // Only use tokens that are actually defined

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        // In a real API, 'file' would be the raw text content or a base64 string
        const { siteName, fileContent, tokenIndex } = req.body;

        if (!siteName || !fileContent) {
            return res.status(400).json({ success: false, error: 'Missing siteName or fileContent' });
        }

        // Select token
        const idx = (tokenIndex !== undefined && tokenIndex < vercelTokens.length) 
                    ? tokenIndex 
                    : 0;
        const token = vercelTokens[idx];

        if (!token) {
            return res.status(500).json({ success: false, error: 'No API tokens configured' });
        }

        // 1. Ensure Project Exists
        // We use the v9 projects API. Note: If the project exists, this might return 409,
        // which we should handle or ignore to proceed to deployment.
        const projectRes = await fetch("https://api.vercel.com/v9/projects", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ name: siteName, framework: null }) // null for static
        });

        // 2. Deploy
        // The Vercel API expects files to be an array of objects with 'file' (path) and 'data' (content)
        const deploymentRes = await fetch("https://api.vercel.com/v13/deployments", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: siteName,
                project: siteName,
                target: "production",
                files: [
                    {
                        file: "index.html",
                        data: Buffer.from(fileContent).toString('base64'),
                        encoding: 'base64'
                    }
                ]
            })
        });

        const deploymentData = await deploymentRes.json();

        if (!deploymentRes.ok) {
            throw new Error(deploymentData.error?.message || "Deployment failed");
        }

        return res.status(200).json({
            success: true,
            url: deploymentData.url,
            deploymentId: deploymentData.id
        });

    } catch (error) {
        console.error('Request failed:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
