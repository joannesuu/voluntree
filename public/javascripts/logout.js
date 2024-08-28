/* eslint-disable no-console */
/* eslint-disable no-undef */

// Function to logout users from their accounts and delete sessions & cookies
function logoutUser(){
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Request cookies to check user state
    })
    .then(response =>{
        if (!response.ok) {
            if (response.headers.get("content-type").includes("application/json")) {
                return response.json().then(errData => {
                    throw new Error(errData.message);
                });
            }
            else {
                throw new Error('Server responded with a non-JSON response');
            }
        }
        return response.json();
    })
    .then(data => {
        if(data.status === 200){
            alert('Logout successful!');
            window.location.href = "/";
        }
    })
    .catch(error => {
        console.error('Error during log out: ', error);
        alert('Failed to log out\n' + error.message);
    });
}