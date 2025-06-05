"use client";
import { useState } from "react";

const courses = ["Course 1", "Course 2", "Course 3"];
const notifications = [
  { id: 1, course: "Course 1", message: "New notification for Course 1" },
  { id: 2, course: "Course 2", message: "New notification for Course 2" },
  { id: 3, course: "Course 1", message: "Another notification for Course 1" },
  { id: 4, course: "Course 3", message: "New notification for Course 3" },
];
const NotificationPage = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const course = event.target.value;
    setSelectedCourse(course);
    setFilteredNotifications(
      course
        ? notifications.filter((notification) => notification.course === course)
        : notifications
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Notifications</h1>

      {/* Select để lọc theo khóa học */}
      <div className="mb-4">
        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          className="p-2 border rounded bg-white"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      <div>
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className="mb-2 p-4 bg-gray-50 border rounded"
          >
            <h2 className="font-semibold">{notification.course}</h2>
            <p>{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
