/**
 * Bug Condition Exploration Tests for Google Sign-In Fix
 * 
 * These tests are EXPECTED TO FAIL on unfixed code.
 * Failure confirms the bugs exist and helps understand root causes.
 * 
 * DO NOT fix these tests or the implementation when they fail.
 * Document the counterexamples to understand the bugs.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthModal } from '@/components/AuthModal'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock Supabase client
const mockSignInWithOAuth = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()

vi.mock('@/lib/supabase-client', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => ({ data: null, error: null }),
        }),
      }),
    }),
  }),
}))

vi.mock('@/lib/analytics', () => ({
  analytics: {
    openAuthModal: vi.fn(),
    login: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Google Sign-In Bug Condition Exploration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Bug Condition 1.1: User clicks "Continue with Google" → system sometimes fails to open OAuth dialog
   * Expected Behavior 2.1: System SHALL consistently open Google OAuth dialog
   * 
   * This test verifies that clicking the Google sign-in button ALWAYS calls signInWithOAuth.
   * EXPECTED TO FAIL if the button doesn't consistently trigger OAuth.
   */
  it('should consistently open OAuth dialog when clicking "Continue with Google"', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null })

    const onClose = vi.fn()
    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={onClose} />
      </AuthProvider>
    )

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    
    // Click the button once to verify OAuth is triggered
    fireEvent.click(googleButton)
    
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledTimes(1)
    })

    // Verify OAuth was called with correct parameters
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  })

  /**
   * Bug Condition 1.2: User clicks "Continue with Google" in AuthModal → modal closes immediately
   * Expected Behavior 2.2: Modal SHALL remain open or handle OAuth redirect properly
   * 
   * This test verifies that the modal does NOT close when OAuth is initiated.
   * EXPECTED TO FAIL if onClose is called immediately after clicking Google sign-in.
   */
  it('should keep AuthModal open during OAuth flow', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null })

    const onClose = vi.fn()
    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={onClose} />
      </AuthProvider>
    )

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    fireEvent.click(googleButton)

    // Wait a bit to see if modal closes prematurely
    await new Promise(resolve => setTimeout(resolve, 100))

    // Modal should NOT close during OAuth initiation
    // It should only close after successful authentication
    expect(onClose).not.toHaveBeenCalled()
  })

  /**
   * Bug Condition 1.3: OAuth callback receives authorization code → system fails with "invalid key" errors
   * Expected Behavior 2.3: System SHALL successfully exchange authorization code for session
   * 
   * This test verifies that environment variables are properly configured.
   * EXPECTED TO FAIL if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing/invalid.
   */
  it('should handle OAuth callback without "invalid key" errors', async () => {
    // Verify environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL must be defined').toBeDefined()
    expect(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL must not be empty').not.toBe('')
    expect(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined').toBeDefined()
    expect(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY must not be empty').not.toBe('')

    // Verify the URL format is valid
    expect(() => new URL(supabaseUrl!), 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL').not.toThrow()
    
    // Verify the anon key looks like a JWT (basic format check)
    expect(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY should contain JWT-like structure').toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
  })

  /**
   * Bug Condition 1.4: User successfully authenticates with Google → system fails to establish session
   * Expected Behavior 2.4: System SHALL establish session and update UI to authenticated state
   * 
   * This test verifies that successful OAuth triggers auth state change and session establishment.
   * EXPECTED TO FAIL if the auth state change handler doesn't properly update the user state.
   */
  it('should establish session after successful Google authentication', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
    }

    // Simulate successful OAuth flow
    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } },
    })

    let authStateCallback: any
    mockOnAuthStateChange.mockImplementation((callback) => {
      authStateCallback = callback
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      }
    })

    const onClose = vi.fn()
    const onSuccess = vi.fn()
    
    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />
      </AuthProvider>
    )

    // Simulate auth state change after OAuth redirect
    if (authStateCallback) {
      await authStateCallback('SIGNED_IN', { user: mockUser })
    }

    // Wait for state updates
    await waitFor(() => {
      // The modal should close after successful authentication
      expect(onClose).toHaveBeenCalled()
    }, { timeout: 2000 })

    // Success callback should be triggered
    expect(onSuccess).toHaveBeenCalled()
  })

  /**
   * Bug Condition 1.5: Supabase environment variables not configured → system fails silently or with cryptic errors
   * Expected Behavior 2.5: System SHALL provide clear error messages for missing/invalid env vars
   * 
   * This test verifies that missing environment variables produce clear error messages.
   * EXPECTED TO FAIL if the system doesn't validate env vars or provides cryptic errors.
   */
  it('should provide clear error messages for missing Supabase environment variables', async () => {
    // Save original env vars
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    try {
      // Test with missing URL
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Mock signInWithOAuth to simulate what would happen with missing env vars
      mockSignInWithOAuth.mockRejectedValue(
        new Error('Invalid API key or Supabase URL not configured')
      )

      const onClose = vi.fn()
      render(
        <AuthProvider>
          <AuthModal isOpen={true} onClose={onClose} />
        </AuthProvider>
      )

      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      fireEvent.click(googleButton)

      // Should show a clear error message, not fail silently
      await waitFor(() => {
        const errorMessage = screen.queryByText(/invalid api key|supabase url not configured/i)
        expect(errorMessage, 'Should display an error message for missing env vars').toBeInTheDocument()
      })

      // The error should be descriptive, not cryptic
      const errorText = screen.getByText(/invalid api key|supabase url not configured/i).textContent
      expect(errorText, 'Error message should mention configuration or API key').toMatch(/api key|configuration|supabase/i)
    } finally {
      // Restore original env vars
      if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
      if (originalKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey
    }
  })
})
