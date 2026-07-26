import pytest
from app.data.dummyData import (
    dashboard_cards, meter_data, alerts, activities,
    meter_history, meter_alerts, meter_timeline,
)


@pytest.mark.unit
class TestDashboardCards:
    def test_cards_is_list(self):
        assert isinstance(dashboard_cards, list)
        assert len(dashboard_cards) > 0

    def test_cards_have_required_fields(self):
        for card in dashboard_cards:
            assert "title" in card
            assert "value" in card
            assert "status" in card
            assert "change" in card


@pytest.mark.unit
class TestMeterData:
    def test_meter_data_is_list(self):
        assert isinstance(meter_data, list)
        assert len(meter_data) > 0

    def test_meters_have_required_fields(self):
        for meter in meter_data:
            assert "meter_id" in meter
            assert "zone" in meter
            assert "load" in meter
            assert "status" in meter
            assert "type" in meter

    def test_meters_have_valid_status(self):
        valid = {"Normal", "Warning", "High", "Critical"}
        for meter in meter_data:
            assert meter["status"] in valid

    def test_meters_have_valid_zones(self):
        valid = {"North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"}
        for meter in meter_data:
            assert meter["zone"] in valid

    def test_meter_ids_unique(self):
        ids = [m["meter_id"] for m in meter_data]
        assert len(ids) == len(set(ids))


@pytest.mark.unit
class TestAlerts:
    def test_alerts_is_list(self):
        assert isinstance(alerts, list)
        assert len(alerts) > 0

    def test_alerts_have_required_fields(self):
        for alert in alerts:
            assert "type" in alert
            assert "zone" in alert
            assert "time" in alert


@pytest.mark.unit
class TestActivities:
    def test_activities_is_list(self):
        assert isinstance(activities, list)
        assert len(activities) > 0

    def test_activities_have_required_fields(self):
        for activity in activities:
            assert "time" in activity
            assert "event" in activity


@pytest.mark.unit
class TestMeterHistory:
    def test_meter_history_is_list(self):
        assert isinstance(meter_history, list)

    def test_history_records_have_required_fields(self):
        for entry in meter_history:
            assert "meter_id" in entry
            assert "records" in entry
            for r in entry["records"]:
                assert "date" in r
                assert "load" in r
                assert "status" in r


@pytest.mark.unit
class TestMeterAlerts:
    def test_alerts_have_required_fields(self):
        for entry in meter_alerts:
            assert "meter_id" in entry
            assert "alerts" in entry


@pytest.mark.unit
class TestMeterTimeline:
    def test_timeline_have_required_fields(self):
        for entry in meter_timeline:
            assert "meter_id" in entry
            assert "events" in entry
