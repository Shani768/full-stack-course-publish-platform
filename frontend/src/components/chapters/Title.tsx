import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
});

type TitleFormData = z.infer<typeof schema>;

interface TitleProps {
  chapterId: string;
  initialTitle: string;
}

const Title: React.FC<TitleProps> = ({ chapterId, initialTitle }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<TitleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialTitle || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: TitleFormData) => {
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/api/chapters/update/${chapterId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
            toast.success("Title updated successfully!",{
              position: "top-center",
            });
      setIsEditingTitle(false);
    } catch (err) {
      console.error("Failed to update title", err);
      toast.error("Error updating title", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f8fb] p-8 rounded shadow-sm">
      <div className="font-semibold mb-1">Chapter title</div>

      {isEditingTitle ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            {...register("title")}
            className="border px-2 py-1 rounded w-full text-sm"
            placeholder="Enter chapter title"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditingTitle(false);
                setValue("title", initialTitle); // Reset to original
              }}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center">
          <span>{initialTitle || "Untitled"}</span>
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-sm text-black hover:underline flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit title
          </button>
        </div>
      )}
    </div>
  );
};

export default Title;
