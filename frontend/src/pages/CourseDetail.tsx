import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlayCircle, FaCheckCircle } from "react-icons/fa";

import CustomVideoPlayer from "../components/cloudinary/HLS";

interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  userProgress?: {
    isCompleted: boolean;
  }[];
}

interface CourseDetailData {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  chapters: Chapter[];
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/courses/${id}/detail`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse(res.data);
      } catch (error) {
        console.error("Failed to load course detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourseDetail();
  }, [id]);

  useEffect(() => {
    if (course) {
      const chapterIdFromUrl = searchParams.get("chapter-id");
      if (chapterIdFromUrl) {
        const found = course.chapters.find((ch) => ch.id === chapterIdFromUrl);
        if (found) setSelectedChapter(found);
      } else {
        setSelectedChapter(null);
      }
    }
  }, [course, searchParams]);

  const handleMarkComplete = async () => {
    if (!selectedChapter) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:5000/api/chapters/${selectedChapter.id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Chapter marked as completed");

      // Update progress locally
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              chapters: prev.chapters.map((ch) =>
                ch.id === selectedChapter.id
                  ? { ...ch, userProgress: [{ isCompleted: true }] }
                  : ch
              ),
            }
          : prev
      );
    } catch (error) {
      console.error("Error marking progress:", error);
      toast.error("Failed to mark as completed");
    }
  };

  if (loading) return <div className="p-6">Loading course...</div>;
  if (!course) return <div className="p-6 text-red-500">Course not found</div>;

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-4">{course.title}</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 border border-gray-200 rounded-md">
          {/* Overview Button */}
          <button
            onClick={() => {
              setSelectedChapter(null);
              setSearchParams({});
            }}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 border-b ${
              selectedChapter === null
                ? "bg-blue-50 border-l-4 border-blue-500 font-medium text-blue-800"
                : "hover:bg-gray-100"
            }`}
          >
            <FaPlayCircle className="text-blue-500" />
            <span className="capitalize text-sm">overview</span>
          </button>

          {/* Chapters List */}
          {course.chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => {
                setSelectedChapter(chapter);
                setSearchParams({ "chapter-id": chapter.id });
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-2 border-b ${
                selectedChapter?.id === chapter.id
                  ? "bg-blue-50 border-l-4 border-blue-500 font-medium text-blue-800"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaPlayCircle className="text-blue-500" />
              <span className="capitalize text-sm">{chapter.title}</span>
              {chapter.userProgress?.[0]?.isCompleted && (
                <FaCheckCircle className="ml-auto text-green-500" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {!selectedChapter ? (
            <>
              {course.imageUrl && (
                <div className="w-full max-w-3xl mx-auto mb-4 rounded-xl overflow-hidden shadow-md h-80">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="mt-2 flex flex-col lg:flex-row lg:items-center gap-x-8 gap-y-4">
                <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
                  {course.description}
                </p>
                <button className="bg-gray-900 text-white px-5 py-2 rounded hover:bg-gray-800 transition">
                  Enroll for ${course.price.toFixed(2)}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative w-full h-[200px] md:h-[450px] xl:h-[700px] bg-black rounded overflow-hidden shadow">
                <CustomVideoPlayer src={selectedChapter.videoUrl} />
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold capitalize">
                    {selectedChapter.title}
                  </h3>
                  <button
                    onClick={handleMarkComplete}
                    disabled={selectedChapter.userProgress?.[0]?.isCompleted}
                    className="text-sm bg-gray-600 text-white px-4 py-1.5 rounded hover:bg-gray-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {selectedChapter.userProgress?.[0]?.isCompleted && (
                      <FaCheckCircle className="text-green-400" />
                    )}
                    Completed
                  </button>
                </div>
                <p className="mt-2 text-gray-600">{selectedChapter.description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
