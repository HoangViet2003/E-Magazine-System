import { useState } from "react";
import PrevIcon from "../../assets/icons/angle-left-svgrepo-com.svg";
import NextIcon from "../../assets/icons/angle-right-svgrepo-com.svg";
import { CustomImage } from "../../utils/images";

export default function ImageLightbox({
  currentImage,
  nextImage,
  prevImage,
  handleClose,
  handleMovePrev,
  handleMoveNext,
}: {
  currentImage: CustomImage;
  nextImage: CustomImage;
  prevImage: CustomImage;
  handleClose: () => void;
  handleMovePrev: () => void;
  handleMoveNext: () => void;
}) {
  const [middle, setMiddle] = useState("left-2/4 -translate-x-2/4");
  const [left, setLeft] = useState("-left-full opacity-0");
  const [right, setRight] = useState("left-full opacity-0");
  const [count, setCount] = useState(0);

  const [middleImage, setMiddleImage] = useState(currentImage);
  const [leftImage, setLeftImage] = useState(prevImage);
  const [rightImage, setRightImage] = useState(nextImage);

  function handleClickRight() {
    handleMoveNext();
    setLeft(right);
    setMiddle(left);
    setRight(middle);

    if (count % 3 === 0) setRightImage(nextImage);
    if (count % 3 === 1) setLeftImage(nextImage);
    if (count % 3 === 2) setMiddleImage(nextImage);

    setCount(count + 1);
    if (count > 4) setCount(0);
  }

  function handleClickLeft() {
    handleMovePrev();
    setLeft(middle);
    setMiddle(right);
    setRight(left);

    if (count % 3 === -1) setRightImage(prevImage);
    if (count % 3 === 0) setLeftImage(prevImage);
    if (count % 3 === -2) setMiddleImage(prevImage);

    setCount(count - 1);
    if (count < -4) setCount(0);
  }

  return (
    <div className="fixed left-0    top-0 flex h-screen w-screen items-center justify-between overflow-hidden">
      <div
        className="absolute right-0 top-0 -z-10 h-screen w-screen bg-black opacity-80"
        onClick={handleClose}
      ></div>

      <button
        className="z-10 h-52 w-20 opacity-50 duration-300 hover:opacity-100"
        onClick={handleClickLeft}
      >
        <img src={PrevIcon} alt="Previous" />
      </button>

      <img
        src={leftImage.src}
        alt="img"
        className={`absolute w-auto duration-500 ${left}`}
        style={{ maxWidth: "90%", maxHeight: "90%" }}
      />

      <img
        src={middleImage.src}
        alt="img"
        className={`absolute w-auto duration-500 ${middle}`}
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
        }}
      />

      <img
        src={rightImage.src}
        alt="img"
        className={`absolute w-auto duration-500 ${right}`}
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
        }}
      />

      <button
        className="z-10 h-52 w-20 opacity-50 duration-300 hover:opacity-100"
        onClick={handleClickRight}
      >
        <img src={NextIcon} alt="Next" />
      </button>
    </div>
  );
}
