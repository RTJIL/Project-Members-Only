//passMatch.js

document.addEventListener('DOMContentLoaded', () => {
  const password = document.getElementById('password')
  const confirmPassword = document.getElementById('passcon')
  const message = document.getElementById('passwordMessage')
  const submitButton = document.querySelector('button[type="submit"]')

  function checkPasswordsMatch() {
    if (confirmPassword.value === '') {
      message.textContent = ''
      submitButton.disabled = true
      return
    }

    if (password.value === confirmPassword.value) {
      message.style.color = 'green'
      message.textContent = 'Passwords match ✅'
      submitButton.disabled = false
    } else {
      message.style.color = 'red'
      message.textContent = 'Passwords do not match ❌'
      submitButton.disabled = true
    }
  }

  password.addEventListener('input', checkPasswordsMatch)
  confirmPassword.addEventListener('input', checkPasswordsMatch)
})
