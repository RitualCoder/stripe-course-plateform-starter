import React from "react";
import { useParams } from "react-router-dom";

const CourseLearnPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div>
      <h1>CourseLearnPage</h1>
    </div>
  );
};

export default CourseLearnPage;
