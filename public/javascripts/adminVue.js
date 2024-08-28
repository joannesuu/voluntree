// eslint-disable-next-line no-undef
var vueinst = new Vue({
    el: '#app',
    data: function () {
        return {
            users: [],  //store list of users
            addingUser: false,  //determine which section to show
            editingUser: false,
            userAttribute: '',
            selectedAttribute: '',  //to store attribute to be changed
            branches: [],   //store list of branches
            user: {},
            tmpUserDetails: '',
            currentUser: {} //store current user data
        };
    },
    methods: {
        displayUsers() {
            fetch('/users/displayListOfUsers')
                .then(response => response.json())
                .then(data => {
                    //Sort the list of users
                    this.users = data.sort((a, b) => {
                        if (a.branch_name < b.branch_name) {
                            return -1;
                        }
                        if (a.branch_name > b.branch_name) {
                            return 1;
                        }

                        if (a.user_role > b.user_role) {
                            return -1;
                        }

                        if (a.user_role < b.user_role) {
                            return 1;
                        }

                        return a.first_name.localeCompare(b.first_name);
                    });
                })
                .catch(error => {
                    alert("Error occurred. Could not add display list of users. " + error.message);
                });
        },
        cancelEditingUser() {
            //hide edit user section
            this.editingUser = false;
        },
        startEditingUser(user) {
            //Show edit user section
            this.editingUser = true;
            this.user = user;
            const formData = new URLSearchParams();
            formData.append('userId', this.user.user_id);
            //Make POST request to retrieve user information
            fetch('/users/retrieveUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.json();
                })
                .then(data => {
                    // eslint-disable-next-line no-console
                    console.log(data);
                    //store currentUser information
                    this.currentUser = data;
                })
                .catch(error => {
                    alert("Error. Could not view user details." + error.message);
                });
        },
        editUser() {
            const formData = new URLSearchParams();
            formData.append('userID', this.user.user_id);
            formData.append('attributeToChange', this.selectedAttribute);

            //Append the new value for the attribute to be changed
            if (this.selectedAttribute === 'firstName') {
                formData.append('newValue', document.getElementById('editFirstName').value);
            } else if (this.selectedAttribute === 'lastName') {
                formData.append('newValue', document.getElementById('editLastName').value);
            } else if (this.selectedAttribute === 'contactNumber') {
                formData.append('newValue', document.getElementById('editContactNumber').value);
            } else if (this.selectedAttribute === 'email') {
                formData.append('newValue', document.getElementById('editEmail').value);
            }

            //Make POST request to edit user information
            fetch('/users/editUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.text();
                })
                .then(() => {
                    alert('Successfully edited user information.');
                    window.location.href = '/manageUsers.html';
                })
                .catch(error => {
                    alert("Error occurred. User information not updated. " + error.message);
                });
        },
        deleteUser(userId) {
            if (confirm("Are you sure you want to delete this user?")) {
                const formData = new URLSearchParams();
                formData.append('userID', userId);

                //Make POST request to delete user from database
                fetch('/users/deleteUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(() => {
                        alert('User deleted from database');
                        this.displayUsers();    //refresh
                    })
                    .catch(error => {
                        alert("Error occurred. Could not delete user. " + error.message);
                    });
            }
        },
        addAdmin() {
            const formData = new URLSearchParams();
            const day = document.getElementById('day').value;
            const month = document.getElementById('month').value;
            const year = document.getElementById('year').value;
            const dateOfBirth = `${year}-${month}-${day}`;

            //Append all necessary information
            formData.append('firstName', document.getElementById('addAdminFirstName').value);
            formData.append('lastName', document.getElementById('addAdminLastName').value);
            formData.append('email', document.getElementById('adminEmail').value);
            formData.append('dateOfBirth', dateOfBirth);
            formData.append('contactNumber', document.getElementById('adminContact').value);
            formData.append('userRole', 'ADMIN');
            formData.append('userPassword', document.getElementById('userPassword').value);

            //Make a POST request to add admin
            fetch('/admin/addAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.text();
                })
                .then(() => {
                    alert('Admin added to database');
                    window.location.href = '/adminLanding.html';
                })
                .catch(error => {
                    alert("Error occurred. Could not add admin. " + error.message);
                });
        },
        cancelAddUser() {
            this.addingUser = false;    //hide add user section
        },
        showAddUser() {
            this.addingUser = true; //show add user section
            this.editingUser = false;   //hide edit user section
            this.$nextTick(() => {
                // eslint-disable-next-line no-undef
                generateBirthdaySelection();
                //call function from birthday.js to populate the options for
                //date of birth
            });
            //populate options to display the list of branches
            this.displayBranch();
        },
        addUser() {
            const formData = new URLSearchParams();
            const day = document.getElementById('day').value;
            const month = document.getElementById('month').value;
            const year = document.getElementById('year').value;
            const dateOfBirth = `${year}-${month}-${day}`;
            formData.append('firstName', document.getElementById('addFirstName').value);
            formData.append('lastName', document.getElementById('addLastName').value);
            formData.append('email', document.getElementById('userEmail').value);
            // formData.append('authMethod', 'email');
            formData.append('dateOfBirth', dateOfBirth);
            formData.append('contactNumber', document.getElementById('userContact').value);
            formData.append('userRole', document.getElementById('userRole').value);
            formData.append('userBranch', document.getElementById('userBranch').value);
            formData.append('userPassword', document.getElementById('userPassword').value);

            // eslint-disable-next-line no-console
            // console.log(document.getElementById('userRole').value);

            //Make POST request to add user to database
            fetch('/users/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.text();
                })
                .then(() => {
                    alert('User added to database');
                    window.location.href = '/manageUsers.html';
                })
                .catch(error => {
                    alert("Error occurred. Could not add user. " + error.message);
                });
        },
        displayBranch() {
            //retrieve list of branches
            fetch('/admin/listBranch')
                .then(response => response.json())
                .then(data => {
                    this.branches = data;

                }).catch(error => {
                    alert("Error occurred. Could not add user. " + error.message);
                });
        },
    },
    mounted() {
        this.displayUsers();
    }
});

