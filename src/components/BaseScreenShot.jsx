import React from 'react';

import BaseImage from './BaseImage';
import Tooltip from './Tooltip';

const BaseScreenShot = ({src, version, alt}) => (
  <>
    <BaseImage src={src} alt={alt}>
      <div style={{
        position: "absolute",
        fontSize: "12px",
        color: "gray",
        right: 20,
        bottom: -25
      }}>
        <Tooltip text={version} tooltip={`This screenshot was taken in version: ${version}`} />
      </div>
    </BaseImage>
    <br/>
  </>
);

export default BaseScreenShot;