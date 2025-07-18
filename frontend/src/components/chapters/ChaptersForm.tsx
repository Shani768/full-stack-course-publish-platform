import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DragEndEvent } from "@dnd-kit/core";
import axios from "axios";
import { PlusCircle, Loader2, GripVertical, MoreVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Chapter {
  id: string;
  title: string;
  position: number;
}

interface ChaptersFormProps {
  courseId: string;
  initialChapters: Chapter[];
}

interface SortableItemProps {
  chapter: Chapter;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ chapter, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: chapter.id,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-white border rounded px-4 py-2 hover:shadow relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="pr-2 cursor-grab"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="flex-1">
        <p className="font-medium">{chapter.title}</p>
        <p className="text-xs text-gray-500">Position: {chapter.position}</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-1 w-28 z-10 bg-white border border-gray-200 shadow-lg rounded-md text-sm">
            <button
              onClick={() => {
                setDropdownOpen(false);
                onEdit(chapter.id);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false);
                onDelete(chapter.id);
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChaptersForm: React.FC<ChaptersFormProps> = ({
  courseId,
  initialChapters,
}) => {
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);

  const navigate = useNavigate();

  const toggleCreating = () => {
    setIsCreating((prev) => !prev);
    setError("");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/chapters",
        { title, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newChapter = res.data;
      setChapters([...chapters, newChapter]);
      setTitle("");
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create chapter:", err);
    }
  };

  const onEdit = (chapterId: string) =>
    navigate(`/course/${courseId}/chapter/${chapterId}`);

  const handleDelete = async (chapterId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/chapters/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChapters((prev) => prev.filter((c) => c.id !== chapterId));
    } catch (err) {
      console.error("Failed to delete chapter:", err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = chapters.findIndex((c) => c.id === active.id);
    const newIndex = chapters.findIndex((c) => c.id === over.id);
    const newChapters = arrayMove(chapters, oldIndex, newIndex).map((c, i) => ({
      ...c,
      position: i + 1,
    }));

    setChapters(newChapters);
    setIsUpdating(true);

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:5000/api/chapters/reorder",
        {
          chapters: newChapters.map(({ id, position }) => ({ id, position })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Reorder failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative mt-6 bg-slate-100 rounded-md p-4 max-w-xl mx-auto">
      {isUpdating && (
        <div className="absolute inset-0 bg-slate-500/20 flex items-center justify-center z-10 rounded-md">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}

      <div className="font-medium flex items-center justify-between mb-4">
        <span>Course chapters</span>
        <button
          onClick={toggleCreating}
          className="flex items-center text-sm text-black hover:underline transition"
        >
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-1" /> Add a chapter
            </>
          )}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 'Introduction to the course'"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="text-sm px-4 py-2 rounded-md bg-black text-white"
          >
            Create
          </button>
        </form>
      )}

      {!isCreating && chapters.length > 0 && (
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 mt-2">
              {chapters.map((chapter) => (
                <SortableItem
                  key={chapter.id}
                  chapter={chapter}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {!isCreating && !chapters.length && (
        <div className="text-slate-500 italic text-sm mt-2">No chapters</div>
      )}

      {!isCreating && (
        <p className="text-xs text-gray-500 mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
