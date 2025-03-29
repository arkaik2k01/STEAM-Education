// IaC function endpoint
// 'https://steam-iac-pulumi-function-104577670307.us-central1.run.app/';
const IaC_ENDPOINT = 'IAC_ENDPOINT HERE'

/* 
* This function triggers the creation of the back end apps for the module, being the Gazebo image,
* the compiler for the code, as well as the interactive terminal if needed for the module.
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

    // Parse the success message from the back end
    const data = await response.json();
    
    console.log('Simulation and Compiler request successful:', data);
    return;
  } catch (error) {
    console.error('Simulation and Compiler request failed:', error);
    throw error;
  }
};