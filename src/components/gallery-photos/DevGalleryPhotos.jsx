import PhotoAlbum from "react-photo-album";
import { useState, useRef } from "react";

import Lightbox from "yet-another-react-lightbox";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Captions from "yet-another-react-lightbox/plugins/captions";

import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

const breakpoints = [3840, 2400, 1080, 640, 384, 256, 128, 96, 64, 48];

const photos = [
  { src: "0292cc984c9edba966137e62022c6f63.png", width: 1, height: 1, description: "Test" },
  { src: "0683163356f395d55649e4e2663f778e.png", width: 1, height: 1, },
  { src: "08147272f69e230afe1b262f74877cc2.png", width: 1, height: 1, },
  { src: "09bbc14e9cfbd3ed86ea1389e2415931.png", width: 1, height: 1, },
  { src: "0f18b0db0d0279e47eb1bdffadebd7b6.gif", width: 1, height: 1, },
  { src: "11a3b308ddf33c5a50a4b3f093891c12.png", width: 1, height: 1, },
  { src: "159432456be1434f88f672c2192644b7.gif", width: 1, height: 1, },
  { src: "1a833ad2191d92a7b3dc8c5b24b8e9a1.gif", width: 1, height: 1, },
  { src: "1cb6b9400816e5561998debb34680be7.gif", width: 1, height: 1, },
  { src: "21910f6a61c28b9f9f4795d3b47a1d75.gif", width: 1, height: 1, },
  { src: "2404b0078f95bfb400bbfc3f51f090a8.gif", width: 1, height: 1, },
  { src: "2cb5c31ae5274d8b323fc79949ad6be6.gif", width: 1, height: 1, },
  { src: "2fbc217501faaf39605032d0a68ec70a.gif", width: 1, height: 1, },
  { src: "2fed6d8a2efa56dfd1502d771a781bcb.gif", width: 1, height: 1, },
  { src: "30584769ef41484a824fa8ffa10877d0.png", width: 1, height: 1, },
  { src: "3663b6f61e7c0a5618c920b67d59990b.png", width: 1, height: 1, },
  { src: "375e26dac84d99a64c6b17ba2e335852.gif", width: 1, height: 1, },
  { src: "439e429ccb917287e45f9a586f70dab4.gif", width: 1, height: 1, },
  { src: "44142707314da45b2750f51a0aa72e28.gif", width: 1, height: 1, },
  { src: "44de0233c46dba0e0b2626ce0f5a24b3.gif", width: 1, height: 1, },
  { src: "45f6e3d3edd45d670f298ddc91130f9a.png", width: 1, height: 1, },
  { src: "47ade8d0fc2bddc22a4c53fbcc1a40da.gif", width: 1, height: 1, },
  { src: "4b6ad294c6f43a782c5d95e4cb3045be.gif", width: 1, height: 1, },
  { src: "54041e4365f1d4075ef46416a76d18c9.png", width: 1, height: 1, },
  { src: "558e34dc1079127779aaf8a05a530027.jpg", width: 1, height: 1, },
  { src: "57c1beba75e34c73431f5360c2aa8c90.png", width: 1, height: 1, },
  { src: "58d09bb2e3cbf89f839cd079526fda95.png", width: 1, height: 1, },
  { src: "5c36b0a0faaca4f083b699f12697b6de.png", width: 1, height: 1, },
  { src: "5ca0121f637bba218472f6bbf02c370b.png", width: 1, height: 1, },
  { src: "65af80c28385df8785e6c81960cc59f0.png", width: 1, height: 1, },
  { src: "689b36ef04b9be7a762ce19d7e9efd92.gif", width: 1, height: 1, },
  { src: "691698e65ff16bc50e5a0b457d66b5ae.png", width: 1, height: 1, },
  { src: "6dac2281717e3f852ef2e5567b240229.png", width: 1, height: 1, },
  {
    src: "6dbd46dd0d31ff13c5c434ef6bd72178.png", width: 1, height: 1,
    description: "An early prototype of PianoRhythm."
  },
  { src: "6f68574ca94098b865222c82a825dd5b.gif", width: 1, height: 1, },
  { src: "6fed8d7e4a0dcc83c51b072313d89531.png", width: 1, height: 1, },
  { src: "73b0b65543757a8538ec87d81ba13577.png", width: 1, height: 1, },
  { src: "74f0278f8e7ba08a84db1c70bb205372.gif", width: 1, height: 1, },
  { src: "77b26791b4fb221893a2819d15efead2.gif", width: 1, height: 1, },
  { src: "7bd2a5e06615e1a2981b4ce8bd926190.gif", width: 1, height: 1, },
  { src: "7e11d5ef1341fff776832ef4629c7bf3.gif", width: 1, height: 1, },
  { src: "814c639c029ea65e36048c2ebffc8080.png", width: 1, height: 1, },
  { src: "82b07d7ecc89ffcb96abc8e3497a586b.png", width: 1, height: 1, },
  { src: "82e5ecb0596602b3c0ad4ed3a8f24002.png", width: 1, height: 1, },
  {
    src: "8eb595468cf8e168ea9159c48b850335.gif", width: 1, height: 1,
    description: "An early prototype of PianoRhythm."
  },
  { src: "919b8f47a18310a8240372215b1736b8.gif", width: 1, height: 1, },
  { src: "925ea4ec900682ffa384a2ee95f02d97.png", width: 1, height: 1, },
  { src: "9489f5ae4b45fbf90dd30ac58ff01610.gif", width: 1, height: 1, },
  { src: "968f2b3b869fc181bd4909b088d67e37.png", width: 1, height: 1, },
  { src: "9954374288e42035bc99f6c12392dba5.gif", width: 1, height: 1, },
  { src: "9c46e62ba75d1a1f6e71465cfba83858.gif", width: 1, height: 1, },
  { src: "a5542aaba5f672b600dbaa6712796377.gif", width: 1, height: 1, },
  { src: "a78c4007e811d3aee37d04eb2e8418c3.gif", width: 1, height: 1, },
  { src: "a88229209e73038d0d1a282ffb47524f.png", width: 1, height: 1, },
  { src: "a999ac3927b52115185cc37d2e5db682.png", width: 1, height: 1, },
  { src: "aa23e2d45c94b70b99918e81e9247488.gif", width: 1, height: 1, },
  { src: "b0cebfe19f61be3d27b43d8d2a434471.gif", width: 1, height: 1, },
  { src: "b0d964f7bfa443b34ae9d60e10b6f03e.png", width: 1, height: 1, },
  { src: "b29e01f43bbd202f2709cd05b045cce3.gif", width: 1, height: 1, },
  { src: "b60acf56633c7200fba3bf6a5840cb27.png", width: 1, height: 1, },
  { src: "b8efb4c8108907a21362f9a1bc862bd5.png", width: 1, height: 1, },
  { src: "ba3463ef6952c2465e9fd7c719d98186.gif", width: 1, height: 1, },
  { src: "bc6e2dc3ee69b60b08487038dc2013fa.png", width: 1, height: 1, },
  { src: "bd19dc62f0a0cc8fb39a869220cebe95.gif", width: 1, height: 1, },
  { src: "c1a51b4d844f8f24fd1f7940b532e000.png", width: 1, height: 1, },
  { src: "c87a9daaafb39965ffe04a9ab03cf775.png", width: 1, height: 1, },
  { src: "c8c9018e8176c59a7edb7e77f0d7ea07.gif", width: 1, height: 1, },
  { src: "ccd42841046cd1be3d3d2ac997b4f93a.png", width: 1, height: 1, },
  { src: "d25129dc339921e2e5f0b392f4a9019a.gif", width: 1, height: 1, },
  { src: "d4d724a8873f6da2fc9fb851134089b0.gif", width: 1, height: 1, },
  { src: "dc3848c641138aed32bcaf6746d53401.gif", width: 1, height: 1, },
  { src: "de832c6d1e64aeb60e8c0688129e8b79.png", width: 1, height: 1, },
  { src: "df34394c7b4c87f3e8d14bec4e57d353.png", width: 1, height: 1, },
  { src: "edac9d3d36cd45cf8c9bb8d7b2edb1ab.gif", width: 1, height: 1, },
  { src: "ee1f76550446c167d6d59859f49c0bc5.png", width: 1, height: 1, },
  { src: "efe6e6d5c8dda769990427aa28f16996.gif", width: 1, height: 1, },
  { src: "f257c94f45cdf3557049148945eb1a82.gif", width: 1, height: 1, },
  { src: "f26fc8b02945856417eb97e9769cfd6d.png", width: 1, height: 1, },
  { src: "fd0d88fb2be06ecf3b7fba67835eae31.gif", width: 1, height: 1, },
  { src: "ae5edd6a128157a7f03ee0e97c06647d.gif", width: 1, height: 1, },
]
  .map(photo => ({ ...photo, width: 960, height: 576 }))
  .map(photo => {
    const width = breakpoints[0];
    const height = (photo.height / photo.width) * width;

    return {
      ...photo,
      width,
      height,
      src: `/img/dev-gallery/${photo.src}`,
      srcSet: breakpoints.map((breakpoint) => {
        const height = Math.round((photo.height / photo.width) * breakpoint);
        return {
          src: `/img/dev-gallery/${photo.src}`,
          width: breakpoint,
          height,
        };
      }),
    };
  });

export default function Gallery() {
  const [index, setIndex] = useState(-1);
  const captionsRef = useRef(null);

  return <>
    <PhotoAlbum
      layout="columns"
      photos={photos}
      targetRowHeight={150} onClick={({ index }) => setIndex(index)}
    />

    <Lightbox
      slides={photos}
      open={index >= 0}
      index={index}
      close={() => setIndex(-1)}
      captions={{ ref: captionsRef }}
      // enable optional lightbox plugins
      plugins={[Fullscreen, Zoom, Counter, Captions]}
    />
  </>;
}