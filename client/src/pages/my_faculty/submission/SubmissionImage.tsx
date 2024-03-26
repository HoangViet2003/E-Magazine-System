import { useEffect, useState } from "react";
import { Image } from "react-grid-gallery";
import { Article } from "../../../redux/slices/ArticleSlice";

import ImageGridGallery from "../../image_collection/ImageGridGallery";

const SubmissionImage: React.FC<{ articles: Article[] }> = ({ articles }) => {
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
      articleImg.map((article) => getImgSize(article.content[0])),
    ).then((sizes) => {
      // sizes is an array of objects with width and height
      // Create an array of Image objects
      const updatedImageCollection = sizes.map((size, index) => ({
        src: articleImg[index].content[0],
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
};

export default SubmissionImage;
