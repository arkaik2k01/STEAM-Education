import React from 'react';

const InfrastructureLoadingScreens = ({ loadingPhase }) => {
  // Loading phases:
  // 1 - Setting up infrastructure in the cloud
  // 2 - Linking simulation and code to the website
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="text-center p-6 max-w-lg">
        {loadingPhase === 1 ? (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Setting up simulations and code infrastructure in the cloud...
            </h2>
            <p className="text-gray-300">
              This process may take a few moments. Please wait.
            </p>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Linking simulation and code to the website
            </h2>
            <p className="text-gray-300 mb-4">
              This might take a couple minutes...
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfrastructureLoadingScreens;