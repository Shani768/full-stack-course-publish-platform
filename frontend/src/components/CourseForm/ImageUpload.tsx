import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  courseId: string;
  initialImageUrl: string | null;
}

const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const imageSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.[0], {
      message: 'Image is required',
    }),
});

type ImageFormData = z.infer<typeof imageSchema>;

const ImageUpload: React.FC<ImageUploadProps> = ({ courseId, initialImageUrl }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
  });

  const file = watch('image')?.[0];
  const [previewUrl, setPreviewUrl] = React.useState(initialImageUrl || '');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: ImageFormData) => {
  const selectedFile = data.image?.[0];
  if (!selectedFile) return;

  setLoading(true);
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const uploadData = await res.json();
    if (!uploadData.secure_url) throw new Error('Upload failed');

    await axios.patch(
      `http://localhost:5000/api/courses/${courseId}`,
      { imageUrl: uploadData.secure_url },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    setPreviewUrl(uploadData.secure_url);
    reset();
    toast.success("Updated successfully!", { position: "top-center" });
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error("Something went wrong", { position: "top-center" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#f4f8fb] rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Course image</h2>
          <label className="text-black cursor-pointer hover:underline">
            + Choose an image
            <input
              type="file"
              accept="image/*"
              {...register('image')}
              className="hidden"
            />
          </label>
        </div>

        <div className="w-full h-60 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Existing"
              className="object-cover w-full h-full"
            />
          ) : (
            <p className="text-gray-500 text-sm">No image selected</p>
          )}
        </div>

        {errors.image?.message && (
          <p className="text-red-500 text-sm mt-2">
            {String(errors.image.message)}
          </p>
        )}


        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default ImageUpload;
