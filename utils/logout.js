// document.querySelector('#loginForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const signupBtn = document.querySelector('#loginBtn');
//     const email = document.querySelector('input[name="email"]');
//     const password = document.querySelector('input[name="password"]');

//     const result = await fetch('/api/users/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: email.value,
//           password: password.value,
//         })
//       })
//       .then(res => {
//         return res.json()
//       })
//       .then(data => {
//         console.log(data)
//         if (data.status === 'success') {
//           window.location.href = '/indexpage'
//         } else {
//           window.location.href = '/login'
//         }
//       })
//       .catch(error => console.log(error));
//   });

document.querySelector('.login-btn').addEventListener('submit', async (e) => {
    
});