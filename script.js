document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById("searchBar");
    const yearFilter = document.getElementById("yearFilter");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewer = document.getElementById("pdfViewer");
    const fileTree = document.getElementById("fileTree");

    // Sample course data (Replace with real file paths later)
    const catalogData = {
        "2024": {
            "Business": ["Marketing", "Finance"],
            "Engineering": ["Mechanical", "Electrical"]
            "Marketing": ["Finance", "Marketing", "TEMA 1010.pdf", "TEMA 1010"]
        },
        "2025": {
            "Science": ["Biology", "Chemistry"]
        }
    };

    // Populate Year Dropdown
    Object.keys(catalogData).forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // Update Program Dropdown on Year Selection
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

    // Update Course Dropdown on Program Selection
    programFilter.addEventListener("change", function() {
        courseFilter.innerHTML = '<option value="">Select Course</option>';
        let selectedYear = yearFilter.value;
        let selectedProgram = programFilter.value;
        if (selectedYear && selectedProgram && catalogData[selectedYear][selectedProgram]) {
            catalogData[selectedYear][selectedProgram].forEach(course => {
                let option = document.createElement("option");
                option.value = course;
                option.textContent = course;
                courseFilter.appendChild(option);
            });
        }
    });

    // Load PDF on Course Selection
    courseFilter.addEventListener("change", function() {
        let selectedYear = yearFilter.value;
        let selectedProgram = programFilter.value;
        let selectedCourse = courseFilter.value;
        if (selectedYear && selectedProgram && selectedCourse) {
            let pdfPath = `pdfs/${selectedYear}/${selectedProgram}/${selectedCourse}.pdf`;
            pdfViewer.src = pdfPath;
        }
    });

    // Implement Search Functionality
    searchBar.addEventListener("input", function() {
        let query = searchBar.value.toLowerCase();
        let found = false;
        Object.keys(catalogData).forEach(year => {
            Object.keys(catalogData[year]).forEach(program => {
                catalogData[year][program].forEach(course => {
                    if (course.toLowerCase().includes(query)) {
                        let pdfPath = `pdfs/${year}/${program}/${course}.pdf`;
                        pdfViewer.src = pdfPath;
                        found = true;
                    }
                });
            });
        });
        if (!found) {
            pdfViewer.src = "";
        }
    });

    // Build File Tree (Collapsible List)
    function buildFileTree(data, parentElement) {
        Object.keys(data).forEach(year => {
            let yearNode = document.createElement("div");
            yearNode.innerHTML = `<strong>${year}</strong>`;
            let yearList = document.createElement("ul");
            Object.keys(data[year]).forEach(program => {
                let programNode = document.createElement("li");
                programNode.innerHTML = `<strong>${program}</strong>`;
                let programList = document.createElement("ul");
                data[year][program].forEach(course => {
                    let courseNode = document.createElement("li");
                    courseNode.textContent = course;
                    courseNode.addEventListener("click", () => {
                        let pdfPath = `pdfs/${year}/${program}/${course}.pdf`;
                        pdfViewer.src = pdfPath;
                    });
                    programList.appendChild(courseNode);
                });
                programNode.appendChild(programList);
                yearList.appendChild(programNode);
            });
            yearNode.appendChild(yearList);
            parentElement.appendChild(yearNode);
        });
    }

    buildFileTree(catalogData, fileTree);
});
