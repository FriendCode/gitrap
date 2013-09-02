var path = require("path");

exports.config = {
    // Base directory for the application
    "base": __dirname,
    "baseUrl": "/gitrap/",

    // Application name
    "name": "Gitrap",

    // Mode debug
    "debug": true,

    // Main entry point for application
    "main": "main",

    // Build output directory
    "build": path.resolve(__dirname, "build"),

    // Static files mappage
    "static": {
        "templates": path.resolve(__dirname, "resources", "templates"),
        "images": path.resolve(__dirname, "resources", "images")
    },

    // Stylesheet entry point
    "style": path.resolve(__dirname, "stylesheets/main.less"),

    // Shim
    "shim": {
        "vendors/base64": {
            exports: "Base64"
        },
        "vendors/markdown": {
            exports: "markdown"
        }
    },
};