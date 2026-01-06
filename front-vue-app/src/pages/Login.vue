<template>
  <div class="login-page">
    <div class="login-container">
      <h1>🌍 세계 인구 대시보드</h1>

      <!-- 메시지 표시 -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">사용자명</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="사용자명을 입력하세요"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            :disabled="isLoading"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <!-- 기본 계정 정보 -->
      <div class="info-text">
        <p>기본 관리자 계정: admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'
import { setAuthToken, getErrorMessage } from '../utils/helpers'

const router = useRouter()

const formData = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const message = ref('')
const messageType = ref('') // 'error' or 'success'

const handleLogin = async () => {
  if (!formData.value.username || !formData.value.password) {
    message.value = '사용자명과 비밀번호를 입력해주세요.'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    const response = await authAPI.login(
      formData.value.username,
      formData.value.password
    )

    // 토큰 저장
    if (response.data.token) {
      setAuthToken(response.data.token)
    }

    message.value = '로그인 성공! 대시보드로 이동합니다...'
    messageType.value = 'success'

    // 2초 후 대시보드로 이동
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (error) {
    message.value = getErrorMessage(error) || '로그인 실패. 사용자명과 비밀번호를 확인하세요.'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.message {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

.message.error {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.message.success {
  background: #efe;
  color: #3c3;
  border: 1px solid #cfc;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input[type='text']:focus,
input[type='password']:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.info-text {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #999;
}

.info-text p {
  margin: 5px 0;
}
</style>
