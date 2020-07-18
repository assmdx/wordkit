const {app} = require("electron")
const path = require('path')

function ployfill() {
    app.dock.setIcon(path.join(__dirname, '../../icon.mac.dock.png'));
}


module.exports = {
    ployfill
}