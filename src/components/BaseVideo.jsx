import React from 'react';

import Tooltip from './Tooltip';

const BaseVideo = ({src, version, width, height}) => (
  <>
    <div>
      <video className={"base-video"} width={width || "100%"} height={height || "100%"} controls>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Tooltip text={version} tooltip={`This video was taken in version: ${version}`} />
    </div>
    <br/>
  </>
);

export default BaseVideo;