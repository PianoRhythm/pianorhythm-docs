import React from 'react';

const Tooltip = ({text, tooltip}) => (
  <div className="tooltip">{text}
    <span className="tooltiptext">{tooltip}</span>
  </div>
);

export default Tooltip;