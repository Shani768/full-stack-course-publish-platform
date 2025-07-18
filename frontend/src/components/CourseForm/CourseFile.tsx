import { Pencil } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { z } from "zod";

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface CourseFileProps {
  courseId: string;
  attachments: Attachment[];
}

const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;


// ✅ Zod schema for file validation
const fileSchema = z
  .instanceof(File)
  .refine(file => file.size <= 10 * 1024 * 1024, {
    message: "File must be less than 10MB",
  })
  .refine(file => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "video/mp4", "image/png", "image/jpeg"];
    return allowed.includes(file.type);
  }, {
    message: "Unsupported file format",
  });

const CourseFile: React.FC<CourseFileProps> = ({ courseId, attachments }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditingFile, setIsEditingFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = fileSchema.safeParse(file);
      if (!result.success) {
        setFileError(result.error.issues[0].message);
        setSelectedFile(null);
        return;
      }

      setFileError(null);
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setFileError("No file selected");
      return;
    }

    const validation = fileSchema.safeParse(selectedFile);
    if (!validation.success) {
      setFileError(validation.error.issues[0].message);
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        formData
      );

      const fileUrl = cloudinaryRes.data.secure_url;
      const fileName = selectedFile.name;

      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/courses/attachments`,
        {
          name: fileName,
          url: fileUrl,
          courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("File uploaded successfully!");
      setSelectedFile(null);
      setIsEditingFile(false);
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#f4f8fb] p-8 rounded mt-8 shadow-sm">
      <div className="font-semibold mb-1">Course File</div>

      {isEditingFile ? (
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.png,.jpg"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded text-sm"
          />

          {fileError && <p className="text-sm text-red-600">{fileError}</p>}

          {selectedFile && !fileError && (
            <p className="text-sm text-gray-600">
              Selected: <strong>{selectedFile.name}</strong>
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditingFile(false)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-black text-white px-4 py-2 rounded text-sm"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">
            {selectedFile ? selectedFile.name : "No file selected"}
          </span>
          <button
            onClick={() => setIsEditingFile(true)}
            className="text-sm text-black hover:underline flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit file
          </button>
        </div>
      )}

      {attachments.length > 0 ? (
        <ul className="text-sm text-gray-700 space-y-2 mt-4">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between border rounded px-3 py-2 bg-white"
            >
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mt-4">
          No attachments uploaded yet.
        </p>
      )}
    </div>
  );
};

export default CourseFile;
