import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
interface DescriptionProps {
  chapterId: string;
  initialDescription?: string;
}

const Description: React.FC<DescriptionProps> = ({
  chapterId,
  initialDescription = '',
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await axios.patch(
        `http://localhost:5000/api/chapters/update/${chapterId}`,
        { description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );


      toast.success("Title updated successfully!",{
                    position: "top-center",
                  });
      setIsEditingDescription(false);
    } catch (error) {
      console.error('Failed to update description:', error);
      toast.error("Error updating title", {
        position: "top-center",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#f4f8fb] p-8 rounded shadow-sm mt-6">
      <div className="font-semibold mb-1">Chapter description</div>

      {isEditingDescription ? (
        <div className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-2 py-1 rounded w-full text-sm"
            rows={4}
            disabled={isSaving}
          />

          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsEditingDescription(false);
                setDescription(initialDescription); // reset to original
              }}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-black text-white px-4 py-2 rounded text-sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center text-gray-600">
          <span className="text-sm">{description || 'No description'}</span>
          <button
            onClick={() => setIsEditingDescription(true)}
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
