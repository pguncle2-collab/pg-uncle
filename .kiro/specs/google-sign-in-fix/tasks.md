# Implementation Plan

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Google OAuth Sign-In Failures
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bugs exist
  - **Scoped PBT Approach**: For deterministic bugs, scope the properties to the concrete failing cases to ensure reproducibility
  - Test that clicking "Continue with Google" consistently opens OAuth dialog (Bug Condition 1.1)
  - Test that AuthModal remains open during OAuth flow (Bug Condition 1.2)
  - Test that OAuth callback handles authorization code without "invalid key" errors (Bug Condition 1.3)
  - Test that successful Google authentication establishes session (Bug Condition 1.4)
  - Test that missing Supabase environment variables produce clear error messages (Bug Condition 1.5)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bugs exist)
  - Document counterexamples found to understand root causes
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Google Authentication Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (email/password authentication)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Test that email/password sign-in continues to work (Preservation 3.1)
  - Test that email/password sign-up continues to work (Preservation 3.2)
  - Test that existing authenticated sessions are maintained (Preservation 3.3)
  - Test that AuthModal functions correctly for email authentication (Preservation 3.4)
  - Test that sign-out clears session properly (Preservation 3.5)
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Fix Google OAuth sign-in issues

  - [x] 3.1 Fix OAuth dialog opening reliability
    - Ensure signInWithOAuth is called with correct provider configuration
    - Add error handling for OAuth initialization failures
    - Verify redirect URL configuration in Supabase client
    - _Bug_Condition: User clicks "Continue with Google" button_
    - _Expected_Behavior: System consistently opens Google OAuth dialog (2.1)_
    - _Preservation: Email/password authentication continues to work (3.1, 3.2)_
    - _Requirements: 1.1, 2.1_

  - [x] 3.2 Fix AuthModal premature closure during OAuth flow
    - Prevent modal from closing when OAuth flow is initiated
    - Handle OAuth redirect flow properly to maintain authentication state
    - Consider using popup mode or proper redirect handling
    - _Bug_Condition: User clicks "Continue with Google" in AuthModal_
    - _Expected_Behavior: Modal remains open or handles redirect without losing state (2.2)_
    - _Preservation: AuthModal functions correctly for email authentication (3.4)_
    - _Requirements: 1.2, 2.2_

  - [x] 3.3 Fix Supabase environment variable configuration
    - Verify NEXT_PUBLIC_SUPABASE_URL is properly configured
    - Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is properly configured
    - Add validation for required environment variables at startup
    - Provide clear error messages when variables are missing or invalid
    - _Bug_Condition: OAuth callback receives authorization code with missing/incorrect env vars_
    - _Expected_Behavior: System successfully exchanges code for session with proper credentials (2.3, 2.5)_
    - _Preservation: Existing session management continues to work (3.3)_
    - _Requirements: 1.3, 1.5, 2.3, 2.5_

  - [x] 3.4 Fix session establishment after OAuth callback
    - Ensure OAuth callback properly exchanges authorization code for session
    - Verify session is stored correctly in cookies/storage
    - Update AuthContext to reflect authenticated state after redirect
    - Handle callback route errors gracefully
    - _Bug_Condition: User successfully authenticates with Google and is redirected back_
    - _Expected_Behavior: System establishes session and updates UI to show authenticated state (2.4)_
    - _Preservation: Session state maintenance continues to work (3.3)_
    - _Requirements: 1.4, 2.4_

  - [x] 3.5 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Google OAuth Sign-In Success
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from step 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Google Authentication Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions in email/password auth, session management, sign-out)

- [x] 4. Checkpoint - Ensure all tests pass
  - Verify all bug condition tests pass (Google OAuth works reliably)
  - Verify all preservation tests pass (email/password auth unchanged)
  - Test end-to-end Google sign-in flow manually
  - Ensure clear error messages appear when environment variables are misconfigured
  - Ask the user if questions arise
