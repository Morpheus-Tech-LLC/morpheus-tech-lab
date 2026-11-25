// main.js

// Roboto Mono, served with the site from npm (@fontsource), never from Google's servers: a font
// fetched from a third party hands it every visitor's IP address
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/600.css';
import { state } from './state.js';
import { initSimulation } from './simulationModel.js';
import { initControls } from './controls.js';
import { startFromSetup } from './explore/hud.js';
import { animate } from './time.js';

// The lab opens in Explore, which streams from a Worker, with the settings its HUD boxes hold
// (state.explore); the other modes precompute
(async () => {
    if (state.simulationMode === 'explore') {
        initControls();
        startFromSetup();
    } else {
        await initSimulation();
    }
    animate();
})();
