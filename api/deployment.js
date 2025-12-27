// Vercel Deployment API Handler
// This file handles the deployment logic with proper file processing

const vercelToken = [
    "XMwtc6WUrk81uBJgQXd8DWES",  // Token Account 1
    "iMZdXbdEerlvL8oYWphckb7B",  // Token Account 2  
    "gvxjCj2AcqdjUwURpaoXhPjd",  // Token Account 3
    "55pVAsQhXZ5Yqwo0VGI4W0Me", // Token Account 4
    "Vv5QDbKOmtHmlV4sjtodVAUc"  // Token Account 5
];

// Helper function to get random token for load balancing
function getRandomToken() {
    return vercelToken[Math.floor(Math.random() * vercelToken.length)];
}

// Helper function to process ZIP files
async function processZipFile(fileBuffer) {
    const JSZip = require('jszip');
    const zip = await JSZip.loadAsync(fileBuffer);
    const files = [];
    
    for (const [filename, file] of Object.entries(zip.files)) {
        if (!file.dir) {
            const content = await file.async('text');
            files.push({
                file: filename,
                data: content
            });
        }
    }
    
    return files;
}

// Helper function to prepare deployment files
function prepareDeploymentFiles(fileName, fileContent) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'html':
            return [{ file: 'index.html', data: fileContent }];
        
        case 'css':
            // Create a simple HTML wrapper for CSS
            const cssHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>CSS File Deployed</h1>
    <p>Your CSS file has been successfully deployed.</p>
</body>
</html>`;
            return [
                { file: 'index.html', data: cssHtml },
                { file: 'style.css', data: fileContent }
            ];
        
        case 'js':
            // Create a simple HTML wrapper for JS
            const jsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Preview</title>
</head>
<body>
    <h1>JavaScript File Deployed</h1>
    <p>Check the browser console for output.</p>
    <div id="app"></div>
    <script src="script.js"></script>
</body>
</html>`;
            return [
                { file: 'index.html', data: jsHtml },
                { file: 'script.js', data: fileContent }
            ];
        
        default:
            throw new Error('Unsupported file type');
    }
}

// Main deployment handler
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
    }
    
    try {
        // Parse form data
        const formidable = require('formidable');
        const form = new formidable.IncomingForm();
        
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parse error:', err);
                return res.status(400).json({ 
                    success: false, 
                    error: 'Failed to parse form data' 
                });
            }
            
            const siteName = Array.isArray(fields.siteName) ? fields.siteName[0] : fields.siteName;
            const uploadedFile = files.file;
            
            if (!siteName || !uploadedFile) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing site name or file' 
                });
            }
            
            // Read file content
            const fs = require('fs');
            const fileBuffer = fs.readFileSync(uploadedFile.filepath);
            const fileName = uploadedFile.originalFilename || uploadedFile.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            
            let deploymentFiles;
            
            try {
                // Process file based on type
                if (fileExtension === 'zip') {
                    deploymentFiles = await processZipFile(fileBuffer);
                    
                    // Ensure there's an index.html
                    const hasIndex = deploymentFiles.some(f => 
                        f.file === 'index.html' || f.file.endsWith('/index.html')
                    );
                    
                    if (!hasIndex) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'ZIP file must contain an index.html file' 
                        });
                    }
                } else {
                    const fileContent = fileBuffer.toString('utf-8');
                    deploymentFiles = prepareDeploymentFiles(fileName, fileContent);
                }
            } catch (error) {
                console.error('File processing error:', error);
                return res.status(400).json({ 
                    success: false, 
                    error: 'Failed to process file: ' + error.message 
                });
            }
            
            // Select a random token
            const token = getRandomToken();
            
            // Step 1: Create project in Vercel
            try {
                const projectResponse = await fetch('https://api.vercel.com/v9/projects', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name: siteName,
                        framework: null
                    })
                });
                
                if (!projectResponse.ok) {
                    const errorData = await projectResponse.json();
                    // If project already exists, continue with deployment
                    if (errorData.error?.code !== 'project_already_exists') {
                        throw new Error(errorData.error?.message || 'Failed to create project');
                    }
                }
            } catch (error) {
                console.error('Project creation error:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Failed to create project: ' + error.message 
                });
            }
            
            // Step 2: Deploy to Vercel
            const deploymentPayload = {
                name: siteName,
                project: siteName,
                target: 'production',
                files: deploymentFiles,
                projectSettings: {
                    framework: null
                }
            };
            
            try {
                const deployResponse = await fetch('https://api.vercel.com/v13/deployments', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(deploymentPayload)
                });
                
                const deployData = await deployResponse.json();
                
                if (deployResponse.ok && deployData.url) {
                    return res.status(200).json({
                        success: true,
                        url: `https://${deployData.url}`,
                        deploymentUrl: `https://${siteName}.vercel.app`,
                        message: 'Deployment successful'
                    });
                } else {
                    throw new Error(deployData.error?.message || 'Deployment failed');
                }
            } catch (error) {
                console.error('Deployment error:', error);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Deployment failed: ' + error.message 
                });
            }
        });
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error: ' + error.message 
        });
    }
}
