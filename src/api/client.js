import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL environment variable.");
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getErrorMessage = (error, fallbackMessage = "Request failed") => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const request = async (config, fallbackMessage) => {
  try {
    const response = await client(config);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage));
  }
};

export const authApi = {
  login: (payload) =>
    request({ method: "post", url: "/api/v1/user/login", data: payload }, "Login failed"),
  register: (payload) =>
    request(
      { method: "post", url: "/api/v1/user/register", data: payload },
      "Registration failed"
    ),
};

export const userApi = {
  getCurrentUser: () =>
    request({ method: "post", url: "/api/v1/user/getUserData", data: {} }, "Failed to load user"),
  getAllDoctors: () =>
    request({ method: "get", url: "/api/v1/user/getAllDoctors" }, "Failed to load doctors"),
  applyDoctor: (payload) =>
    request(
      { method: "post", url: "/api/v1/user/apply-doctor", data: payload },
      "Failed to submit doctor application"
    ),
  getNotifications: () =>
    request(
      { method: "post", url: "/api/v1/user/getUserData", data: {} },
      "Failed to load notifications"
    ),
  markAllNotificationsRead: () =>
    request(
      { method: "post", url: "/api/v1/user/get-all-notification", data: {} },
      "Failed to mark notifications as read"
    ),
  deleteAllNotifications: () =>
    request(
      { method: "post", url: "/api/v1/user/delete-all-notification", data: {} },
      "Failed to delete notifications"
    ),
  getAppointments: () =>
    request(
      { method: "get", url: "/api/v1/user/user-appointments" },
      "Failed to load appointments"
    ),
  bookAppointment: (payload) =>
    request(
      { method: "post", url: "/api/v1/user/book-appointment", data: payload },
      "Failed to book appointment"
    ),
  updateProfile: (payload) =>
    request(
      { method: "post", url: "/api/v1/user/updateProfile", data: payload },
      "Failed to update profile"
    ),
};

export const doctorApi = {
  getDoctorInfo: () =>
    request(
      { method: "post", url: "/api/v1/doctor/getDoctorInfo", data: {} },
      "Failed to load doctor profile"
    ),
  getDoctorById: (doctorId) =>
    request(
      { method: "post", url: "/api/v1/doctor/getDoctorById", data: { doctorId } },
      "Failed to load doctor"
    ),
  updateProfile: (payload) =>
    request(
      { method: "post", url: "/api/v1/doctor/updateProfile", data: payload },
      "Failed to update doctor profile"
    ),
  getAppointments: () =>
    request(
      { method: "get", url: "/api/v1/doctor/doctor-appointments" },
      "Failed to load doctor appointments"
    ),
  updateAppointmentStatus: (appointmentsId, status) =>
    request(
      {
        method: "post",
        url: "/api/v1/doctor/update-status",
        data: { appointmentsId, status },
      },
      "Failed to update appointment status"
    ),
};

export const adminApi = {
  getUsers: () =>
    request({ method: "get", url: "/api/v1/admin/getAllUsers" }, "Failed to load users"),
  getDoctors: () =>
    request(
      { method: "get", url: "/api/v1/admin/getAllDoctors" },
      "Failed to load doctors"
    ),
  changeDoctorAccountStatus: (doctorId, status) =>
    request(
      {
        method: "post",
        url: "/api/v1/admin/changeAccountStatus",
        data: { doctorId, status },
      },
      "Failed to update doctor account status"
    ),
};

export const uploadEndpoints = {
  userProfile: `${API_BASE_URL}/api/v1/user/upload-profile`,
};

export { API_BASE_URL, client, getErrorMessage };
