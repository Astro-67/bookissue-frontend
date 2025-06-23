#!/bin/bash

echo "Testing Book Issue Tracker Backend Connection..."
echo "=============================================="

# Test if backend is running
echo "1. Testing backend health..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/users/ 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding on http://localhost:8000"
    echo "   Make sure to run: cd bookissue-backend && python manage.py runserver"
    exit 1
fi

echo ""
echo "2. Testing API endpoints..."

# Test login endpoint
echo "Testing login endpoint..."
curl -s -X POST http://localhost:8000/api/users/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' \
  -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "✅ Backend connection test complete!"
echo "Now you can test the frontend login with:"
echo "   Email: student@test.com"
echo "   Password: password123"
