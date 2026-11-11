// main.js

import { state } from './state.js';
import { initSimulation } from './simulationModel.js';
import { initControls } from './controls.js';
import { startExplore, landingConfig } from './explore/explore.js';
import { animate } from './time.js';

// The lab opens in Explore, which streams from a Worker; the other modes precompute
(async () => {
    if (state.simulationMode === 'explore') {
        initControls();
        startExplore(landingConfig());
    } else {
        await initSimulation();
    }
    animate();
})();
