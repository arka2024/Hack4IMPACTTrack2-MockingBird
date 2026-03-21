// Login Page - with Google Auth
export function renderLoginPage() {
  return `
    <div class="login-page">
      <canvas id="login-bg-canvas"></canvas>
      
      <div class="login-container">
        <div class="login-card" id="login-card">
          <!-- Top security bar -->
          <div class="login-security-bar">
            <div class="security-dot"></div>
            <span>SECURE AUTHENTICATION PORTAL</span>
            <span class="security-protocol">TLS 1.3 // AES-256</span>
          </div>

          <div class="login-header">
            <!-- Animated shield icon without radar circles -->
            <div class="login-shield-container">
              <svg class="login-shield-svg" viewBox="0 0 64 72" fill="none">
                <path class="shield-outer" d="M32 4L4 16v16c0 18 11.7 34.8 28 39.5C49.3 66.8 60 50 60 32V16L32 4z" 
                      stroke="#FF2D2D" stroke-width="1.5" fill="rgba(255,45,45,0.03)"/>
                <path class="shield-inner" d="M32 14L12 24v10c0 12.5 8.3 24.2 20 27.3 11.7-3.1 20-14.8 20-27.3V24L32 14z" 
                      fill="rgba(255,45,45,0.08)" stroke="#FF2D2D" stroke-width="0.8"/>
                <circle cx="32" cy="32" r="5" fill="#FF2D2D" opacity="0.8"/>
              </svg>
            </div>

            <h2>ACCESS TERMINAL</h2>
            <p class="login-subtitle">Authenticate to enter the Threat Intelligence Center</p>
          </div>

          <!-- Google Sign In Button -->
          <div class="google-signin-section">
            <button class="google-signin-btn" id="google-signin-btn">
              <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div class="login-divider">
            <span>OR USE CREDENTIALS</span>
          </div>

          <form id="login-form">
            <div class="form-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#475569" stroke-width="1.2">
                  <circle cx="7" cy="4" r="3"/>
                  <path d="M1.5 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>
                </svg>
                OPERATOR ID
              </label>
              <input type="text" class="form-input" id="login-email" placeholder="agent@adversaguard.ai" autocomplete="off" />
            </div>

            <div class="form-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#475569" stroke-width="1.2">
                  <rect x="2" y="6" width="10" height="7" rx="1.5"/>
                  <path d="M4 6V4a3 3 0 016 0v2"/>
                  <circle cx="7" cy="10" r="1" fill="#475569"/>
                </svg>
                ACCESS KEY
              </label>
              <input type="password" class="form-input" id="login-password" placeholder="Enter secure passphrase" />
            </div>

            <div class="form-options">
              <label class="form-checkbox">
                <input type="checkbox" checked /> Remember terminal
              </label>
              <a href="#" class="form-link">Reset Access</a>
            </div>

            <button type="submit" class="login-btn" id="login-submit">
              <span id="login-btn-text">AUTHENTICATE</span>
            </button>
          </form>

          <div class="login-footer">
            <span>New operator?</span>
            <a href="#" class="form-link">Request Clearance Level</a>
          </div>
        </div>

        <!-- Security indicators below -->
        <div class="login-security-info" id="login-security-info">
          <div class="security-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L2 4v4c0 4.4 2.6 8.5 6 9.5 3.4-1 6-5.1 6-9.5V4L8 1z" stroke="#00FF88" stroke-width="1" fill="rgba(0,255,136,0.05)"/>
              <path d="M5.5 8l2 2L10.5 6" stroke="#00FF88" stroke-width="1.2" fill="none"/>
            </svg>
            <span>256-BIT ENCRYPTED</span>
          </div>
          <div class="security-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#00FF88" stroke-width="1"/>
              <path d="M8 4v4l3 2" stroke="#00FF88" stroke-width="1.2" fill="none"/>
            </svg>
            <span>ZERO-KNOWLEDGE AUTH</span>
          </div>
          <div class="security-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="#00FF88" stroke-width="1"/>
              <path d="M4 8h8M8 4v8" stroke="#00FF88" stroke-width="1.2"/>
            </svg>
            <span>MFA PROTECTED</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
