import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { coursesApi } from "../services/api";

const CourseLearnPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = React.useState(null);

  useEffect(() => {
    if (!courseId) {
      console.error("Course ID is required to learn a course.");
      return;
    }

    const fetchCourse = async () => {
      const response = await coursesApi.getCourseById(courseId);

      setCourse(response);
    };

    fetchCourse();
  }, []);

  return (
    <div>
      <h1>{course?.title}</h1>
      <p>{course?.description}</p>
    </div>
  );
};

export default CourseLearnPage;
