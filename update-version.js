/**
 * A simple script to update the version number in index.js
 * Usage: node update-version.js [new-version]
 * Example: node update-version.js "3.9"
 */

const fs = require('fs');
const path = require('path');

// Get the new version from command line arguments
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Error: Please provide a version number as an argument.');
  console.log('Usage: node update-version.js [new-version]');
  console.log('Example: node update-version.js "3.9"');
  process.exit(1);
}

// Path to the index.js file
const indexPath = path.join(__dirname, 'pages', 'index.js');

// Read the current file
try {
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Replace the version number using regex
  content = content.replace(
    /<div className="version-tag">Version ([0-9\.]+)<\/div>/,
    `<div className="version-tag">Version ${newVersion}</div>`
  );
  
  // Write the file back
  fs.writeFileSync(indexPath, content, 'utf8');
  
  console.log(`✅ Version updated to ${newVersion} successfully!`);
} catch (error) {
  console.error('Error updating version:', error.message);
  process.exit(1);
}
