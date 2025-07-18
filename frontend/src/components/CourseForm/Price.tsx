import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';

// ✅ Zod schema to validate price
const priceSchema = z.object({
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Price must be a valid non-negative number',
    }),
});

type PriceFormData = z.infer<typeof priceSchema>;

interface PriceProps {
  courseId: string;
  initialPrice?: number;
}

const Price: React.FC<PriceProps> = ({ courseId, initialPrice = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<PriceFormData>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      price: initialPrice.toFixed(2),
    },
  });

  const price = watch('price');

  const onSubmit = async (data: PriceFormData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/courses/${courseId}`,
        { price: parseFloat(data.price) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Price updated successfully', { position: 'top-center' });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update price:', err);
      toast.error('Error updating price', { position: 'top-center' });
    }
  };

  const handleCancel = () => {
    setValue('price', initialPrice.toFixed(2));
    setIsEditing(false);
  };

  return (
    <div className="bg-[#f4f8fb] p-8 rounded shadow-sm">
      <div className="font-semibold mb-1">Course Price</div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('price')}
            className="border px-3 py-2 rounded w-full text-sm"
            placeholder="Enter price e.g. 19.99"
            disabled={isSubmitting}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center text-gray-500">
          <span>{price ? `$${price}` : 'No price set'}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-black hover:underline flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit price
          </button>
        </div>
      )}
    </div>
  );
};

export default Price;
