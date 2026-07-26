import pytest


@pytest.mark.api
class TestMeterEndpoints:
    def test_get_all_meters(self, client):
        response = client.get("/meters/")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert isinstance(data["items"], list)
        assert data["total"] > 0

    def test_get_meters_with_pagination(self, client):
        response = client.get("/meters/?page=1&page_size=5")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) <= 5
        assert data["page"] == 1
        assert data["page_size"] == 5

    def test_get_meters_with_search(self, client):
        response = client.get("/meters/?search=North")
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert "North" in item["zone"] or "North" in item["meter_id"]

    def test_get_meters_filter_by_zone(self, client):
        response = client.get("/meters/?zone=North%20Zone")
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["zone"] == "North Zone"

    def test_get_meters_filter_by_status(self, client):
        response = client.get("/meters/?status=Critical")
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["status"] == "Critical"

    def test_get_meters_sorted(self, client):
        response = client.get("/meters/?sort_by=load&sort_order=desc")
        assert response.status_code == 200
        data = response.json()
        items = data["items"]
        if len(items) > 1:
            assert items[0]["load"] >= items[1]["load"]

    def test_get_single_meter(self, client):
        response = client.get("/meters/MTR-1001")
        assert response.status_code == 200
        data = response.json()
        assert data["meter_id"] == "MTR-1001"
        assert "history" in data
        assert "alerts" in data
        assert "timeline" in data

    def test_get_nonexistent_meter(self, client):
        response = client.get("/meters/MTR-FAKE")
        assert response.status_code == 404

    def test_get_zones(self, client):
        response = client.get("/meters/zones")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert "North Zone" in data
        assert len(data) > 0

    def test_get_statuses(self, client):
        response = client.get("/meters/statuses")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert "Normal" in data
        assert "Critical" in data

    def test_create_meter(self, client):
        payload = {
            "meter_id": "MTR-TEST-8888",
            "zone": "North Zone",
            "load": "1.50 MW",
            "status": "Normal",
            "type": "Smart Meter",
            "consumer": "Test",
        }
        response = client.post("/meters/", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["meter_id"] == "MTR-TEST-8888"

    def test_create_duplicate_meter(self, client):
        payload = {"meter_id": "MTR-1001", "zone": "North Zone", "load": "1.0 MW"}
        response = client.post("/meters/", json=payload)
        assert response.status_code == 409

    def test_update_meter(self, client):
        response = client.put("/meters/MTR-1001", json={"load": "3.00 MW"})
        assert response.status_code == 200
        data = response.json()
        assert data["load"] == "3.00 MW"

    def test_update_nonexistent_meter(self, client):
        response = client.put("/meters/MTR-FAKE", json={"load": "1.0 MW"})
        assert response.status_code == 404

    def test_delete_meter(self, client):
        payload = {"meter_id": "MTR-DELETE", "zone": "East Zone", "load": "1.0 MW"}
        client.post("/meters/", json=payload)
        response = client.delete("/meters/MTR-DELETE")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "meter" in data

    def test_delete_nonexistent_meter(self, client):
        response = client.delete("/meters/MTR-FAKE")
        assert response.status_code == 404
