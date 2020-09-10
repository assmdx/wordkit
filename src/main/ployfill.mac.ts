import { app } from 'electron';
import path from 'path';

export const ployfill = () => {
    app.dock.setIcon(path.join(__dirname, '../../icon.mac.dock.png'));
};
