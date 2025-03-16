// IaC function endpoint
// 'https://steam-iac-pulumi-function-104577670307.us-central1.run.app/';
const IaC_ENDPOINT = 'IAC_ENDPOINT HERE'

/* 
* This POST request will send a message to IaC in order to create the simulation
* and compiler in the back end. This will return the endpoints for the simulation and compiler unique
* to the user ID.
*/

export const requestModuleSimulation = async (moduleId, userId) => {
  try {
    console.log(`Requesting infrastructure for module: ${moduleId}, user: ${userId}`);

    const response = await fetch(IaC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        moduleId,
        userId 
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to request infrastructure: ${response.status}`);
    }

    // Parse the response to get the endpoints
    const data = await response.json();
    
    return {
      simulationEndpoint: data.simulationEndpoint,
      compilerEndpoint: data.compilerEndpoint
    };
  } catch (error) {
    console.error('Simulation and Compiler request failed:', error);
    throw error;
  }
};