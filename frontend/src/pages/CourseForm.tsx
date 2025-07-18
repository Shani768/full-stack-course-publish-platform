import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Title from '../components/CourseForm/Title';
import Description from '../components/CourseForm/Description';
import Category from '../components/CourseForm/Category';
import { ChaptersForm } from '../components/chapters/ChaptersForm';
import Price from '../components/CourseForm/Price';
import CourseFile from '../components/CourseForm/CourseFile';
import ImageUpload from '../components/CourseForm/ImageUpload';
import toast from 'react-hot-toast';

interface Chapter {
  id: string;
  title: string;
  position: number;
  description?: string | null;
  videoUrl?: string | null;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
}


interface CourseData {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  isPublished: boolean;
  userId: string;
  categoryId: string | null;
  chapters: Chapter[];
  attachments: Attachment[];
}

const CourseForm = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setCourse(res.data);
        // console.log('Course data:', res.data);

      } catch (err) {
        console.error('Failed to fetch course:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);


  const completedFields = course
    ? [
      course.title?.trim(),
      course.description?.trim(),
      course.imageUrl?.trim(),
      course.categoryId,
      course.price !== undefined && course.price > 0,
      course.chapters.length > 0,
    ].filter(Boolean).length
    : 0;

  const totalRequiredFields = 6;
  const isFormComplete = completedFields === totalRequiredFields;

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/courses/${id}`,
        { isPublished: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Course published!");
      setCourse((prev) =>
        prev ? { ...prev, isPublished: true } : prev
      );
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish course.");
    }
  };


  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-gray-500">Loading course...</div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-red-500">Course not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-6">
        {!course.isPublished && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded mb-6">
            ⚠️ This course is unpublished. It will not be visible to the students.
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Course setup</h1>
          <div className="flex gap-2">
            <button
              onClick={handlePublish}
              className={`px-4 py-2 rounded text-sm ${isFormComplete
                  ? 'bg-black text-white hover:bg-black'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!isFormComplete}
            >
              Publish
            </button>


            <button className="bg-black text-white p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Complete all fields ({completedFields}/{totalRequiredFields} completed)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customize your course */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">🔲</div>
              <span className="font-medium">Customize your course</span>
            </div>

            <div className="space-y-4">
              <Title courseId={id!} initialTitle={course.title} />

              <Description courseId={id!} initialDescription={course.description} />
              <ImageUpload courseId={id!} initialImageUrl={course.imageUrl ?? null} />

              <Category
                courseId={id!}
                initialCategoryId={course.categoryId}
              />


            </div>
          </div>

          {/* Course chapters */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">📋</div>
              <span className="font-medium">Course chapters</span>
            </div>

            <ChaptersForm courseId={id!} initialChapters={course.chapters ?? []} />

            {/* Sell your course */}
            <div className="mt-10 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">💲</div>
              <span className="font-medium">Sell your course</span>
            </div>

            <Price courseId={course.id} initialPrice={course.price ?? 0} />
            <CourseFile courseId={id!} attachments={course.attachments} />

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseForm;








