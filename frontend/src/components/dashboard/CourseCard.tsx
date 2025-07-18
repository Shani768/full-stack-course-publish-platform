import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    imageUrl?: string;
    description?: string;
    price?: number;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div className="w-64 bg-white shadow p-4 rounded"
      onClick={() => navigate(`/dashboard/course/${course.id}`)}
    >
      <img
        src={course.imageUrl || "https://via.placeholder.com/150"}
        alt={course.title}
        className="w-full h-36 object-cover rounded"
      />
      <h2 className="text-lg font-semibold mt-2">{course.title}</h2>
      <p className="text-sm text-gray-600">{course.description}</p>
      <p className="mt-2 font-bold">${course.price ?? 0}</p>
    </div>
  );
};

export default CourseCard;
