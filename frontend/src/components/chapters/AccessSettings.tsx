import React, { useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
interface AccessProps {
  chapterId: string;
  initialAccess: boolean;
}

const AccessSettings: React.FC<AccessProps> = ({ chapterId, initialAccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFree, setIsFree] = useState(initialAccess);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.patch(
        `http://localhost:5000/api/chapters/update/${chapterId}`,
        { isFree },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Title updated successfully!", {
        position: "top-center",
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update access setting", err);
      toast.error("Error updating title", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f8fb] p-8 rounded shadow-sm mt-6">
      <div className="font-semibold mb-1">Chapter Access</div>

      {isEditing ? (
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              disabled={loading}
            />
            Make this chapter free to preview
          </label>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsEditing(false);
                setIsFree(initialAccess); // Reset on cancel
              }}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-black text-white px-4 py-2 rounded text-sm"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center text-gray-600 text-sm">
          <span>{isFree ? "Free to preview" : "Paid chapter"}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-black hover:underline flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit access
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessSettings;
