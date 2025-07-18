import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Title from '../components/chapters/Title';
import Description from '../components/chapters/Description';
import AccessSettings from '../components/chapters/AccessSettings';
import VideoUpload from '../components/chapters/VideoUpload';
import toast from 'react-hot-toast';

interface Chapter {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  videoUrl: string;
  isFree: boolean;
}

const ChapterPage = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/chapters/${chapterId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChapter(res.data);
      } catch (err) {
        console.error('Error fetching chapter:', err);
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) fetchChapter();
  }, [chapterId]);

  const isComplete =
    chapter?.title?.trim() &&
    chapter?.description?.trim() &&
    chapter?.videoUrl?.trim();

  const handlePublish = async () => {
    if (!chapterId) return;
    try {
      setIsPublishing(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/chapters/update/${chapterId}`,
        { isPublished: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChapter((prev) => prev ? { ...prev, isPublished: true } : prev);
      toast.success('Chapter published successfully');
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish chapter");
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  if (!chapter) return <DashboardLayout><div>Chapter not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-6">
        {!chapter.isPublished && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded mb-6">
            ⚠️ This course is unpublished. It will not be visible to the students.
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Chapter setup</h1>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded text-sm ${isComplete
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
                }`}
              disabled={!isComplete || isPublishing}
              onClick={handlePublish}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
            <button className="bg-black text-white p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Complete all fields to publish Chapter
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customize your course */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">🔲</div>
              <span className="font-medium">Customize your chapter</span>
            </div>
            <div className="space-y-4">
              <Title chapterId={chapter.id} initialTitle={chapter.title} />
              <Description
                chapterId={chapter.id}
                initialDescription={chapter.description}
              />
              <AccessSettings
                chapterId={chapter.id}
                initialAccess={chapter.isFree}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">📋</div>
              <span className="font-medium">Upload chapter video</span>
            </div>
            <VideoUpload
              chapterId={chapter.id}
              initialVideoUrl={chapter.videoUrl}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChapterPage;
