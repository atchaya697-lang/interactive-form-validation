(() => {
  
  const form = document.getElementById('registration-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm-password');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmError = document.getElementById('confirm-error');

  const submitBtn = document.getElementById('submit-btn');
  const successBox = document.getElementById('success-box');

  const strengthText = document.getElementById('strength-text');


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwdRules = {
    minLen: 8,
    digit: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
    letter: /[A-Za-z]/
  };

  
  function setValid(inputEl, msgEl, msg = '') {
    inputEl.classList.remove('invalid');
    inputEl.classList.add('valid');
    msgEl.textContent = msg;
  }
  function setInvalid(inputEl, msgEl, message) {
    inputEl.classList.remove('valid');
    inputEl.classList.add('invalid');
    msgEl.textContent = message;
  }
  function clearState(inputEl, msgEl) {
    inputEl.classList.remove('invalid', 'valid');
    msgEl.textContent = '';
  }

  function validateName() {
    const v = nameInput.value.trim();
    if (!v) {
      setInvalid(nameInput, nameError, 'Name cannot be empty');
      return false;
    }
    setValid(nameInput, nameError, '');
    return true;
  }

  function validateEmail() {
    const v = emailInput.value.trim();
    if (!v) {
      setInvalid(emailInput, emailError, 'Email cannot be empty');
      return false;
    }
    if (!emailRegex.test(v)) {
      setInvalid(emailInput, emailError, 'Enter a valid email address');
      return false;
    }
    setValid(emailInput, emailError, '');
    return true;
  }

  function getPasswordStrength(pwd) {
    let score = 0;
    if (pwd.length >= pwdRules.minLen) score++;
    if (pwdRules.digit.test(pwd)) score++;
    if (pwdRules.special.test(pwd)) score++;
    if (pwdRules.letter.test(pwd) && /[A-Z]/.test(pwd)) score++; // also reward uppercase

    if (score <= 1) return 'weak';
    if (score === 2 || score === 3) return 'medium';
    return 'strong';
  }

  function updatePasswordStrength(pwd) {
    if (!pwd) {
      strengthText.textContent = '—';
      strengthText.className = '';
      return;
    }
    const strength = getPasswordStrength(pwd);
    strengthText.textContent = strength.charAt(0).toUpperCase() + strength.slice(1);
    strengthText.className = strength; 
  }

  function validatePassword() {
    const v = passwordInput.value;
    if (!v) {
      setInvalid(passwordInput, passwordError, 'Password cannot be empty');
      updatePasswordStrength('');
      return false;
    }
    if (v.length < pwdRules.minLen) {
      setInvalid(passwordInput, passwordError, Password must be at least ${pwdRules.minLen} characters);
      updatePasswordStrength(v);
      return false;
    }
    if (!pwdRules.digit.test(v)) {
      setInvalid(passwordInput, passwordError, 'Password must include at least one number');
      updatePasswordStrength(v);
      return false;
    }
    if (!pwdRules.special.test(v)) {
      setInvalid(passwordInput, passwordError, 'Password must include at least one special character');
      updatePasswordStrength(v);
      return false;
    }
    
    setValid(passwordInput, passwordError, '');
    updatePasswordStrength(v);
    return true;
  }

  function validateConfirm() {
    const v = confirmInput.value;
    if (!v) {
      setInvalid(confirmInput, confirmError, 'Please confirm your password');
      return false;
    }
    if (v !== passwordInput.value) {
      setInvalid(confirmInput, confirmError, 'Passwords do not match');
      return false;
    }
    setValid(confirmInput, confirmError, '');
    return true;
  }

  
  function checkAll() {
    const ok = validateName() && validateEmail() && validatePassword() && validateConfirm();
    submitBtn.disabled = !ok;
    return ok;
  }

  
  nameInput.addEventListener('input', () => {
    validateName();
    checkAll();
  });

  emailInput.addEventListener('input', () => {
    validateEmail();
    checkAll();
  });

  passwordInput.addEventListener('input', () => {
    validatePassword();
    validateConfirm(); 
    checkAll();
  });

  confirmInput.addEventListener('input', () => {
    validateConfirm();
    checkAll();
  });

  
  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); 

    
    const allValid = checkAll();
    if (!allValid) {
      
      const firstInvalid = form.querySelector('input.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    
    const userData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value 
    };


    try {
      const storageKey = 'ifv_users_v1';
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.push({ id: Date.now(), ...userData });
      localStorage.setItem(storageKey, JSON.stringify(existing));

      
      successBox.classList.remove('hidden');
      form.reset();
      
      [nameInput, emailInput, passwordInput, confirmInput].forEach(i => i.classList.remove('valid'));
      updatePasswordStrength('');
      submitBtn.disabled = true;

      
      setTimeout(() => successBox.classList.add('hidden'), 2500);
    } catch (err) {
      alert('Could not save data locally: ' + err.message);
    }
  });

  
  document.addEventListener('DOMContentLoaded', () => {
    checkAll();
  });
})();