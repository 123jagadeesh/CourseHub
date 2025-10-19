import axios from "axios";

const instance = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

const setAuthToken = (token) => {
  if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete instance.defaults.headers.common["Authorization"];
};

const clearAuthToken = () => {
  delete instance.defaults.headers.common["Authorization"];
};

const auth = {
  login: (payload) => instance.post("/api/auth/login", payload),
  register: (payload) => instance.post("/api/auth/register", payload),
};

const courses = {
  getAll: () => instance.get("/api/courses"),
  get: (id) => instance.get(`/api/courses/${id}`), 
  create: (payload) => instance.post("/api/courses", payload),
  enroll: (courseId) => instance.post(`/api/courses/${courseId}/enroll`), 
  getEnrolledCourses: () => instance.get(`/api/courses/enrolled`),
  getNotEnrolledCourses: () => instance.get(`/api/courses/not-enrolled`),
  delete: (id) => instance.delete(`/api/courses/${id}`),
};

const lectures = {
  list: (courseId) => instance.get(`/api/courses/${courseId}/lectures`),
  get: (courseId, lectureId) => instance.get(`/api/courses/${courseId}/lectures/${lectureId}`),
  add: (courseId, payload) => instance.post(`/api/courses/${courseId}/lectures`, payload),
  
};

const progress = {
   attempt: (lectureId, payload) => instance.post(`/api/progress/${lectureId}/attempt`, payload),
  complete: (lectureId) => instance.post(`/api/progress/complete/${lectureId}`),
  get: (courseId) => instance.get(`/api/progress/${courseId}`), 
};

export default {
  instance,
  setAuthToken,
  clearAuthToken,
  auth,
  courses,
  lectures,
  progress,
};