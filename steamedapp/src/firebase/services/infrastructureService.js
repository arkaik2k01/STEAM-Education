// Infrastructure service endpoints
const DEPLOY_ENDPOINT = 'https://steam-iac-pulumi-function-104577670307.us-central1.run.app/deploy';
const DESTROY_ENDPOINT = 'https://steam-iac-pulumi-function-104577670307.us-central1.run.app/destroy';

/* 
 * This function triggers the creation of the back end apps for the module, being the Gazebo image,
 * the compiler for the code, as well as the interactive terminal if needed for the module.
 */

export const deployModuleInfrastructure = async (moduleId, userId) => {
  try {
    console.log(`Deploying infrastructure for module: ${moduleId}, user: ${userId}`);

    const response = await fetch(DEPLOY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        user_id: userId,
        module_id: moduleId 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Deployment failed with status ${response}`);
      throw new Error(`Failed to deploy infrastructure: ${response}`);
    }

    // Parse the success message from the backend
    const data = await response.json();
    console.log('Infrastructure deployment successful:', data);
    return true;
  } catch (error) {
    console.error('Infrastructure deployment failed:', error);
    throw error;
  }
};

/*
 * Destroys backend resources for a user
 * Should be called when navigating away from a module page
 */
export const destroyModuleInfrastructure = async (userId) => {
  try {
    console.log(`Destroying infrastructure for user: ${userId}`);

    const response = await fetch(DESTROY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        user_id: userId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Infrastructure destruction failed with status ${response}`);
      return false;
    }

    // Parse the success message from the backend
    const data = await response.json();
    console.log('Infrastructure destruction successful:', data);
    return true;
  } catch (error) {
    console.warn('Infrastructure destruction failed:', error);
    return false; // Return false but don't throw - can't do much if destruction fails
  }
};