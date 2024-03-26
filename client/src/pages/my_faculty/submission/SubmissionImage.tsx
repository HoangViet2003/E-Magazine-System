import ImageGridGallery from "../../image_collection/ImageGridGallery";
import img from "../../../assets/Logo.png";
import { useEffect, useState } from "react";
import { Image } from "react-grid-gallery";

export default function SubmissionImage({ articles }) {
  const articleImg = articles.filter((article) => article.type === "image");
  const [imageCollection, setImageCollection] = useState<Image[]>([]);

  function getImgSize(
    imgSrc: string,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const newImg = new window.Image();

      newImg.onload = function () {
        resolve({ width: newImg.width, height: newImg.height });
      };

      newImg.src = imgSrc;
    });
  }

  useEffect(() => {
    // Map over articleImg, call getImgSize for each image, and update imageCollection
    Promise.all(
      articleImg.map((article) =>
        getImgSize(
          "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
        ),
      ),
    ).then((sizes) => {
      // sizes is an array of objects with width and height
      // Create an array of Image objects
      const updatedImageCollection = sizes.map((size, index) => ({
        src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
        width: size.width,
        height: size.height,
      }));

      // Update the state
      setImageCollection(updatedImageCollection);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Image collections
      </h3>

      <ImageGridGallery images={imageCollection} />
    </div>
  );
}
