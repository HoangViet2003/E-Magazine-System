import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Quill from "quill";
import "quill/dist/quill.snow.css";

import io, { Socket } from "socket.io-client";

import "./textEditor.css";
import TextEditorHeader from "./TextEditorHeader";

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

  // useEffect(() => {
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
    // q.disable();
    // q.setText("Loading...");
    setQuill(q);
  }, []);

  return (
    <div>
      <TextEditorHeader />
      <div className="editor-container bg-[#f4f6fc]" ref={wrapperRef}></div>
    </div>
  );
}
