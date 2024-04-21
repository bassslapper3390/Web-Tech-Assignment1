console.clear();

const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');
const submitBtn = document.querySelector('.submit-btn'); // Select the submit button

loginBtn.addEventListener('click', (e) => {
  let parent = e.target.parentNode.parentNode;
  Array.from(e.target.parentNode.parentNode.classList).find((element) => {
    if (element !== "slide-up") {
      parent.classList.add('slide-up')
    } else {
      signupBtn.parentNode.classList.add('slide-up')
      parent.classList.remove('slide-up')
    }
  });
});

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const form = e.target.closest('form');
  const formData = new FormData(form);
  fetch(form.action, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/index.ejs';
    } else {
      response.json().then(data => alert(data.message || 'An error occurred'));
    }
  })
  .catch(error => {
    console.error('Error occurred during form submission:', error.message);
    alert('An error occurred');
  });
});
