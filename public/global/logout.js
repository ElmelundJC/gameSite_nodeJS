let logoutBtn = document.querySelector('.logout-btn').addEventListener('click', logoutFnk);
   
   async function logoutFnk(){
        await fetch('/api/users/logout', {
            method: 'GET',
        });
    }; 