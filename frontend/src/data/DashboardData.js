export const meterData = [
  {
    id: "MTR-101",
    zone: "North Zone",
    load: "2.45 MW",
    voltage: "228 V",
    frequency: "50 Hz",
    status: "Normal",
    updated: "2 sec ago",
  },
  {
    id: "MTR-102",
    zone: "South Zone",
    load: "3.82 MW",
    voltage: "230 V",
    frequency: "50 Hz",
    status: "High",
    updated: "10 sec ago",
  },
  {
    id: "MTR-103",
    zone: "East Zone",
    load: "1.98 MW",
    voltage: "224 V",
    frequency: "49.9 Hz",
    status: "Normal",
    updated: "15 sec ago",
  },
  {
    id: "MTR-104",
    zone: "West Zone",
    load: "4.76 MW",
    voltage: "233 V",
    frequency: "50.1 Hz",
    status: "Critical",
    updated: "5 sec ago",
  },
  {
    id: "MTR-105",
    zone: "Central Zone",
    load: "2.89 MW",
    voltage: "229 V",
    frequency: "50 Hz",
    status: "Normal",
    updated: "1 min ago",
  },
];
export const alertData = [
  {
    id: 1,
    title: "High Load Detected",
    zone: "North Zone",
    severity: "Critical",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Voltage Drop",
    zone: "West Zone",
    severity: "Warning",
    time: "8 min ago",
  },
  {
    id: 3,
    title: "Grid Balanced",
    zone: "Central Zone",
    severity: "Normal",
    time: "15 min ago",
  },
  {
    id: 4,
    title: "Forecast Updated",
    zone: "All Zones",
    severity: "Info",
    time: "28 min ago",
  },
];

export const activityData = [
  {
    id: 1,
    time: "09:45 AM",
    activity: "Load Forecast Generated",
  },
  {
    id: 2,
    time: "09:30 AM",
    activity: "New Meter Connected",
  },
  {
    id: 3,
    time: "09:12 AM",
    activity: "Voltage Restored",
  },
  {
    id: 4,
    time: "08:58 AM",
    activity: "Critical Alert Resolved",
  },
  {
    id: 5,
    time: "08:40 AM",
    activity: "Dashboard Synced",
  },
];