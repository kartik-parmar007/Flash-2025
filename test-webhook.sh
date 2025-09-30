#!/bin/bash

# Test script to verify your n8n webhook is working
# This tests the exact URL you provided

echo "🔍 Testing n8n webhook connection..."
echo "📍 URL: http://10.25.82.118:5678/webhook-test/01358e77-0252-46c7-80f9-200524927bdc"
echo ""

# Test with curl
echo "1️⃣ Testing with simple POST request..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": "connection", "message": "Test from curl"}' \
  http://10.25.82.118:5678/webhook-test/01358e77-0252-46c7-80f9-200524927bdc \
  -w "\n\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -v

echo ""
echo "2️⃣ Testing with form data (like the app sends)..."
curl -X POST \
  -F "test=connection_test" \
  -F "message=Test from curl with form data" \
  http://10.25.82.118:5678/webhook-test/01358e77-0252-46c7-80f9-200524927bdc \
  -w "\n\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -v

echo ""
echo "✅ If you see HTTP 200/201/202, your webhook is working!"
echo "❌ If you see connection refused, check if n8n is running on 10.25.82.118:5678"
echo "❌ If you see 404, the webhook path might be incorrect"