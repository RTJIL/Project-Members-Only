document.addEventListener('DOMContentLoaded', () => {
  const password = document.getElementById('password')
  const confirmPassword = document.getElementById('passcon')
  const message = document.getElementById('passwordMessage')
  const submitButton = document.querySelector('button[type="submit"]')

  // Hide it by default
  message.style.display = 'none'

  function checkPasswordsMatch() {
    if (confirmPassword.value === '') {
      message.style.display = 'none'
      submitButton.disabled = true
      return
    }

    message.style.display = 'block'

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
