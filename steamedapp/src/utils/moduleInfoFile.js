/*
 * Module Configuration
 * 
 * This file provides configuration settings for modules in the application.
 * It can be updated manually as new modules are added.
 */

// List of module IDs that don't require backend infrastructure
export const noInfrastructureModules = [
    "fSNc1KOE51VQyEYNTYKA",  // Module 1: Basic Python
  ];
  
  /*
   * Check if a module requires infrastructure deployment
   */
  export const requiresInfrastructure = (moduleId) => {
    return !noInfrastructureModules.includes(moduleId);
  };

  export const moduleConfig = {
    requiresInfrastructure,
    noInfrastructureModules
  };
  
  export default moduleConfig;