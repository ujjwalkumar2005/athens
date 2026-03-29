let heading = document.querySelector('h1');

function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

heading.addEventListener('mouseenter', () => {
    heading.style.color = getRandomRGB();
});

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

const attendanceForm = document.getElementById('attend');

attendanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Collect data (Check that these IDs match your HTML exactly!)
    const attendanceData = {
        studentName: document.getElementById('studentName').value,
        rollNumber: document.getElementById('rollNumber').value,
        status: document.getElementById('attendanceStatus').value,
        // Using ISO format (YYYY-MM-DD) is safer for MongoDB than toLocaleDateString
        date: new Date().toISOString().split('T')[0] 
    };

    try {
        // 2. Send the data to Render
        const response = await fetch('https://athens-f67r.onrender.com/api/mark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendanceData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Success: " + result.message);
            attendanceForm.reset();
        } else {
            // This will now tell you exactly WHICH field MongoDB didn't like
            alert("Server Error: " + (result.error || "Unknown error"));
        }

    } catch (error) {
        console.error("Connection failed:", error);
        alert("Cannot connect to server. Check if Render is awake!");
    }
});

const loadBtn = document.getElementById('loadRecords');
const displayList = document.getElementById('recordsDisplay');

loadBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('https://athens-f67r.onrender.com/api/records');
        const data = await response.json();

        displayList.innerHTML = ""; 

        data.forEach(record => {
            const li = document.createElement('li');
            li.textContent = `${record.studentName} (Roll: ${record.rollNumber}) - ${record.status} on ${record.date}`;
            displayList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load records.");
    }
});

const clearBtn = document.getElementById('clearDisplay');
clearBtn.addEventListener('click', () => {
    document.getElementById('recordsDisplay').innerHTML = "";
});

const deleteDataBtn = document.getElementById('deleteDatabase');
deleteDataBtn.addEventListener('click', async () => {
    const confirmDelete = confirm("Are you sure you want to delete ALL records from MongoDB?");
    
    if (confirmDelete) {
        try {
            const response = await fetch('https://athens-f67r.onrender.com/api/clear-all', {
                method: 'DELETE'
            });
            const result = await response.json();
            alert(result.message);
            document.getElementById('recordsDisplay').innerHTML = ""; 
        } catch (error) {
            console.error("Delete failed:", error);
        }
    }
});

// UI Transitions
let form_cont = document.querySelector('.box');
form_cont.addEventListener('click', () => {
    form_cont.style.cursor = 'wait'; 
    document.querySelector('.box').classList.add('fade-away');
    document.querySelector('.box1').classList.add('fade-away');

    setTimeout(() => {
        document.querySelector('.box').hidden = true;
        document.querySelector('.box1').hidden = true;

        let form = document.querySelector('form');
        form.hidden = false;

        let attendance = document.querySelector('#attendanceList');
        attendance.hidden = false;
        
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.transition = 'opacity 0.5s ease';
            form.style.opacity = '1';
        }, 10);
    }, 600);
});
