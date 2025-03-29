import React from 'react';

export const TeleopControls = ({ sendKeystroke, disabled = false }) => {
    // Array of control buttons with their labels, keycodes, and descriptions
    const controlButtons = [
      // Movement controls (main grid)
      { key: 'i', label: '↑', description: 'Forward', className: 'col-start-2', group: 'movement' },
      { key: 'j', label: '←', description: 'Turn Left', className: '', group: 'movement' },
      { key: 'k', label: '●', description: 'Stop', className: '', group: 'movement' },
      { key: 'l', label: '→', description: 'Turn Right', className: '', group: 'movement' },
      { key: ',', label: '↓', description: 'Backward', className: 'col-start-2', group: 'movement' },
      
      // Speed controls (separate section)
      { key: 'q', label: 'Q', description: 'Increase max speeds', className: '', group: 'speed' },
      { key: 'z', label: 'Z', description: 'Decrease max speeds', className: '', group: 'speed' },
      { key: 'w', label: 'W', description: 'Increase linear speed', className: '', group: 'speed' },
      { key: 'x', label: 'X', description: 'Decrease linear speed', className: '', group: 'speed' },
      { key: 'e', label: 'E', description: 'Increase angular speed', className: '', group: 'speed' },
      { key: 'c', label: 'C', description: 'Decrease angular speed', className: '', group: 'speed' },
    ];
  
    // Filter buttons by group
    const movementButtons = controlButtons.filter(btn => btn.group === 'movement');
    const speedButtons = controlButtons.filter(btn => btn.group === 'speed');
  
    // Create button element
    const renderButton = (button) => (
      <button
        key={button.key}
        onClick={() => sendKeystroke(button.key)}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                  disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed
                  ${button.className}`}
        disabled={disabled}
        title={button.description}
        aria-label={button.description}
      >
        {button.label}
      </button>
    );
  
    return (
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-white text-lg font-medium mb-4">Robot Controls</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Movement controls */}
          <div>
            <h4 className="text-white text-sm font-medium mb-2">Movement</h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {movementButtons.map(renderButton)}
            </div>
          </div>
          
          {/* Speed controls */}
          <div>
            <h4 className="text-white text-sm font-medium mb-2">Speed Adjustment</h4>
            <div className="grid grid-cols-2 gap-2">
              {speedButtons.map(renderButton)}
            </div>
          </div>
        </div>
        
        {/* Keyboard legend */}
        <div className="mt-4 p-3 bg-gray-800 bg-opacity-50 rounded-md text-xs text-gray-300">
          <p className="font-medium mb-1">Keyboard Controls:</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            <li><span className="text-white font-mono">i</span>: move forward</li>
            <li><span className="text-white font-mono">,</span>: move backward</li>
            <li><span className="text-white font-mono">j</span>: turn left</li>
            <li><span className="text-white font-mono">l</span>: turn right</li>
            <li><span className="text-white font-mono">k</span>: stop</li>
            <li><span className="text-white font-mono">q/z</span>: increase/decrease max speeds</li>
            <li><span className="text-white font-mono">w/x</span>: increase/decrease linear speed</li>
            <li><span className="text-white font-mono">e/c</span>: increase/decrease angular speed</li>
          </ul>
        </div>
      </div>
    );
  };