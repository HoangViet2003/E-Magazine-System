import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useArticle } from "../redux/hooks";

import { useSidebarContext } from "../layout/sidebar/SidebarContext";
import DropComponent from "./DropComponent";
import SpinnerMini from "./SpinnerMini";

interface UpdateImagesProps {
    type: string;
    handleAddImage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    setOpenImageUpload: (isOpen: boolean) => void;
    setImageCollection: (images: any[]) => void;
    setUploadImages?: (images: File[]) => void;
    uploadImages?: any[] | undefined;
    handleSetImageCollection?: (images: any[]) => void;
}

export default function UploadImage({ type, setOpenImageUpload, setUploadImages, uploadImages, handleSetImageCollection }: UpdateImagesProps) {
    // const { setOpenImageUpload } = useSidebarContext();

    const { isLoading: loadingArticle } = useArticle();
    const [previews, setPreviews] = useState<string[]>([]);
    const [title, setTitle] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            if (type === "image") {
                setUploadImages?.(acceptedFiles);

                acceptedFiles.forEach((file) => {
                    if (file.type === "image/jpeg" || file.type === "image/png") {
                        const reader = new FileReader();
                        reader.onload = () => {
                            setPreviews((prevPreviews) => [
                                ...prevPreviews,
                                reader.result as string,
                            ]);
                        };

                        reader.readAsDataURL(file);
                    } else {
                        console.error(
                            "Invalid file type. Only JPEG and PNG images are accepted.",
                        );
                    }
                });
            }
        }
    }, []);


    const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
        useDropzone({
            onDrop,
            multiple: true,
        });

    async function handleOnSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        if (typeof acceptedFiles[0] === "undefined") return;

        handleSetImageCollection?.(uploadImages ?? []);
        setOpenImageUpload(false);
    }

    return (
        <>
            <div className="fixed left-2/4 top-2/4 z-50 h-[620px] w-[540px] -translate-x-2/4 -translate-y-2/4 bg-white px-10 py-7 shadow-md">
                <form className="h-full" onSubmit={handleOnSubmit}>
                    <div
                        className={
                            "grid h-full gap-[30px]" +
                            (type === "image"
                                ? " grid-rows-[auto_auto_1fr_auto]"
                                : " grid-rows-[auto_1fr_auto]")
                        }
                    >
                        <h1 className="text-center text-2xl font-semibold">Upload</h1>



                        <div
                            className={
                                "flex items-center justify-center rounded border border-dashed h-[400px]" +
                                (type === "image"
                                    ? " border-[#384EB74D] bg-[#F8F8FF]"
                                    : " border-[#386fb74d] bg-[#b9cbfa4d]")
                            }
                        >
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <DropComponent
                                        isDragActive={isDragActive}
                                        previews={previews}
                                        type={type}
                                    />
                                ) : (
                                    <DropComponent
                                        isDragActive={isDragActive}
                                        previews={previews}
                                        type={type}
                                    />
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={
                                typeof acceptedFiles[0] === "undefined"

                            }
                            className={
                                (type === "image" ? "bg-[#483EA8]" : "bg-[#004AD7]") +
                                " rounded p-3 font-semibold text-white opacity-50 duration-300 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 "
                            }
                        >
                            {loadingArticle ? (
                                <SpinnerMini />
                            ) : "Add New Image"}
                        </button>
                    </div>
                </form>
            </div>

            <div
                className="fixed left-0 top-0 h-screen w-screen bg-black opacity-30"
                onClick={() => {
                    setOpenImageUpload(false);
                    setPreviews([]);
                }}
            ></div>
        </>
    );
}
