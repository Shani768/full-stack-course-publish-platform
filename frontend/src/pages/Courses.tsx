import { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  isPublished: boolean;
  createdAt: string;
  categoryId: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/courses/getCourses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(res.data);
      // console.log('res.data', res.data)

    } catch (error) {
      console.error('Error fetching user courses:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/deleteCourse/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from UI
      setCourses((prev) => prev.filter((course) => course.id !== id));
      setDropdownOpenId(null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/course/${id}`);
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <table className="min-w-full table-auto text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition relative"
                >
                  <td className="p-3 font-medium text-gray-900">{course.title}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        course.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {course.isPublished ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">${course.price?.toFixed(2)}</td>
                  <td className="p-3 text-right relative">
                    <button
                      onClick={() =>
                        setDropdownOpenId(dropdownOpenId === course.id ? null : course.id)
                      }
                      className="text-lg px-2 py-1 hover:bg-gray-200 rounded"
                    >
                      ⋯
                    </button>
                    {dropdownOpenId === course.id && (
                      <div className="absolute right-2 mt-1 w-28 z-10 bg-white border border-gray-200 shadow-lg rounded-md text-sm">
                        <button
                          onClick={() => handleEdit(course.id)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
