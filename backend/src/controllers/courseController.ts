import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/types';
import { promises } from 'dns';

const prisma = new PrismaClient();

// POST /api/courses/create
export const createCourse = async (req: AuthenticatedRequest, res: Response) : Promise<void> => {
  try {
    const userId = req.user?.userId
    console.log('userId', userId)
    const { title } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const course = await prisma.course.create({
      data: {
        userId,
        title,
      },
    });
      res.status(201).json(course);
    return 
  } catch (error) {
    console.error("[CREATE_COURSE]", error);
    res.status(500).json({ message: "Internal Server Error" })
    return ;
  }
};



// PATCH /api/courses/:courseId
export const updateCourse = async (req: AuthenticatedRequest, res: Response) : Promise<void> =>  {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;
    // console.log('courseId', courseId)
    // console.log('userId', userId)
    const values = req.body;
    //  console.log('value', values)
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return 
    }

    const course = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });
      res.json(course);
    return 
  } catch (error) {
    console.error("[UPDATE_COURSE]", error);
     res.status(500).json({ message: "Internal Server Error" })
    return ;
  }
};



// Get course by ID
// Get course by ID with category
export const getCourseById = async (req: AuthenticatedRequest, res: Response) : Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId

    const course = await prisma.course.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true, // ✅ Include related category object
        chapters:true,
        attachments: true,
      },
    });

    if (!course){ 
        res.status(404).json({ message: 'Course not found' });
      return 
}
    res.json(course);
  } catch (error) {
    console.error('[GET_COURSE]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// categories 
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },include: {
    courses: true, // ← this will include all courses under each category
  },
    });
    res.json(categories);
  } catch (error) {
    console.error("[GET_CATEGORIES]", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};




// POST /api/attachments
export const createAttachment = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, url, courseId } = req.body;

    if (!userId){ 
        res.status(401).json({ message: "Unauthorized" });
      return 
}
    if (!name || !url || !courseId) {
        res.status(400).json({ message: "Missing required fields" });
      return 
    }

    // Optional: check if the course belongs to the user
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
       res.status(404).json({ message: "Course not found or unauthorized" });
      return 
    }

    const attachment = await prisma.attachment.create({
      data: {
        name,
        url,
        courseId,
      },
    });
      res.status(201).json(attachment);
    return 
  } catch (error) {
    console.error("[CREATE_ATTACHMENT]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get Publish courses

export const getPublishedCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;

    const publishedCourses = await prisma.course.findMany({
      where: {
        isPublished: true,
        category: category
          ? {
              name: category,
            }
          : undefined,
      },
      include: {
        category: true,
        chapters: true,
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
      res.json(publishedCourses);
    return 
  } catch (error) {
    console.error('[GET_PUBLISHED_COURSES]', error);
      res.status(500).json({ message: 'Internal Server Error' });
    return 
  }
};



export const search = async (req: Request, res: Response) : Promise<void> => {
  const query = req.query.query as string;

  if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Query parameter is required and must be a string.' });
    return 
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        title: {
          search: query, // ✅ Full-text search on title
        },
      },
    });

    res.status(200).json(courses);
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).json({ message: 'Server error while searching courses.' });
  }
};


export const getPublishedCourseDetail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { courseId } = req.params as {courseId: string}

   const userId = req.user?.userId;
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          where: { isPublished: true },
          orderBy: { position: "asc" },
          include: {
            userProgress: {
              where: {
                userId: userId,
              },
              select: {
                isCompleted: true,
              },
            },
          },
        },
      },
    });

    if (!course || !course.isPublished) {
        res
        .status(404)
        .json({ message: "Course not found or not published" });
      return 
    }
      res.json(course);
    return 
  } catch (error) {
    console.error("[GET_PUBLISHED_COURSE_DETAIL]", error);
     res.status(500).json({ message: "Internal Server Error" });
    return 
  }
};


export const getMyCourses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  try {
    const courses = await prisma.course.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
      res.json(courses);
    return 
  } catch (error) {
    console.error('Failed to fetch courses:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    return 
  }
};




export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  const courseId = req.params.id as string;
  // console.log('courseId', courseId)
  const userId = (req as any).user?.userId; // comes from authMiddleware
  // console.log('userId', userId)
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
        res.status(404).json({ message: 'Course not found' });
      return 
    }

    if (course.userId !== userId) {
         res.status(403).json({ message: 'Unauthorized to delete this course' });
      return 
    }

    await prisma.course.delete({
      where: { id: courseId },
    });
     res.status(200).json({ message: 'Course deleted successfully' });
    return 
  } catch (error) {
    console.error('Error deleting course:', error);
       res.status(500).json({ message: 'Internal server error' })
    return
  }
};