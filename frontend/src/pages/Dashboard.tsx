import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CategoryFilter from "../components/dashboard/CategoryFilter";
import CourseCard from "../components/dashboard/CourseCard";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Progress_completed from "../components/dashboard/Progress_completed";
import { useSearchStore } from '../store/searchStore';

interface Course {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  isPublished: boolean;
  categoryId?: string | null;
  createdAt: string;
}

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTerm, setSearchTerm } = useSearchStore();

  const selectedCategory = searchParams.get("category");
  const searchQueryParam = searchParams.get("search");

  // Debounce logic
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // wait 500ms after user stops typing

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Sync Zustand state with URL on mount
  useEffect(() => {
    if (searchQueryParam && !searchTerm) {
      setSearchTerm(searchQueryParam);
    }
  }, [searchQueryParam]);

  // Sync Zustand -> URL (when searchTerm changes)
  useEffect(() => {
    if (searchTerm) {
      searchParams.set("search", searchTerm);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const endpoint = debouncedSearch
          ? `http://localhost:5000/api/courses/search?query=${encodeURIComponent(debouncedSearch)}`
          : "http://localhost:5000/api/courses/published";

        const res = await axios.get(endpoint, {
          params: selectedCategory ? { category: selectedCategory } : {},
        });

        setCourses(res.data);
        // console.log('dashboard', res.data)
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, debouncedSearch]);

  const handleSelectCategory = (category: string | null) => {
    if (selectedCategory === category || category === null) {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 mb-8 w-full">
        <Progress_completed
          icon="📘"
          title="In Progress"
          count={0}
          bgColor="bg-indigo-500"
          textColor="text-indigo-900"
        />
        <Progress_completed
          icon="✅"
          title="Completed"
          count={0}
          bgColor="bg-purple-500"
          textColor="text-purple-900"
        />
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {loading ? (
        <div className="text-center text-gray-500 italic">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-gray-600 italic">
          🚫 No courses found.
        </div>
      ) : (
        <div className="flex flex-wrap justify-start px-4 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
