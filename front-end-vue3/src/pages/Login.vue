<template>
  <div class="login-container">
    <div class="login-bg"></div>
    
    <div class="login-card-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="globe-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          
          <h1>World<span class="highlight">Pop</span></h1>
          <p class="subtitle">Global Demographic Intelligence</p>
        </div>

        <div v-if="error" class="error-alert">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Identity Access</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                v-model="username"
                type="text"
                placeholder="Operator ID"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Secure Protocol</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                v-model="password"
                type="password"
                placeholder="Access Key"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn-primary login-btn" :disabled="loading">
            <span v-if="!loading">AUTHENTICATE</span>
            <span v-else class="spinner"></span>
          </button>
        </form>

        <div class="login-footer">
          <div class="demo-credentials">
            <p>Demo Credentials: <span>admin / admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await api.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })
    
    if (response.status === 200) {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = 'Invalid username or password. Please try again.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 0% 0%, #1e1b4b 0%, #0f172a 100%);
  position: relative;
  overflow: hidden;
}

.login-bg {
  content: '';
  position: absolute;
  top: -10%;
  right: -10%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
  filter: blur(60px);
  z-index: 0;
}

.login-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 32rem;
  padding: 1rem;
}

.login-card {
  background-color: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.globe-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
  transform: rotate(4deg);
  transition: transform 0.3s;
}

.login-header:hover .globe-icon {
  transform: rotate(8deg);
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: white;
  margin-bottom: 0.5rem;
}

.login-header h1 .highlight {
  color: #6366f1;
}

.subtitle {
  color: var(--text-secondary);
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.75rem;
  display: block;
}

.error-alert {
  background-color: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 0.625rem;
  text-transform: uppercase;
}

.login-form {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-left: 0.25rem;
  margin-bottom: 0.5rem;
  font-weight: 900;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding-left: 3rem;
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.login-btn {
  width: 100%;
  height: 56px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.demo-credentials {
  display: inline-block;
  padding: 1rem;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.demo-credentials p {
  font-size: 0.625rem;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  margin: 0;
}

.demo-credentials span {
  color: #818cf8;
  margin-left: 0.5rem;
}
</style>
