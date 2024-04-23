import { useEffect, useRef, useState } from "react";
import { Image } from "react-grid-gallery";
import ImageGridGallery from "./ImageGridGallery";
import { useParams } from "react-router-dom";
import { useArticle } from "../../redux/hooks/useArticle";
import Spinner from "../../ui/Spinner";
import UpdateImages from "../../ui/UpdateImages";
import plusIcon from "./../../assets/icons/plusIcon.svg";
import trash from "./../../assets/icons/trash.svg";

const SubmissionImage = () => {
  const { id } = useParams<{ id: string }>();

  const { getArticleById, article, isLoading, updateArticle } = useArticle();
  const [imageCollection, setImageCollection] = useState<Image[]>([]);
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [title, setTitle] = useState("");
  const role = localStorage.getItem("role");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (id) {
        await getArticleById(id);
      }
    };
    fetchArticle();
  }, []);
  // Set title again if page refresh
  useEffect(() => {
    setTitle(article?.title || "");
  }, [article]);

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

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Create an array of Promises to get the sizes of uploaded images
    const imagePromises = files.map((file) =>
      getImgSize(URL.createObjectURL(file)),
    );

    // Wait for all image sizes to be fetched
    const sizes = await Promise.all(imagePromises);

    // Create an array of Image objects with URLs and sizes
    const newImages: Image[] = sizes.map((size, index) => ({
      src: URL.createObjectURL(files[index]), // Use object URL as source
      width: size.width,
      height: size.height,
    }));

    // Update imageCollection with the new images
    setImageCollection((prevImages) => [...prevImages, ...newImages]);

    // Update the state with the uploaded images
    setUploadImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSetImageCollection = (images: any) => {
    // setImageCollection(uploadImages.map((image, index) => ({ src: URL.createObjectURL(image), width: images[index].width, height: images[index].height })));

    //also set previous images
    setImageCollection((prevImages) => [
      ...prevImages,
      ...uploadImages.map((image, index) => ({
        src: URL.createObjectURL(image),
        width: images[index].width,
        height: images[index].height,
      })),
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImageCollection((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });

    setUploadImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleUpdateImages = () => {
    if (!id) {
      console.error("ID is undefined");
      return;
    }
    const formData = new FormData();

    uploadImages.map((image) => formData.append("files", image));
    imageCollection.map((image) => formData.append("content", image.src));
    formData.append("title", title);
    updateArticle(id, formData);
  };

  useEffect(() => {
    function handleUpdateTitle() {
      const form = new FormData();
      form.append("title", title);
      updateArticle(id ?? "", form);
    }
    const timeoutId = setTimeout(() => {
      if (title !== article?.title) handleUpdateTitle();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title]);

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

  if (isLoading) return <Spinner />;
  else
    return (
      <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
        <div className="mr-3 flex flex-row border-b-2 pb-3 max-md:flex-col max-md:gap-3 ">
          <div>
            <input
              className="w-fit rounded border border-transparent bg-transparent px-1 text-lg font-medium text-[#6B6C7E] outline-offset-2 outline-[#004AD7] hover:border-[#6B6C7E] disabled:border-none disabled:bg-slate-200"
              value={title || ""}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (inputRef.current) {
                    inputRef.current.blur();
                  }
                }
              }}
              disabled={role !== "student"}
              ref={inputRef}
            />
          </div>
          <div className="ml-auto flex flex-row gap-7 max-md:ml-0">
            <div className="flex flex-row gap-2">
              <button
                onClick={() => setOpenImageUpload(true)}
                className="flex flex-row gap-2"
              >
                <img src={plusIcon} alt="add" />
                Add
              </button>
              {openImageUpload && (
                <UpdateImages
                  type="image"
                  setOpenImageUpload={setOpenImageUpload}
                  handleAddImage={handleAddImage}
                  setImageCollection={setImageCollection}
                  setUploadImages={setUploadImages}
                  uploadImages={uploadImages}
                  handleSetImageCollection={handleSetImageCollection}
                  handleUpdateImages={handleUpdateImages}
                />
              )}
            </div>

            <div className="flex flex-row gap-2">
              <button
                className="flex flex-row gap-2 text-[#CA3636]"
                onClick={() => setIsDeleteMode(!isDeleteMode)}
              >
                <img src={trash} alt="add" />
                {isDeleteMode ? "Cancel" : "Delete"}
              </button>
            </div>
          </div>
        </div>

        <ImageGridGallery
          images={imageCollection}
          handleRemoveImage={handleRemoveImage}
          isDeleteMode={isDeleteMode}
          handleUpdateImages={handleUpdateImages}
        />
      </div>
    );
};

export default SubmissionImage;
