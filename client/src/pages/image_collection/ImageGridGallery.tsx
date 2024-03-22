import { useState } from "react";
import { Gallery } from "react-grid-gallery";
import { images } from "../../utils/images";
import "react-image-lightbox/style.css";
import ImageLightbox from "./ImageLightbox";

export default function ImageGridGallery() {
  const [index, setIndex] = useState(-1);

  const currentImage = images[index];
  const nextIndex = (index + 1) % images.length;
  const nextImage = images[nextIndex] || currentImage;
  const prevIndex = (index + images.length - 1) % images.length;
  const prevImage = images[prevIndex] || currentImage;

  const handleClick = (index: number, item: CustomImage) => setIndex(index);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  return (
    <div>
      <Gallery
        images={images}
        enableImageSelection={false}
        rowHeight={300}
        onClick={handleClick}
      />

      {currentImage && (
        <ImageLightbox
          currentImage={currentImage}
          nextImage={nextImage}
          prevImage={prevImage}
          handleClose={handleClose}
          handleMovePrev={handleMovePrev}
          handleMoveNext={handleMoveNext}
        />
      )}
    </div>
  );
}
