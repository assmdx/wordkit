const {app} = require("electron")
const path = require('path')

function ployfill() {
    app.dock.setIcon(path.join(__dirname, '../../icon.512x512.png'));
}


module.exports = {
    ployfill
}