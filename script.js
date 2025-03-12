
document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const yearFilter = document.getElementById("yearFilter");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewer = document.getElementById("pdfViewer");
    const fileTree = document.getElementById("fileTree");

    const catalogData = {
        "2024": {
            "Advanced Emergency Medical Technician": ["TEEM 1201", "TEEM 1900"],
            "Automation Technology": ["TEAM 1010"],
            "Automotive Technician": [""],
            "Commercial Driver's License Class A": [""],
            "Culinary Arts": [""],
            "Electrical Apprenticeship": [""],
            "Emergencry Medical Technician": [""],
            "Firefighter": [""],
            "Information Technology": [""],
            "Medical Assistant": ["TEMA 1010", "TEMA 2020"],
            "Medical Office Receptionist": [""],
            "Nursing Assistant": [""],
            "Paramedic": [""],
            "Pharmacy Technician": [""],
            "Phlebotomy": [""],
            "Plumbing Apprenticeship": [""],
            "Practical Nursing": [""],
            "Production Welder": [""],
            "Software Development": [""],
            "Surgical Technology": [""],
            "Welding Essentials": [""]
        },
        "2025": {
            "Unavailable": [""]
        }
    };

    Object.keys(catalogData).forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    yearFilter.addEventListener("change", function() {
        programFilter.innerHTML = '<option value="">Select Program</option>';
        courseFilter.innerHTML = '<option value="">Select Course</option>';
        let selectedYear = yearFilter.value;
        if (selectedYear && catalogData[selectedYear]) {
            Object.keys(catalogData[selectedYear]).forEach(program => {
                let option = document.createElement("option");
                option.value = program;
                option.textContent = program;
                programFilter.appendChild(option);
            });
        }
    });

    programFilter.addEventListener("change", function() {
        courseFilter.innerHTML = '<option value="">Select Course</option>';
        let selectedYear = yearFilter.value;
        let selectedProgram = programFilter.value;
        if (selectedYear && selectedProgram && Array.isArray(catalogData[selectedYear][selectedProgram])) {
            catalogData[selectedYear][selectedProgram].forEach(course => {
                let option = document.createElement("option");
                option.value = course;
                option.textContent = course;
                courseFilter.appendChild(option);
            });
        }
    });

    courseFilter.addEventListener("change", function() {
        let selectedYear = yearFilter.value;
        let selectedProgram = programFilter.value;
        let selectedCourse = courseFilter.value;
        if (selectedYear && selectedProgram && selectedCourse) {
            let pdfPath = `pdfs/${selectedYear}/${selectedProgram}/${encodeURIComponent(selectedCourse)}.pdf`;
            pdfViewer.src = pdfPath;
        }
    });

    searchBar.addEventListener("input", function() {
        let query = searchBar.value.toLowerCase();
        searchResults.innerHTML = "";
        if (query.length < 1) return;
        Object.keys(catalogData).forEach(year => {
            Object.keys(catalogData[year]).forEach(program => {
                if (Array.isArray(catalogData[year][program])) {
                    catalogData[year][program].forEach(course => {
                        if (course.toLowerCase().includes(query)) {
                            let listItem = document.createElement("li");
                            listItem.textContent = `${year} > ${program} > ${course}`;
                            listItem.classList.add("search-result-item");
                            listItem.addEventListener("click", function() {
                                let pdfPath = `pdfs/${year}/${program}/${encodeURIComponent(course)}.pdf`;
                                pdfViewer.src = pdfPath;
                                searchBar.value = `${year} > ${program} > ${course}`;
                                searchResults.innerHTML = "";
                            });
                            searchResults.appendChild(listItem);
                        }
                    });
                }
            });
        });
        if (searchResults.children.length === 0) {
            let noResults = document.createElement("li");
            noResults.textContent = "No matching results";
            noResults.classList.add("search-result-item");
            searchResults.appendChild(noResults);
        }
    });

    document.addEventListener("click", function(event) {
        if (!searchBar.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.innerHTML = "";
        }
    });

    function buildFileTree(data, parentElement) {
        Object.keys(data).forEach(year => {
            let yearNode = document.createElement("div");
            yearNode.innerHTML = `<span class="collapsible">${year}</span>`;
            let yearList = document.createElement("ul");
            yearList.style.display = "none";
            Object.keys(data[year]).forEach(program => {
                let programNode = document.createElement("li");
                programNode.innerHTML = `<span class="collapsible">${program}</span>`;
                let programList = document.createElement("ul");
                programList.style.display = "none";
                if (Array.isArray(data[year][program])) {
                    data[year][program].forEach(course => {
                        let courseNode = document.createElement("li");
                        courseNode.textContent = course;
                        courseNode.addEventListener("click", () => {
                            let pdfPath = `pdfs/${year}/${program}/${encodeURIComponent(course)}.pdf`;
                            pdfViewer.src = pdfPath;
                        });
                        programList.appendChild(courseNode);
                    });
                }
                programNode.appendChild(programList);
                yearList.appendChild(programNode);
                programNode.querySelector(".collapsible").addEventListener("click", function() {
                    programList.style.display = programList.style.display === "none" ? "block" : "none";
                });
            });
            yearNode.appendChild(yearList);
            parentElement.appendChild(yearNode);
            yearNode.querySelector(".collapsible").addEventListener("click", function() {
                yearList.style.display = yearList.style.display === "none" ? "block" : "none";
            });
        });
    }
    buildFileTree(catalogData, fileTree);
});
