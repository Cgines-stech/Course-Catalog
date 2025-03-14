document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewer = document.getElementById("pdfViewer");


    const catalogData = {
        "Advanced Emergency Medical Technician": ["TEEM 1201", "TEEM 1900"],
        "Automation Technology": ["TEAM 1010"],
        "Automotive Technician": ["SWAM 1103", "SWAM 1521"],
        "Commercial Driver's License Class A": ["TECD 1100"],
        "Culinary Arts": [],
        "Electrical Apprenticeship": [],
        "Emergency Medical Technician": [],
        "Firefighter": [],
        "Information Technology": [],
        "Medical Assistant": [],
        "Medical Office Receptionist": [],
        "Nursing Assistant": [],
        "Paramedic": [],
        "Pharmacy Technician": [],
        "Phlebotomy": [],
        "Plumbing Apprenticeship": [],
        "Practical Nursing": [],
        "Production Welder": [],
        "Software Development": [],
        "Surgical Technology": [],
        "Welding Essentials": []
    };

    // Populate Programs
    Object.keys(catalogData).forEach(program => {
        let option = document.createElement("option");
        option.value = program;
        option.textContent = program;
        programFilter.appendChild(option);
    });

    // Populate Courses Based on Selected Program
    programFilter.addEventListener("change", function() {
        courseFilter.innerHTML = '<option value="">Select Course</option>';
        let selectedProgram = programFilter.value;
        if (catalogData[selectedProgram]) {
            catalogData[selectedProgram].forEach(course => {
                let option = document.createElement("option");
                option.value = course;
                option.textContent = course;
                courseFilter.appendChild(option);
            });
        }
    });

    // Load PDF Based on Selection
    courseFilter.addEventListener("change", function() {
        let selectedProgram = programFilter.value;
        let selectedCourse = courseFilter.value;
        if (selectedProgram && selectedCourse) {
            let pdfPath = `pdfs/${selectedProgram}/${encodeURIComponent(selectedCourse)}.pdf`;
            pdfViewer.src = pdfPath;
        }
    });

    // Search PDFs
    searchBar.addEventListener("input", function() {
        let query = searchBar.value.toLowerCase().trim();
        searchResults.innerHTML = "";

        if (query.length < 3) return;

        let results = [];
        Object.keys(catalogData).forEach(program => {
            catalogData[program].forEach(course => {
                if (course.toLowerCase().includes(query) || program.toLowerCase().includes(query)) {
                    results.push({ program, course });
                }
            });
        });

        if (results.length === 0) {
            searchResults.innerHTML = "<li>No matching courses found</li>";
            return;
        }

        results.forEach(({ program, course }) => {
            let item = document.createElement("li");
            item.textContent = `${program} - ${course}`;
            item.addEventListener("click", () => {
                pdfViewer.src = `pdfs/${program}/${encodeURIComponent(course)}.pdf`;
            });
            searchResults.appendChild(item);
        });
    });

    buildFileTree(catalogData);
});
