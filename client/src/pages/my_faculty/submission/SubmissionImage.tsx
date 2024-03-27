import { useEffect, useState } from "react";
import { Image } from "react-grid-gallery";
import { Article } from "../../../redux/slices/ArticleSlice";

import ImageGridGallery from "../../image_collection/ImageGridGallery";
import { useParams } from "react-router-dom";
import { useArticle } from "../../../redux/hooks/useArticle";

const SubmissionImage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article>();

  const { getArticleById } = useArticle();
  const [imageCollection, setImageCollection] = useState<Image[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (id) {
        const article = await getArticleById(id);

        setArticle(article);
      }
    };

    fetchArticle();
  }, [id]);

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

      <ImageGridGallery images={imageCollection} />
    </div>
  );
};

export default SubmissionImage;
