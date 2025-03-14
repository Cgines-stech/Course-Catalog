document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const yearFilter = document.getElementById("yearFilter");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewer = document.getElementById("pdfViewer");
    const fileTree = document.getElementById("fileTree");
    const pdfSearchInput = document.getElementById("pdfSearchInput");
    const pdfSearchButton = document.getElementById("pdfSearchButton");

    const catalogData = {
        "2024-25": {
            "Advanced Emergency Medical Technician": ["TEEM 1201", "TEEM 1900"],
            "Automation Technology": ["TEAM 1010"],
            "Automotive Technician": ["SWAM 1103", "SWAM 1521"],
            "Commercial Driver's License Class A": ["TECD 1100"]
        },
        "2025-26": {
            "Unavailable": []
        }
    };

    // Populate Year Dropdown
    Object.keys(catalogData).forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // Populate Programs Based on Selected Year
    yearFilter.addEventListener("change", function() {
        programFilter.innerHTML = '<option value="">Select Program</option>';
        courseFilter.innerHTML = '<option value="">Select Course</option>';
        let selectedYear = yearFilter.value;
        if (catalogData[selectedYear]) {
            Object.keys(catalogData[selectedYear]).forEach(program => {
                let option = document.createElement("option");
                option.value = program;
                option.textContent = program;
                programFilter.appendChild(option);
            });
        }
    });

    // Populate Courses Based on Selected Program
    programFilter.addEventListener("change", function() {
        courseFilter.innerHTML = '<option value="">Select Course</option>';
        let selectedYear = yearFilter.value;
        let selectedProgram = programFilter.value;
        if (catalogData[selectedYear] && catalogData[selectedYear][selectedProgram]) {
            catalogData[selectedYear][selectedProgram].forEach(course => {
                let option = document.createElement("option");
                option.value = course;
                option.textContent = course;
                courseFilter.appendChild(option);
            });
        }
    });

    // Load PDF Based on Selection
    courseFilter.addEventListener("change", function() {
        let selectedYear = yearFilter.value;
        let selectedProgram = programFilter.value;
        let selectedCourse = courseFilter.value;
        if (selectedYear && selectedProgram && selectedCourse) {
            let pdfPath = `pdfs/${selectedYear}/${selectedProgram}/${encodeURIComponent(selectedCourse)}.pdf`;
            pdfViewer.src = pdfPath;
        }
    });

    // Sidebar PDF Search (unchanged)
    searchBar.addEventListener("input", function() {
        let query = searchBar.value.toLowerCase().trim();
        searchResults.innerHTML = "";

        if (query.length < 3) return;

        let pdfIndex = JSON.parse(localStorage.getItem("pdfIndex"));
        if (!pdfIndex) return;

        let results = Object.keys(pdfIndex).filter(pdf => pdfIndex[pdf].includes(query));

        if (results.length === 0) {
            searchResults.innerHTML = "<li>No matching PDFs found</li>";
            return;
        }

        results.forEach(pdf => {
            let item = document.createElement("li");
            item.textContent = pdf.split("/").pop();
            item.addEventListener("click", () => {
                pdfViewer.src = pdf;
            });
            searchResults.appendChild(item);
        });
    });

    // Search Inside PDF (Trigger "Find" in Embedded PDF Viewer)
    pdfSearchButton.addEventListener("click", function() {
        let searchQuery = pdfSearchInput.value;
        if (!searchQuery) return;

        pdfViewer.contentWindow.postMessage({ type: "search", text: searchQuery }, "*");
    });

    // Listen for Messages in Embedded PDF Viewer (Highlight Matches)
    window.addEventListener("message", function(event) {
        if (event.data.type === "pdf-loaded") {
            console.log("PDF Loaded: Ready for search");
        }
    });

    function buildFileTree(data, parentElement) {
        Object.keys(data).forEach(year => {
            let yearNode = document.createElement("div");
            yearNode.innerHTML = `<span class="collapsible">📁 ${year}</span>`;
            let yearList = document.createElement("ul");
            yearList.style.display = "none";

            Object.keys(data[year]).forEach(program => {
                let programNode = document.createElement("li");
                programNode.innerHTML = `<span class="collapsible">📁 ${program}</span>`;
                let programList = document.createElement("ul");
                programList.style.display = "none";

                if (Array.isArray(data[year][program])) {
                    data[year][program].forEach(course => {
                        if (course) {
                            let courseNode = document.createElement("li");
                            courseNode.innerHTML = `📄 <span class="pdf-link">${course}</span>`;
                            courseNode.addEventListener("click", () => {
                                let pdfPath = `pdfs/${year}/${program}/${encodeURIComponent(course)}.pdf`;
                                pdfViewer.src = pdfPath;
                            });
                            programList.appendChild(courseNode);
                        }
                    });
                }

                programNode.querySelector(".collapsible").addEventListener("click", function () {
                    let icon = this.innerHTML.startsWith("📁") ? "📂" : "📁";
                    this.innerHTML = `${icon} ${program}`;
                    programList.style.display = programList.style.display === "none" ? "block" : "none";
                });

                programNode.appendChild(programList);
                yearList.appendChild(programNode);
            });

            yearNode.querySelector(".collapsible").addEventListener("click", function () {
                let icon = this.innerHTML.startsWith("📁") ? "📂" : "📁";
                this.innerHTML = `${icon} ${year}`;
                yearList.style.display = yearList.style.display === "none" ? "block" : "none";
            });

            yearNode.appendChild(yearList);
            parentElement.appendChild(yearNode);
        });
    }

    buildFileTree(catalogData, fileTree);
});
