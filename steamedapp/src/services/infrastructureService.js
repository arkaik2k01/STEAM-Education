// Firebase function endpoint 
const FIREBASE_ENDPOINT = 'FIREBASE_ENDPOINT_HERE';

/* This POST request will send a message to Firebase in order to create the simulation
* and compiler in the back end. This will return the endpoints for the simulation and compiler unique
* to the user ID.
*/
export const requestModuleSimulation = async (moduleId, userId) => {
  try {
    const response = await fetch(FIREBASE_ENDPOINT, {
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