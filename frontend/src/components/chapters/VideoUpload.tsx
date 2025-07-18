import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Hls from 'hls.js';
import toast from 'react-hot-toast';
interface VideoUploadProps {
  chapterId: string;
  initialVideoUrl: string | null;
}

// const CLOUD_NAME = 'dua3hjhp2';
// const UPLOAD_PRESET = 'unsigned_profile_uploads';


const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;


const videoSchema = z.object({
  video: z.any().refine((file) => file?.[0], {
    message: 'Video is required',
  }),
});

type VideoFormData = z.infer<typeof videoSchema>;

const VideoUpload: React.FC<VideoUploadProps> = ({ chapterId, initialVideoUrl }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  });

  const file = watch('video')?.[0];
  const [previewUrl, setPreviewUrl] = useState(initialVideoUrl || '');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onSubmit = async (data: VideoFormData) => {
    const selectedFile = data.video?.[0];
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / (event.total || 1));
            setProgress(percent);
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const uploadData = res.data;
      if (!uploadData.playback_url) throw new Error('Upload failed');

      await axios.patch(
        `http://localhost:5000/api/chapters/update/${chapterId}`,
        { videoUrl: uploadData.playback_url },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setPreviewUrl(uploadData.playback_url); // Use HLS stream URL
      reset();
      toast.success("Title updated successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error("Error updating title", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#f4f8fb] rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chapter video</h2>
          <label className="text-gray-800 cursor-pointer hover:underline">
            + Choose a video
            <input
              type="file"
              accept="video/*"
              {...register('video')}
              className="hidden"
            />
          </label>
        </div>

        <div className="w-full h-60 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {file ? (
            <video
              src={URL.createObjectURL(file)}
              controls
              className="w-full h-full object-cover"
            />
          ) : previewUrl ? (
            <HLSPlayer src={previewUrl} />
          ) : (
            <p className="text-gray-500 text-sm">No video selected</p>
          )}
        </div>

        {typeof errors.video?.message === 'string' && (
          <p className="text-red-500 text-sm mt-2">{errors.video.message}</p>
        )}
        <div className="relative mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex justify-center items-center gap-2 px-4 py-2 rounded text-white transition ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'
              }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            )}
            {loading ? 'Uploading...' : 'Upload'}
          </button>

          {loading && (
            <div className="mt-3">
              <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-800 transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-center mt-1 text-gray-600">{progress}%</p>
            </div>
          )}
        </div>

      </form>
    </div>
  );
};

export default VideoUpload;



const HLSPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } else if (videoRef.current) {
      // For Safari or native HLS support
      videoRef.current.src = src;
    }
  }, [src]);

  return <video ref={videoRef} controls className="w-full h-full object-cover" />;
};
