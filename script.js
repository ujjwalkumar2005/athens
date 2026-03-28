let heading = document.querySelector('h1')

function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}



heading.addEventListener('mouseenter', () => {
    heading.style.color = getRandomRGB()
})


if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}


const attendanceForm = document.getElementById('attend');

attendanceForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // This stops the page from refreshing

    // 1. Collect data from your HTML inputs
    const attendanceData = {
        studentName: document.getElementById('studentName').value,
        rollNumber: document.getElementById('rollNumber').value,
        status: document.getElementById('attendanceStatus').value,
        date: new Date().toLocaleDateString() // Adds today's date automatically
    };

    try {
        // 2. Send the data to your Node.js backend
        const response = await fetch('http://localhost:5000/api/mark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendanceData)
        });

        const result = await response.json();

        // 3. Handle the response from the server
        if (response.ok) {
            alert("Success: " + result.message);
            attendanceForm.reset(); // Clears the form for the next student
        } else {
            alert("Error: " + result.error);
        }

    } catch (error) {
        console.error("Connection failed:", error);
        alert("Server is not running. Please start your backend first!");
    }
});



const loadBtn = document.getElementById('loadRecords');
const displayList = document.getElementById('recordsDisplay');

loadBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/records');
        const data = await response.json();

        displayList.innerHTML = ""; // Clear the list first

        data.forEach(record => {
            const li = document.createElement('li');
            li.textContent = `${record.studentName} (Roll_no : ${record.rollNumber}) - ${record.status} on ${record.date}`;
            displayList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});


const clearBtn = document.getElementById('clearDisplay');

clearBtn.addEventListener('click', () => {
    // This just empties the <ul> or <div> on your screen
    document.getElementById('recordsDisplay').innerHTML = "";
    console.log("Display cleared, but data is still in MongoDB.");
});


const deleteDataBtn = document.getElementById('deleteDatabase');

deleteDataBtn.addEventListener('click', async () => {
    const confirmDelete = confirm("Are you sure you want to delete ALL records from the database?");
    
    if (confirmDelete) {
        try {
            const response = await fetch('http://localhost:5000/api/clear-all', {
                method: 'DELETE'
            });
            const result = await response.json();
            
            alert(result.message);
            // Also clear the screen after deleting from DB
            document.getElementById('recordsDisplay').innerHTML = ""; 
            
        } catch (error) {
            console.error("Delete failed:", error);
        }
    }
});








let form_cont = document.querySelector('.box');

form_cont.addEventListener('click', () => {
    // 1. Immediate feedback (The "Smooth" part starts)
    form_cont.style.cursor = 'wait'; 
    
    // 2. Start the fade-out animation
    document.querySelector('.box').classList.add('fade-away');
    document.querySelector('.box1').classList.add('fade-away');

    // 3. The Delay
    // I reduced this to 600ms for a "small and smooth" feel. 
    // 3000ms (3 seconds) usually feels like the site has crashed!
    setTimeout(() => {
        // Hide the old stuff
        document.querySelector('.box').hidden = true;
        document.querySelector('.box1').hidden = true;

        // Show the form
        let form = document.querySelector('form');
        form.hidden = false;

        let attendance = document.querySelector('#attendanceList')
        attendance.hidden = false;
        
        // Optional: Fade the form IN
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.transition = 'opacity 0.5s ease';
            form.style.opacity = '1';
        }, 10);

    }, 600); // 600ms is the sweet spot for "smooth"
});
