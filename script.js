const GITHUB_REPORTS_FOLDER = "https://api.github.com/repos/uliya-ashfaque/Get-to-know-Uliya/contents/reports";
const REPORTS_JSON_URL = "https://raw.githubusercontent.com/uliya-ashfaque/Get-to-know-Uliya/main/reports.json";

async function fetchReports() {
    const reportsContainer = document.getElementById("reports");
    reportsContainer.innerHTML = "<p>Loading reports...</p>";

    try {
        // Fetch GitHub API data with proper headers
        const [filesRes, jsonRes] = await Promise.all([
            fetch(GITHUB_REPORTS_FOLDER, {
                headers: { Accept: "application/vnd.github.v3+json" }
            }),
            fetch(REPORTS_JSON_URL)
        ]);

        if (!filesRes.ok || !jsonRes.ok) throw new Error("Failed to fetch data");

        const [filesData, jsonData] = await Promise.all([
            filesRes.json(),
            jsonRes.json()
        ]);

        reportsContainer.innerHTML = "";

        if (!Array.isArray(filesData) || !Array.isArray(jsonData)) {
            throw new Error("Invalid JSON structure");
        }

        // Process files
        for (const file of filesData) {
            if (!file.download_url) continue; // Skip files with no valid download URL

            const reportInfo = jsonData.find(item => item.name === file.name);
            const reportDiv = document.createElement("div");
            reportDiv.className = "report-item";

            reportDiv.innerHTML = `
                ${reportInfo?.image ? `
                    <img src="${reportInfo.image}" 
                         alt="${file.name}" 
                         class="report-image"
                         onerror="this.style.display='none'"> <!-- Hide if image fails -->
                ` : ''}
                <a href="${file.download_url}" 
                   target="_blank" 
                   class="report-link">
                    ${file.name}
                </a>
                ${reportInfo?.comment ? `<p class="report-comment">${reportInfo.comment}</p>` : ''}
            `;

            reportsContainer.appendChild(reportDiv);
        }

    } catch (error) {
        console.error("Error fetching reports:", error);
        reportsContainer.innerHTML = `<p class="error">Failed to load reports: ${error.message}</p>`;
    }
}

// Call function on page load
window.addEventListener("load", fetchReports);
    
    let logs = JSON.parse(localStorage.getItem("dailyLogs")) || [];
    let list = document.getElementById("log-list");

    logs.forEach((log) => {
        let li = document.createElement("li");
        li.textContent = log;
        li.classList.add("log-item");
        list.appendChild(li);
    });


// Fetch Reports from Backend API (Flask API running on localhost)
window.onload = function () {
    fetchReports();
    
    fetch("http://localhost:5000/reports")
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("report-list");
            list.innerHTML = ""; // Clear previous content
            data.forEach(report => {
                let li = document.createElement("li");
                li.innerHTML = `<strong>${report.title}</strong> - <a href="${report.link}" target="_blank">View Report</a>`;
                list.appendChild(li);
            });
        });
};

// Add a new report to the server
function addReport() {
    const title = document.getElementById("title").value;
    const link = document.getElementById("link").value;

    if (title && link) {
        fetch("http://localhost:5000/add-report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, link })
        })
        .then(response => response.json())
        .then(() => {
            alert("Report added!");
            window.location.reload(); // Refresh to show new reports
        });
    } else {
        alert("Please enter both title and link.");
    }
}


dodocument.addEventListener("scroll", function () {
    let sections = document.querySelectorAll("section");
    let navLinks = document.querySelectorAll(".nav-link");

    sections.forEach((section) => {
        let top = window.scrollY;
        let offset = section.offsetTop - 150;
        let height = section.offsetHeight;
        let id = section.getAttribute("id");

        if (top >= offset && top < offset + height) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("data-section") === id) {
                    link.classList.add("active");
                }
            });
        }
    });
});



window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);



function scrollToAbout(event) {
        event.preventDefault(); // Prevent default jump
        let aboutSection = document.getElementById("about");
        let offset = 75; // Adjust this value between 50-100 pixels

        if (aboutSection) {
            let targetPosition = aboutSection.offsetTop - offset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
    }

function smoothScroll(event, sectionId) {
        event.preventDefault(); // Prevent default anchor behavior
        let targetSection = document.getElementById(sectionId);
        let offset = 75; // Adjust between 50-100 pixels

        if (targetSection) {
            let targetPosition = targetSection.offsetTop - offset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
    }
