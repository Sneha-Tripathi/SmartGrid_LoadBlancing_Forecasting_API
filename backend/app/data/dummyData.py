dashboard_cards = [
    {
        "title": "Current Load",
        "value": "2.54 MW",
        "status": "Live",
        "change": "+4.2%"
    },
    {
        "title": "Peak Load",
        "value": "3.91 MW",
        "status": "Live",
        "change": "+1.8%"
    },
    {
        "title": "Active Zones",
        "value": "18",
        "status": "Running",
        "change": "100%"
    },
    {
        "title": "Grid Health",
        "value": "98%",
        "status": "Healthy",
        "change": "Excellent"
    }
]

meter_data = [
    {
        "meter_id": "MTR-101",
        "zone": "North Zone",
        "load": "2.45 MW",
        "voltage": "228V",
        "frequency": "50 Hz",
        "status": "Normal"
    },
    {
        "meter_id": "MTR-102",
        "zone": "South Zone",
        "load": "3.82 MW",
        "voltage": "230V",
        "frequency": "50 Hz",
        "status": "High"
    },
    {
        "meter_id": "MTR-103",
        "zone": "East Zone",
        "load": "1.98 MW",
        "voltage": "224V",
        "frequency": "49.9 Hz",
        "status": "Normal"
    },
    {
        "meter_id": "MTR-104",
        "zone": "West Zone",
        "load": "4.76 MW",
        "voltage": "233V",
        "frequency": "50.1 Hz",
        "status": "Critical"
    }
]

alerts = [
    {
        "type": "High Load",
        "zone": "North Zone",
        "time": "2 min ago"
    },
    {
        "type": "Voltage Drop",
        "zone": "West Zone",
        "time": "8 min ago"
    },
    {
        "type": "Grid Balanced",
        "zone": "Central Zone",
        "time": "15 min ago"
    }
]

activities = [
    {
        "time": "09:45 AM",
        "event": "Load Forecast Generated"
    },
    {
        "time": "09:30 AM",
        "event": "New Meter Connected"
    },
    {
        "time": "09:12 AM",
        "event": "Voltage Restored"
    },
    {
        "time": "08:58 AM",
        "event": "Critical Alert Resolved"
    }
]