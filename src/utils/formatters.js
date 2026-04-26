import moment from "moment";

export const getInitials = (value, fallback = "U") => {
  if (!value) {
    return fallback;
  }

  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const sortAppointmentsByLatest = (appointments = []) =>
  [...appointments].sort((first, second) => {
    const firstDate = moment(
      first.createdAt || first.date,
      first.createdAt ? undefined : "DD-MM-YYYY"
    );
    const secondDate = moment(
      second.createdAt || second.date,
      second.createdAt ? undefined : "DD-MM-YYYY"
    );

    return secondDate.valueOf() - firstDate.valueOf();
  });

export const formatAppointmentDate = (value) => {
  if (!value) {
    return "Not set";
  }

  if (value.includes("T")) {
    return moment(value).format("DD MMM YYYY");
  }

  return moment(value, "DD-MM-YYYY").format("DD MMM YYYY");
};

export const formatAppointmentTime = (value) => {
  if (!value) {
    return "Not set";
  }

  if (value.includes("T")) {
    return moment(value).format("hh:mm A");
  }

  if (value.includes(":")) {
    return moment(value, "HH:mm").format("hh:mm A");
  }

  return value;
};

export const formatNotificationTime = (notification) => {
  const timestamp = notification.createdAt || notification.timestamp || notification.time;

  if (!timestamp) {
    return "Just now";
  }

  const date = moment(timestamp);

  if (!date.isValid()) {
    return "Just now";
  }

  if (moment().diff(date, "hours") < 24) {
    return date.fromNow();
  }

  return date.format("DD MMM YYYY, hh:mm A");
};
