# test_endpoints.py - Run this to test specific endpoints that are failing
import requests
import json

def test_endpoint(method, url, data=None, headers=None):
    try:
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers)
        
        print(f"{method:4} {url}")
        print(f"     Status: {response.status_code}")
        print(f"     Headers: {dict(response.headers)}")
        
        if response.status_code != 200:
            print(f"     Error: {response.text}")
        else:
            try:
                result = response.json()
                print(f"     Response: {json.dumps(result, indent=2)[:200]}...")
            except:
                print(f"     Response: {response.text[:200]}...")
        print("-" * 60)
        
    except Exception as e:
        print(f"     Exception: {e}")
        print("-" * 60)

def main():
    base_url = "http://localhost:8000"
    
    print("Testing API Endpoints that are failing...")
    print("=" * 60)
    
    # Test the exact endpoints that are failing
    endpoints = [
        ("GET", f"{base_url}/api/scenarios"),
        ("GET", f"{base_url}/api/scenarios/"),
        ("GET", f"{base_url}/api/defenses"),
        ("GET", f"{base_url}/api/defenses/"),
        ("GET", f"{base_url}/api/events"),
        ("GET", f"{base_url}/health"),
        ("GET", f"{base_url}/api/test"),
    ]
    
    for method, url in endpoints:
        test_endpoint(method, url)
    
    # Test with auth headers (like your frontend does)
    print("\nTesting with Authorization header (like frontend)...")
    print("=" * 60)
    
    auth_headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token-for-testing'
    }
    
    for method, url in [("GET", f"{base_url}/api/scenarios"), ("GET", f"{base_url}/api/defenses")]:
        test_endpoint(method, url, headers=auth_headers)

if __name__ == "__main__":
    main()