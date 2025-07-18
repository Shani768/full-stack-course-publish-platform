import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface DescriptionProps {
  courseId: string;
  initialDescription?: string;
}

// Define schema using Zod
const descriptionSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
});

type DescriptionFormData = z.infer<typeof descriptionSchema>;

const Description: React.FC<DescriptionProps> = ({ courseId, initialDescription = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DescriptionFormData>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: initialDescription,
    },
  });

  const onSubmit = async (data: DescriptionFormData) => {
    try {
      setIsSaving(true);

      await axios.patch(
        `http://localhost:5000/api/courses/${courseId}`,
        { description: data.description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Updated successfully!', {
        position: 'top-center',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update description:', error);
      toast.error('Something went wrong', {
        position: 'top-center',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#f4f8fb] p-8 rounded shadow-sm">
      <div className="font-semibold mb-1">Course description</div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register('description')}
            className="border px-2 py-1 rounded w-full"
            rows={4}
            disabled={isSaving}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setValue('description', initialDescription);
              }}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded text-sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center text-gray-500">
          <span>{initialDescription || 'No description'}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-black hover:underline flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit description
          </button>
        </div>
      )}
    </div>
  );
};

export default Description;
