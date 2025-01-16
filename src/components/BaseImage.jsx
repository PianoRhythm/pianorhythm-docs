import React from 'react';

export const BaseImage = (props) => (
  <div style={{display:"flex", justifyContent:"center", position: "relative"}}>
    <img className={"base-image"} src={props.src} alt={props.alt} style={{ background: props.background }}/>
    {props.children}
  </div>
);

export default BaseImage;