// eslint-disable-next-line no-undef
var vueinst2 = new Vue({
    el: '#statisticsLanding',
    data: {
        numVolunteers: 0,
        numBranches: 0
    },
    methods: {
        getStatistics() {
            //retrieve statistics
            fetch('/admin/statistics')
                .then(response => response.json())
                .then(data => {
                    //store into the respectie variables
                    this.numVolunteers = data.numVolunteers;
                    this.numBranches = data.numBranches;
                });
        }
    },
    mounted() {
        this.getStatistics();
    }
});

// eslint-disable-next-line no-undef
var vueinst3 = new Vue({
    el: '#app3',
    data: {
        editBranch: false, //to determine whether to hide/show edit branch section
        branches: [],   //to store branches
        branchAttribute: '',
        addingBranch: false,    //to determine whether to hide/show add branch section
        currentBranch: null,
        branchDetail: {}
    },
    methods: {
        displayBranch() {
            //Retrieve list of branches
            fetch('/admin/listBranch')
                .then(response => response.json())
                .then(data => {
                    this.branches = data;
                });
        },
        editingBranch(branch) {
            this.currentBranch = branch;
            this.editBranch = true; //show edit branch section
            this.addingBranch = false;  //hide add branch section

            const formData = new URLSearchParams();
            formData.append('branchId', this.currentBranch.branch_id);

            //Make request to retrieve branch details
            fetch('/admin/retrieveBranchDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.branchDetail = data;
                    // eslint-disable-next-line no-console
                    // console.log(data);

                })
                .catch(error => {
                    alert("Error occurred. Could not add branch. " + error.message);
                });
        },
        cancelEditBranch() {
            this.editBranch = false;    //hide edit branch section
        },
        saveEditBranch() {
            const formData = new URLSearchParams();
            formData.append('branchID', this.currentBranch.branch_id);
            formData.append('attributeToChange', this.branchAttribute);

            //Append the necessary information
            if (this.branchAttribute === 'branch_name') {
                formData.append('newValue', document.getElementById('name').value);
            } else if (this.branchAttribute === 'phone_number') {
                formData.append('newValue', document.getElementById('newPhoneNumber').value);
            } else if (this.branchAttribute === 'email') {
                formData.append('newValue', document.getElementById('email').value);
            } else if (this.branchAttribute === 'descriptions') {
                formData.append('newValue', document.getElementById('description').value);
            } else if (this.branchAttribute === 'address') {
                formData.append('newValue', 'address');
                formData.append('unit', document.getElementById('unit').value);
                formData.append('streetAddress', document.getElementById('streetAddress').value);
                formData.append('city', document.getElementById('city').value);
                formData.append('state', document.getElementById('state').value);
                formData.append('postcode', document.getElementById('postCode').value);
            }

            //Make request to edit branch
            fetch('/admin/editBranch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(() => {
                    alert('Branch sucessfuly edited');
                    this.editBranch = false;
                    window.location.href = '/manageBranch.html';
                })
                .catch(error => {
                    alert("Error occurred. Could not edit branch. " + error.message);
                });
        },
        startAddBranch() {
            this.addingBranch = true;   //show add branch section and hide edit branch section
            this.editBranch = false;
        },
        cancelAddBranch() {
            this.addingBranch = false;  //hide add branch section
        },
        addBranch() {
            // eslint-disable-next-line no-console
            // console.log("addBranch method called");
            const formData = new URLSearchParams();
            formData.append('branchName', document.getElementById('branchName').value);
            formData.append('branchDescription', document.getElementById('branchDescription').value);
            formData.append('branchEmail', document.getElementById('branchEmail').value);
            formData.append('branchContact', document.getElementById('branchContact').value);
            formData.append('branchUnit', document.getElementById('branchUnit').value);
            formData.append('branchStreetAddress', document.getElementById('branchStreetAddress').value);
            formData.append('branchCity', document.getElementById('branchCity').value);
            formData.append('branchPostcode', document.getElementById('branchPostcode').value);
            formData.append('branchState', document.getElementById('branchState').value);

            //Add branch to datbase
            fetch('/admin/addBranch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(() => {
                    alert('Branch added to database');
                    window.location.href = '/manageBranch.html';
                })
                .catch(error => {
                    alert("Error occurred. Could not add branch. " + error.message);
                });
        },
        getBranchDetails() {

        }
    },
    mounted() {
        this.displayBranch();
    }
});