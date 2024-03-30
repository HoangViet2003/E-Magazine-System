import { useEffect, useState } from "react";
import { Image } from "react-grid-gallery";
import ImageGridGallery from "./ImageGridGallery";
import { useParams } from "react-router-dom";
import { useArticle } from "../../redux/hooks/useArticle";
import Spinner from "../../ui/Spinner";

const SubmissionImage = () => {
  const { id } = useParams();

  const { getArticleById, article, isLoading } = useArticle();
  const [imageCollection, setImageCollection] = useState<Image[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (id) {
        await getArticleById(id);
      }
    };

    fetchArticle();
  }, [id]);

  console.log("article in sb",article)

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
    if (article) {
      // Map over articleImg, call getImgSize for each image, and update imageCollection
      Promise.all(
        article?.content?.map((image) => getImgSize(image)) || [],
      ).then((sizes: { width: number; height: number }[]) => {
        // sizes is an array of objects with width and height
        // Create an array of Image objects
        const updatedImageCollection = sizes.map((size, index) => ({
          src: article.content[index],
          width: size.width,
          height: size.height,
        }));

        // Update the state
        setImageCollection(updatedImageCollection);
      });
    }
  }, [article]);

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Image collections
      </h3>

      {isLoading ? <Spinner /> : <ImageGridGallery images={imageCollection} />}
    </div>
  );
};

export default SubmissionImage;
