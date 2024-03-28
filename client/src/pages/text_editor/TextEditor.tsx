import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import io, { Socket } from "socket.io-client";
import "./textEditor.css";
import TextEditorHeader from "./TextEditorHeader";
import { useArticle } from "../../redux/hooks";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Spinner from "../../ui/Spinner";
import Sekeleton from "../../components/sekeleton/Sekeleton";
import ReactDOM from "react-dom";


const SAVE_INTERVAL_MS = 2000;

const TOOLBAR_OPTION = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState<Socket | undefined>();
  const [quill, setQuill] = useState<Quill | null>(null);
  const { article, getArticleById, updateArticle, isLoading } = useArticle();

  const id = window.location.pathname.split("/")[2];

  useEffect(() => {
    getArticleById(id);
  }, []);

  //   const s = io("http://localhost:3001");
  //   setSocket(s);

  //   return () => {
  //     s.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!socket || !quill) return;

  //   socket.once("load-document", (document) => {
  //     quill.setContents(document);
  //     quill.enable();
  //   });

  //   socket.emit("get-document", documentId);
  // }, [socket, quill, documentId]);

  // // Save data
  // useEffect(() => {
  //   if (socket == null || quill == null) return;

  //   const interval = setInterval(() => {
  //     socket.emit("save-document", quill.getContents());
  //   }, SAVE_INTERVAL_MS); // save every 2s

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [quill, socket]);

  // useEffect(() => {
  //   if (socket == null || quill == null) return;

  //   const handler = (delta: any) => {
  //     quill.updateContents(delta);
  //   };

  //   socket.on("receive-changes", handler);

  //   return () => {
  //     socket.off("receive-changes", handler);
  //   };
  // }, [socket, quill]);

  // useEffect(() => {
  //   if (socket == null || quill == null) return;

  //   const handler = (delta: any, oldContents: any, source: string) => {
  //     if (source !== "user") return;
  //     socket.emit("send-changes", delta);
  //   };

  //   quill.on("text-change", handler);

  //   return () => {
  //     quill.off("text-change", handler);
  //   };
  // }, [socket, quill]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper === null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTION },
    });


    if (article?.content && Array.isArray(article.content) && article.content.length > 0) {
      // Take the first element of article.content
      const content = article.content[0];
      // Set the content of the Quill editor
      q.root.innerHTML = content;
    } else {
      q.setText("Loading..."); // Show loading text if no content yet

      //show skeleton


      // <Sekeleton />;
 

    }
    // q.disable();
    // q.setText("Loading...");
    setQuill(q);
  }, [article.content]);

  const handleUpdateDocument = () => {
    if (!quill || !quill.root) {
      toast.error("Quill editor not initialized");
      return;
    }

    const updatedContent = quill.root.innerHTML;
    const formData = new FormData();
    formData.append("content", updatedContent);
    formData.append("type", String(article.type));
    formData.append("title", String(article.title));

    updateArticle(article._id, formData)

  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
      <TextEditorHeader title={article?.title || ''} handleUpdateDocument={handleUpdateDocument} isLoading={isLoading}/>
      {isLoading ? <Spinner /> : <div className="editor-container bg-[#f4f6fc]" ref={wrapperRef}></div>} 
      
    </div>
  );
}
