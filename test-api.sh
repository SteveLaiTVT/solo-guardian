#!/bin/bash

# Solo Guardian API Test Script
# Tests all major endpoints with a test user

set -e  # Exit on error

API_BASE="http://localhost:3000/api/v1"
TEST_USER="testuser_$(date +%s)"
TEST_EMAIL="$TEST_USER@example.com"
TEST_PASSWORD="password123"

echo "======================================"
echo "Solo Guardian API Test Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}→ $1${NC}"
}

# Test 1: Register new user
info "Test 1: Register new user"
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"Test User\",\"username\":\"$TEST_USER\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

USER_ID=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['user']['id'])" 2>/dev/null)
if [ -z "$USER_ID" ]; then
    error "Failed to register user"
fi
success "Registered user with ID: $USER_ID"

# Test 2: Login
info "Test 2: Login with credentials"
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"identifier\":\"$TEST_USER\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['tokens']['accessToken'])" 2>/dev/null)
if [ -z "$TOKEN" ]; then
    error "Failed to login"
fi
success "Login successful, got access token"

# Test 3: Get preferences
info "Test 3: Get user preferences"
PREFS_RESPONSE=$(curl -s "$API_BASE/preferences" \
  -H "Authorization: Bearer $TOKEN")

ONBOARDING_COMPLETED=$(echo "$PREFS_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['onboardingCompleted'])" 2>/dev/null)
if [ "$ONBOARDING_COMPLETED" != "False" ]; then
    error "Expected onboardingCompleted to be False"
fi
success "Got preferences, onboardingCompleted: $ONBOARDING_COMPLETED"

# Test 4: Complete onboarding
info "Test 4: Complete onboarding"
COMPLETE_RESPONSE=$(curl -s -X POST "$API_BASE/preferences/onboarding/complete" \
  -H "Authorization: Bearer $TOKEN")

ONBOARDING_COMPLETED=$(echo "$COMPLETE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['onboardingCompleted'])" 2>/dev/null)
if [ "$ONBOARDING_COMPLETED" != "True" ]; then
    error "Failed to complete onboarding"
fi
success "Onboarding completed successfully"

# Test 5: Get profile
info "Test 5: Get user profile"
PROFILE_RESPONSE=$(curl -s "$API_BASE/preferences/profile" \
  -H "Authorization: Bearer $TOKEN")

PROFILE_ID=$(echo "$PROFILE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ "$PROFILE_ID" != "$USER_ID" ]; then
    error "Profile ID mismatch"
fi
success "Got user profile"

# Test 6: Upload avatar (if test image exists)
if [ -f "/tmp/test-avatar.jpg" ]; then
    info "Test 6: Upload avatar"
    AVATAR_RESPONSE=$(curl -s -X POST "$API_BASE/preferences/profile/avatar" \
      -H "Authorization: Bearer $TOKEN" \
      -F "avatar=@/tmp/test-avatar.jpg")

    AVATAR_URL=$(echo "$AVATAR_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['avatar'])" 2>/dev/null)
    if [ -z "$AVATAR_URL" ] || [ "$AVATAR_URL" == "None" ]; then
        error "Failed to upload avatar"
    fi
    success "Avatar uploaded: $AVATAR_URL"
else
    echo "  (Skipping: /tmp/test-avatar.jpg not found)"
fi

# Test 7: Get check-in settings
info "Test 7: Get check-in settings"
SETTINGS_RESPONSE=$(curl -s "$API_BASE/check-in-settings" \
  -H "Authorization: Bearer $TOKEN")

DEADLINE_TIME=$(echo "$SETTINGS_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['deadlineTime'])" 2>/dev/null)
if [ -z "$DEADLINE_TIME" ]; then
    error "Failed to get check-in settings"
fi
success "Got check-in settings, deadline: $DEADLINE_TIME"

# Test 8: Get today's check-in status
info "Test 8: Get today's check-in status"
TODAY_RESPONSE=$(curl -s "$API_BASE/check-ins/today" \
  -H "Authorization: Bearer $TOKEN")

HAS_CHECKED_IN=$(echo "$TODAY_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['hasCheckedIn'])" 2>/dev/null)
if [ "$HAS_CHECKED_IN" != "False" ]; then
    error "Expected hasCheckedIn to be False"
fi
success "Today's status: hasCheckedIn=$HAS_CHECKED_IN"

# Test 9: Create check-in
info "Test 9: Create check-in"
CHECKIN_RESPONSE=$(curl -s -X POST "$API_BASE/check-ins" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"note":"Test check-in"}')

CHECKIN_ID=$(echo "$CHECKIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ -z "$CHECKIN_ID" ]; then
    error "Failed to create check-in"
fi
success "Created check-in with ID: $CHECKIN_ID"

# Test 10: Verify check-in status
info "Test 10: Verify check-in status"
TODAY_RESPONSE=$(curl -s "$API_BASE/check-ins/today" \
  -H "Authorization: Bearer $TOKEN")

HAS_CHECKED_IN=$(echo "$TODAY_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['hasCheckedIn'])" 2>/dev/null)
if [ "$HAS_CHECKED_IN" != "True" ]; then
    error "Expected hasCheckedIn to be True after check-in"
fi
success "Check-in verified: hasCheckedIn=$HAS_CHECKED_IN"

echo ""
echo "======================================"
success "All tests passed!"
echo "======================================"
echo ""
echo "Test user created:"
echo "  Username: $TEST_USER"
echo "  Email: $TEST_EMAIL"
echo "  Password: $TEST_PASSWORD"
echo "  User ID: $USER_ID"
echo ""
