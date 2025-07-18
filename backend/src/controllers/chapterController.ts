import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/types';
const prisma = new PrismaClient();



export const createChapter = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, courseId } = req.body;
    const userId = req.user?.userId;

    const course = await prisma.course.findFirst({ where: { id: courseId, userId } });
    if (!course){ 
        res.status(404).json({ message: "Course not found" });
      return 
   }
    const lastChapter = await prisma.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const newChapter = await prisma.chapter.create({
      data: {
        title,
        courseId,
        position: lastChapter ? lastChapter.position + 1 : 1,
      },
    });

    res.status(201).json(newChapter);
  } catch (error) {
    console.error("[CREATE_CHAPTER]", error);
    res.status(500).json({ message: "Failed to create chapter" });
  }
};

export const getChaptersByCourseId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.userId;

    const course = await prisma.course.findFirst({ where: { id: courseId, userId } });
    if (!course){ 
       res.status(404).json({ message: "Course not found" });
      return 
}
    const chapters = await prisma.chapter.findMany({
      where: { courseId },
      orderBy: { position: "asc" },
    });

    res.json(chapters);
  } catch (err) {
    console.error("[GET_CHAPTERS]", err);
    res.status(500).json({ message: "Failed to fetch chapters" });
  }
};




export const reorderChapters = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
    const { chapters } = req.body; 
    const userId = req.user?.userId;

    const updates = await Promise.all(
      chapters.map(async ({ id, position }: { id: string; position: number }) => {
        const chapter = await prisma.chapter.findUnique({ where: { id } });
        if (!chapter) return null;

        const course = await prisma.course.findFirst({
          where: { id: chapter.courseId, userId },
        });
        if (!course) return null;

        return prisma.chapter.update({
          where: { id },
          data: { position },
        });
      })
    );

    res.json({ message: "Chapters reordered" });
  } catch (error) {
    console.error("[REORDER_CHAPTERS]", error);
    res.status(500).json({ message: "Failed to reorder chapters" });
  }
};



// GET /api/chapters/:chapterId
export const getChapterById = async (req: Request, res: Response): Promise<void> => {
  const { chapterId } = req.params;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      res.status(404).json({ message: 'Chapter not found' });
      return;
    }

    res.status(200).json(chapter);
  } catch (err: any) {
    console.error('Error fetching chapter:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// update chapter
export const updateChapter = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { chapterId } = req.params;
    // console.log('chapteId', chapterId)
    const values = req.body;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
      return 
    }

    const chapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        course: {
          userId: userId,
        },
      },
      data: {
        ...values,
      }
      // include: {
      //   course: true, // Optional: include course data for verification/debug
      // },
    });
     res.json(chapter);
    return 
  } catch (error: any) {
    console.error("[UPDATE_CHAPTER]", error);
       res.status(500).json({ message: "Internal Server Error", error: error.message });
    return
  }
};



export const deleteChapter = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  const chapterId = req.params.id;
  const userId = req.user?.userId;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { course: true },
    });

    if (!chapter) {
      res.status(404).json({ message: "Chapter not found" });
      return 
    }

    // Check ownership: only course owner can delete chapter
    if (chapter.course.userId !== userId) {
        res.status(403).json({ message: "Unauthorized to delete this chapter" });
      return 
    }

    await prisma.chapter.delete({
      where: { id: chapterId },
    });
     res.status(200).json({ message: "Chapter deleted successfully" });
    return 
  } catch (error) {
    console.error("Error deleting chapter:", error);
      res.status(500).json({ message: "Internal server error" });
    return 
  }
};




export const markChapterAsComplete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const chapterId = req.params.chapterId as string;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: userId is missing" });
    return;
  }

  try {
    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: chapterId,
        },
      },
    });

    if (existing) {
       res.status(200).json({ message: "Already marked complete" });
      return 
    }

    const progress = await prisma.userProgress.create({
      data: {
        userId: userId,
        chapterId: chapterId,
        isCompleted: true,
      },
    });

    res.status(201).json(progress);
  } catch (err) {
    console.error("Progress Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


