#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
    const targetPath = path.join(platformRoot, 'app/src/main/res/xml');
    const sourcePath = path.join(context.opts.projectRoot, 'network_security_config.xml');

    // Create directory if it doesn't exist
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
    }

    // Copy the network security config file
    if (fs.existsSync(sourcePath)) {
        const targetFile = path.join(targetPath, 'network_security_config.xml');
        fs.copyFileSync(sourcePath, targetFile);
        console.log('✅ Network Security Config copied successfully');
    } else {
        console.error('❌ network_security_config.xml not found in project root');
    }
};
