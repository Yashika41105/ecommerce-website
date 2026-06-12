document.addEventListener('DOMContentLoaded', () => {
  const loginDisplay = document.getElementById('login-display');
  const user = localStorage.getItem('username');

  if (user) {
    loginDisplay.innerHTML = `Welcome, ${user} (<button class="btn-link" id="logout-btn">Logout</button>)`;
    
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('username');
      showToast('You have been logged out.');
      setTimeout(() => window.location.reload(), 1500); // Reload after toast
    });

  } else {
    loginDisplay.innerHTML = `<button class="btn-link" id="login-btn">Login</button>`;
    
    document.getElementById('login-btn').addEventListener('click', () => {
      const username = prompt('Please enter your name:');
      if (username) {
        localStorage.setItem('username', username);
        showToast(`Welcome, ${username}!`);
        setTimeout(() => window.location.reload(), 1500); // Reload after toast
      }
    });
  }
});
