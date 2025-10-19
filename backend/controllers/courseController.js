import Course from "../models/Course.js";
import Progress from "../models/Progress.js"; 


export const createCourse = async (req, res) => {
  const { title, description } = req.body;

  try {
    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing imports ...
export const editCourse=async(req,res)=>{
  const courseId = req.params.id;
  const { title, description } = req.body;
  try {
    const course = await Course.findById(courseId).populate("instructor", "name email");   
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to edit this course" });
    }
    course.title = title || course.title;
    course.description = description || course.description;
    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  console.log("Deleting course with ID:", courseId);
  try {
    const course = await Course.findById(courseId).populate("instructor", "name email");
    console.log("Course found:", course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(courseId);
    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnrolledCourses = async (req, res) => {
  const studentId = req.user._id;
  try {
    const courses = await Course.find({ enrolledStudents: studentId }).populate("instructor", "name email");
    res.json(courses);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("lectures");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enrollStudent = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ message: "Student already enrolled" });
    }

    course.enrolledStudents.push(studentId);
    await course.save();

    
    const progress = await Progress.create({
      student: studentId,
      course: courseId,
      completedLectures: [],
      quizAttempts: [],
    });

    res.json({ message: "Student enrolled successfully", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotEnrolledCourses = async (req, res) => {
  const studentId = req.user._id;
  try {
    const courses = await Course.find({ enrolledStudents: { $ne: studentId } }).populate("instructor", "name email");
    res.json(courses);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};