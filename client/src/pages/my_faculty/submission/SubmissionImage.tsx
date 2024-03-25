import ImageGridGallery from "../../image_collection/ImageGridGallery";
import img from "../../../assets/Logo.png";
import { useEffect } from "react";

export default function SubmissionImage() {
  function getImgSize(imgSrc) {
    const newImg = new Image();

    newImg.onload = function () {
      const height = newImg.height;
      const width = newImg.width;
    };

    newImg.src = imgSrc;
  }

  useEffect(() => {
    getImgSize(img);
  }, []);

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Image collections
      </h3>

      <ImageGridGallery />
    </div>
  );
}
