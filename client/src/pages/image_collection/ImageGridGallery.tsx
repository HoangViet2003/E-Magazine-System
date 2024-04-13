import { useState } from "react";
import { Gallery, Image } from "react-grid-gallery";
import ImageLightbox from "./ImageLightbox";
import useWindowWidth from "../../redux/hooks/useWindowWidth";

const ImageGridGallery: React.FC<{
  images: Image[];
  handleRemoveImage: (index: number) => void;
  isDeleteMode: boolean;
  handleUpdateImages: () => void;
}> = ({ images, handleRemoveImage, isDeleteMode, handleUpdateImages }) => {
  const [index, setIndex] = useState(-1);

  const currentImage = images[index];
  const nextIndex = (index + 1) % images.length;
  const nextImage = images[nextIndex] || currentImage;
  const prevIndex = (index + images.length - 1) % images.length;
  const prevImage = images[prevIndex] || currentImage;

  const windowWidth = useWindowWidth();

  const OnRemove = (index: number) => {
    handleRemoveImage(index);
  };

  const handleClick = (index: number) => {
    if (isDeleteMode) {
      //alert yes or no to delete
      alert("Are you sure you want to delete this image?");
      OnRemove(index);
      handleUpdateImages();
      return;
    }
    console.log("selected image", images[index]);
    setIndex(index);
  };
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  return (
    <div>
      <Gallery
        images={images}
        enableImageSelection={true}
        rowHeight={windowWidth > 768 ? 300 : 200}
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
};

export default ImageGridGallery;
