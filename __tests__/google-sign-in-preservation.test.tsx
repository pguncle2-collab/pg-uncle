/**
 * Preservation Property Tests for Google Sign-In Fix
 * 
 * These tests verify that existing email/password authentication continues to work.
 * They should PASS on unfixed code to establish baseline behavior to preserve.
 * 
 * Uses property-based testing to generate many test cases for stronger guarantees.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthModal } from '@/components/AuthModal'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import * as fc from 'fast-check'
import { renderHook } from '@testing-library/react'

// Mock Supabase client
const mockSignInWithPassword = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()

vi.mock('@/lib/supabase-client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithOAuth: vi.fn(),
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
    signup: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Preservation Property Tests - Email/Password Authentication', () => {
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
   * **Validates: Preservation 3.1**
   * 
   * Property: Email/password sign-in SHALL CONTINUE TO authenticate successfully
   * 
   * This test uses property-based testing to verify that email/password sign-in
   * works correctly across many different valid email/password combinations.
   */
  it('should authenticate successfully with valid email/password combinations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 6, maxLength: 20 }),
        async (email, password) => {
          // Setup: Mock successful authentication
          const mockUser = {
            id: `user-${email}`,
            email: email,
            user_metadata: { full_name: 'Test User' },
          }
          
          mockSignInWithPassword.mockResolvedValueOnce({
            data: { user: mockUser, session: { access_token: 'token' } },
            error: null,
          })

          // Render AuthModal in login mode
          const onClose = vi.fn()
          const { unmount } = render(
            <AuthProvider>
              <AuthModal isOpen={true} onClose={onClose} defaultTab="login" />
            </AuthProvider>
          )

          // Fill in email and password
          const emailInput = screen.getByPlaceholderText(/you@example.com/i)
          const passwordInput = screen.getByPlaceholderText(/••••••••/i)
          
          fireEvent.change(emailInput, { target: { value: email } })
          fireEvent.change(passwordInput, { target: { value: password } })

          // Submit the form
          const signInButton = screen.getByRole('button', { name: /sign in/i })
          fireEvent.click(signInButton)

          // Verify: signInWithPassword was called with correct credentials
          await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalledWith({
              email,
              password,
            })
          })

          // Verify: Modal closes on successful authentication
          await waitFor(() => {
            expect(onClose).toHaveBeenCalled()
          })

          unmount()
        }
      ),
      { numRuns: 10 } // Run 10 test cases with different email/password combinations
    )
  })

  /**
   * **Validates: Preservation 3.2**
   * 
   * Property: Email/password sign-up SHALL CONTINUE TO create accounts successfully
   * 
   * This test uses property-based testing to verify that email/password sign-up
   * works correctly across many different valid user data combinations.
   */
  it('should create accounts successfully with valid sign-up data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.emailAddress(),
        fc.string({ minLength: 10, maxLength: 15 }),
        fc.string({ minLength: 6, maxLength: 20 }),
        async (name, email, phone, password) => {
          // Clear all mocks before each property test run
          vi.clearAllMocks()
          mockGetSession.mockResolvedValue({ data: { session: null } })
          mockOnAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
          })

          // Setup: Mock successful sign-up
          const mockUser = {
            id: `user-${email}`,
            email: email,
            user_metadata: { full_name: name },
          }
          
          mockSignUp.mockResolvedValueOnce({
            data: { user: mockUser, session: { access_token: 'token' } },
            error: null,
          })

          // Mock window.alert
          const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

          // Render AuthModal in signup mode with a unique container
          const container = document.createElement('div')
          document.body.appendChild(container)
          
          const onClose = vi.fn()
          const { unmount } = render(
            <AuthProvider>
              <AuthModal isOpen={true} onClose={onClose} defaultTab="signup" />
            </AuthProvider>,
            { container }
          )

          // Fill in sign-up form
          const nameInput = container.querySelector('input[placeholder="John Doe"]') as HTMLInputElement
          const emailInput = container.querySelector('input[placeholder="you@example.com"]') as HTMLInputElement
          const phoneInput = container.querySelector('input[placeholder="+91 9350573166"]') as HTMLInputElement
          const passwordInputs = container.querySelectorAll('input[placeholder="••••••••"]')
          const termsCheckbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement
          
          fireEvent.change(nameInput, { target: { value: name } })
          fireEvent.change(emailInput, { target: { value: email } })
          fireEvent.change(phoneInput, { target: { value: phone } })
          fireEvent.change(passwordInputs[0], { target: { value: password } })
          fireEvent.change(passwordInputs[1], { target: { value: password } })
          fireEvent.click(termsCheckbox)

          // Submit the form
          const createAccountButton = container.querySelector('button[type="submit"]') as HTMLButtonElement
          fireEvent.click(createAccountButton)

          // Verify: signUp was called with correct data
          await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith({
              email,
              password,
              options: {
                data: {
                  full_name: name,
                },
              },
            })
          })

          // Verify: Success alert is shown
          await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Account created successfully!')
          })

          // Verify: Modal closes on successful sign-up
          await waitFor(() => {
            expect(onClose).toHaveBeenCalled()
          })

          alertSpy.mockRestore()
          unmount()
          document.body.removeChild(container)
        }
      ),
      { numRuns: 10 } // Run 10 test cases with different user data combinations
    )
  })

  /**
   * **Validates: Preservation 3.3**
   * 
   * Property: Authenticated sessions SHALL CONTINUE TO be maintained correctly
   * 
   * This test verifies that once a user is authenticated, their session
   * is maintained and the auth state reflects the authenticated user.
   */
  it('should maintain authenticated sessions correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 2, maxLength: 50 }),
        async (email, fullName) => {
          // Setup: Mock an existing session
          const mockUser = {
            id: `user-${email}`,
            email: email,
            user_metadata: { full_name: fullName },
          }
          
          mockGetSession.mockResolvedValueOnce({
            data: { session: { user: mockUser, access_token: 'token' } },
          })

          let authStateCallback: any
          mockOnAuthStateChange.mockImplementation((callback) => {
            authStateCallback = callback
            return {
              data: { subscription: { unsubscribe: vi.fn() } },
            }
          })

          // Render AuthProvider and check auth state
          const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
          )

          const { result } = renderHook(() => useAuth(), { wrapper })

          // Wait for session to be loaded
          await waitFor(() => {
            expect(result.current.loading).toBe(false)
          })

          // Verify: User is authenticated
          expect(result.current.isAuthenticated).toBe(true)
          expect(result.current.user).not.toBeNull()
          expect(result.current.user?.email).toBe(email)
        }
      ),
      { numRuns: 10 } // Run 10 test cases with different user data
    )
  })

  /**
   * **Validates: Preservation 3.4**
   * 
   * Property: AuthModal for email authentication SHALL CONTINUE TO function as expected
   * 
   * This test verifies that the AuthModal correctly displays and handles basic interactions
   * for email authentication, including tab switching.
   */
  it('should handle AuthModal interactions correctly for email authentication', async () => {
    // Test basic modal functionality with tab switching
    const onClose = vi.fn()
    const { unmount } = render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={onClose} defaultTab="signup" />
      </AuthProvider>
    )

    // Verify: Modal is open and shows signup tab
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument()

    // Switch to login tab
    const loginTab = screen.getAllByRole('button').find(btn => btn.textContent === 'Login')
    if (loginTab) fireEvent.click(loginTab)

    // Verify: Tab switched to login
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    })

    // Verify login form is displayed
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()

    // Switch back to signup
    const signupTab = screen.getAllByRole('button').find(btn => btn.textContent === 'Sign Up')
    if (signupTab) fireEvent.click(signupTab)

    // Verify: Tab switched back to signup
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    })

    // Verify signup form is displayed
    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()

    unmount()
  })

  /**
   * **Validates: Preservation 3.5**
   * 
   * Property: Sign-out SHALL CONTINUE TO clear session and return to unauthenticated state
   * 
   * This test verifies that signing out properly clears the session
   * and updates the auth state to unauthenticated.
   */
  it('should clear session and return to unauthenticated state on sign-out', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 2, maxLength: 50 }),
        async (email, fullName) => {
          // Setup: Mock an authenticated user
          const mockUser = {
            id: `user-${email}`,
            email: email,
            user_metadata: { full_name: fullName },
          }
          
          mockGetSession.mockResolvedValueOnce({
            data: { session: { user: mockUser, access_token: 'token' } },
          })

          let authStateCallback: any
          mockOnAuthStateChange.mockImplementation((callback) => {
            authStateCallback = callback
            return {
              data: { subscription: { unsubscribe: vi.fn() } },
            }
          })

          mockSignOut.mockResolvedValueOnce({ error: null })

          // Render AuthProvider
          const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
          )

          const { result } = renderHook(() => useAuth(), { wrapper })

          // Wait for session to be loaded
          await waitFor(() => {
            expect(result.current.loading).toBe(false)
          })

          // Verify: User is authenticated
          expect(result.current.isAuthenticated).toBe(true)

          // Sign out
          await result.current.signOut()

          // Simulate auth state change to signed out
          if (authStateCallback) {
            await authStateCallback('SIGNED_OUT', null)
          }

          // Verify: signOut was called
          expect(mockSignOut).toHaveBeenCalled()

          // Verify: User is no longer authenticated
          await waitFor(() => {
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.user).toBeNull()
          })
        }
      ),
      { numRuns: 10 } // Run 10 test cases
    )
  })
})
