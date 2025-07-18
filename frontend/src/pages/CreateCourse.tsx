import toast from 'react-hot-toast';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios,{AxiosError} from 'axios';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  title: z
    .string()
    .min(3, 'Course title must be at least 3 characters long')
    .max(100, 'Course title must be under 100 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateCourseForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
  try {
    const res = await axios.post('http://localhost:5000/api/courses/create', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    toast.success('Course created successfully!', {
      position: 'top-center',
    });

    const createdCourse = res.data;
    // console.log('course data', createdCourse);
    navigate(`/course/${createdCourse.id}`);
  } catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  console.error('Failed to create course:', axiosError);

  toast.error(
    axiosError.response?.data?.message || 'Failed to create course. Please try again.',
    {
      position: 'top-center',
    }
  );
}
};


  return (
    <DashboardLayout>
      <div className="flex items-center justify-center px-4">
        <div className="mt-14 max-w-xl w-full space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Name your course</h1>
            <p className="text-sm text-gray-500 mt-1">
              What would you like to name your course? Don&apos;t worry, you can change this later.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Course title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. 'Advanced web development'"
                {...register('title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-500 text-sm mt-1">
                What will you teach in this course?
              </p>
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`px-6 py-2 rounded-md text-white text-sm font-medium transition ${isValid ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
