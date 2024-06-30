import React from "react";
import LazyLoad from "react-lazyload";

interface ImageProps {
  src: string;
  alt: string;
  styleObj: any;
}

const LazyImage: React.FC<ImageProps> = ({ src, alt, styleObj }) => (
  <LazyLoad height={200} offset={1300} once>
    <img src={src} alt={alt} style={styleObj} />
  </LazyLoad>
);

export default LazyImage;
