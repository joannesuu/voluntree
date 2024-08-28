/* eslint-disable no-console */
/* eslint-disable no-undef */

// eslint-disable-next-line no-undef
const vueinst = new Vue({
    el: "#app",
    data: {
        events: [], //store events
        userProfile: {},
        RSVPList: false,
        attendees: [],  //store attendees
        pastEvents: [], //store past events
        displayPast: false,     //determine whether to show current or past events
        currentEventName: '',   //store current event name
        editingEvent: false,    //show/hide edit event section
        currEventToEdit: '',
        currentEvent: {},   //store current event to edit
        selectedAttribute: '',
        newValue: ''
    },

    methods: {
        retrieveData() {
            fetch('/api/user', { credentials: 'include' })
                .then(response => response.json())
                .then(data => {
                    this.userProfile = data;
                    // console.log(this.userProfile);
                    // console.log('this ran');
                    //retrieve user data first before calling events
                    //because need user's branch id to display events
                    this.displayEvent();
                })
                .catch(error => console.log('Error fetching user data:' + error));
        },
        hidePastEvents() {
            this.displayPast = false;   //hide past events
        },
        showPastEvents() {
            this.displayPast = true;    //show past events
        },
        displayEvent() {
            const branchId = this.userProfile.branch_id;
            // eslint-disable-next-line no-console

            //retrieve events based on branch id
            fetch(`/manager/displayEvents?branch_id=${branchId}`)
                .then(response => response.json())
                .then(data => {
                    //filter out based on the date
                    const currentDate = new Date();
                    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
                    this.events = sortedData.filter(event => new Date(event.date) >= currentDate);
                    this.pastEvents = sortedData.filter(event => new Date(event.date) < currentDate);
                })
                .catch(error => {
                    alert("Error occurred. Could not display list of event. " + error.message);
                });
        },
        /*Method to view the RSVP list*/
        viewRSVP() {
            // eslint-disable-next-line no-console
            this.RSVPList = true;
        },
        /*Method to stop viewing the RSVP list*/
        stopViewRSVP() {
            this.RSVPList = false;
            this.currentEventName = '';
        },
        /*Method to view the list of attendees (RSVP list) for a specific event */
        getAttendees(eventId, eventName) {
            this.RSVPList = true;
            this.currentEventName = eventName;
            // console.log(eventName);
            // console.log(this.currentEventName);
            const formData = new URLSearchParams();
            formData.append('eventId', eventId);

            //Make a POST request to retrieve the RSVP list
            fetch('/manager/RSVPList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })
                .then(response => {
                    console.log(response);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    this.attendees = data;
                    // console.log(this.attendees);
                })
                .catch(error => {
                    console.error(error);
                });
        },

        //To format date and time
        formatDate(date) {
            return moment(date).format('dddd, MMMM Do YYYY');
        },
        formatTime(time) {
            return moment(time, 'HH:mm:ss').format('hh:mm A');
        },
        deleteEvent(eventId) {
            console.log(eventId);
            const formData = new URLSearchParams();

            //Delete event from databaese
            formData.append('eventId', eventId);
            fetch('/manager/deleteEvent', {
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
                    alert('Sucessfuly deleted event from database.');
                    window.location.reload();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        startEditingEvent(eventId) {
            this.editingEvent = true;   //show edit section
            this.currEventToEdit = eventId;

            //clear current event
            this.currentEvent = {};

            const formData = new URLSearchParams();
            formData.append('eventId', eventId);

            //Make request to retrieve event information
            fetch('/manager/retrieveEventInfo', {
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
                    this.currentEvent = data;
                    console.log(this.currentEvent);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        editEvent() {
            const formData = new URLSearchParams();
            formData.append('eventId', this.currEventToEdit);
            formData.append('attributeToChange', this.selectedAttribute);

            //append necessary information
            if (this.selectedAttribute === 'name') {
                formData.append('newValue', document.getElementById('name').value);
            } else if (this.selectedAttribute === 'description') {
                formData.append('newValue', document.getElementById('description').value);
            } else if (this.selectedAttribute === 'date') {
                formData.append('newValue', document.getElementById('date').value);
            } else if (this.selectedAttribute === 'start_time') {
                formData.append('newValue', document.getElementById('startTime').value);
            } else if (this.selectedAttribute === 'end_time') {
                formData.append('newValue', document.getElementById('endTime').value);
            } else if (this.selectedAttribute === 'eventAddress') {
                formData.append('newValue', "address");
                formData.append('unit', document.getElementById('unit').value);
                formData.append('streetAddress', document.getElementById('streetAddress').value);
                formData.append('city', document.getElementById('city').value);
                formData.append('state', document.getElementById('state').value);
                formData.append('postcode', document.getElementById('postCode').value);
            }

            //make request to update evnet
            fetch('/manager/updateEvent', {
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
                    alert('Sucessfully edit event information.');
                    window.location.href = '/manageEvents.html';
                })
                .catch(error => {
                    alert("Error occurred. Event information not updated. " + error.message);
                });
        },
        stopEdit() {
            this.editingEvent = false;
        }
    },
    mounted() {
        this.retrieveData();
    }
});

const vueinst2 = new Vue({
    el: "#createEvent",
    data: {
        userProfile: {}
    },
    methods: {
        retrieveData() {
            fetch('/api/user', { credentials: 'include' })
                .then(response => response.json())
                .then(data => {
                    this.userProfile = data;
                    // console.log(this.userProfile);
                    // console.log('this ran');
                })
                .catch(error => console.log('Error fetching user data:' + error));
        },
        addEvent() {
            const formData = new URLSearchParams();
            formData.append('name', document.getElementById('name').value);
            formData.append('date', document.getElementById('date').value);
            formData.append('startTime', document.getElementById('startTime').value);
            formData.append('endTime', document.getElementById('endTime').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('unit', document.getElementById('unit').value);
            formData.append('streetAddress', document.getElementById('streetAddress').value);
            formData.append('city', document.getElementById('city').value);
            formData.append('postCode', document.getElementById('postCode').value);
            formData.append('state', document.getElementById('state').value);
            formData.append('branch_id', this.userProfile.branch_id);

            //Add event to database
            fetch('/manager/addEvent', {
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
                    alert('Event successfully added');
                    window.location.href = '/manageEvents.html';
                })
                .catch(error => {
                    alert("Error occurred. Could not add event. " + error.message);
                });
        },


    },
    mounted() {
        this.retrieveData();
    }
});

const vueinst3 = new Vue({
    el: '#manageMembers',
    data: {
        members: []
    },
    methods: {
        displayMembers() {
            fetch('/manager/displayMembers')
                .then(response => response.json())
                .then(data => {
                    //sort by first name
                    this.members = data.sort((a, b) => a.first_name.localeCompare(b.first_name));
                })
                .catch(error => {
                    alert("Error occurred. Could not display list of members. " + error.message);
                });
        }
    },
    mounted() {
        this.displayMembers();
    }
});