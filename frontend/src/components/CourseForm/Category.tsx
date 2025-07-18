import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface CategoryType {
  id: string;
  name: string;
}

interface CategoryProps {
  courseId: string;
  initialCategoryId: string | null;
}

// ✅ Zod schema
const categorySchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const Category: React.FC<CategoryProps> = ({ courseId, initialCategoryId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryId: initialCategoryId || '',
    },
  });

  // const selectedCategoryId = watch('categoryId');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/courses/category', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        toast.error('Failed to load categories.', { position: 'top-center' });
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/courses/${courseId}`,
        { categoryId: data.categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Category updated!', { position: 'top-center' });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update category:', err);
      toast.error('Error updating category', { position: 'top-center' });
    }
  };

  const selectedCategoryName = categories.find((c) => c.id === initialCategoryId)?.name;

  return (
    <div className="bg-[#f4f8fb] p-8 rounded shadow-sm">
      <div className="font-semibold mb-1">Course category</div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <select
            {...register('categoryId')}
            className="border px-3 py-2 rounded w-full text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setValue('categoryId', initialCategoryId || '');
              }}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded text-sm"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center">
          <span>{selectedCategoryName || 'No category selected'}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-black hover:underline flex items-center gap-1"
          >
            <Pencil size={14} />
            Select category
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
