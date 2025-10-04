// Simple axios wrapper. Use this to integrate backend later.
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
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
  getById: (id) => instance.get(`/api/courses/${id}`),
  create: (payload) => instance.post("/api/courses", payload),
};

const lectures = {
  list: (courseId) => instance.get(`/api/courses/${courseId}/lectures`),
  get: (courseId, lectureId) => instance.get(`/api/courses/${courseId}/lectures/${lectureId}`),
  add: (courseId, payload) => instance.post(`/api/courses/${courseId}/lectures`, payload),
  attempt: (lectureId, payload) => instance.post(`/api/lectures/${lectureId}/attempt`, payload),
};

const progress = {
  enroll: (courseId) => instance.post(`/api/progress/enroll/${courseId}`),
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
