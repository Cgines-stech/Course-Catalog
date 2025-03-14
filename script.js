
document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const yearFilter = document.getElementById("yearFilter");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewer = document.getElementById("pdfViewer");
    const fileTree = document.getElementById("fileTree");

    const catalogData = {
        "2024-25": {
            "Advanced Emergency Medical Technician": ["TEEM 1201", "TEEM 1900"],
            "Automation Technology": ["TEAM 1010"],
            "Automotive Technician": ["SWAM 1103"],
            "Commercial Driver's License Class A": [],
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

    // Extract Text from PDFs Using PDF.js
    async function extractTextFromPDF(pdfUrl) {
        let pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            let page = await pdf.getPage(i);
            let content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ") + " ";
        }

        return text.toLowerCase();
    }

    // Index PDFs and Store in LocalStorage
    async function indexPDFs() {
        let pdfList = [
            "pdfs/2024-25/Advanced Emergency Medical Technician/TEEM 1201.pdf",
            "pdfs/2024-25/Advanced Emergency Medical Technician/TEEM 1900.pdf",
            
            "pdfs/2024-25/Automation Technology/TEAM 1010.pdf",

            "pdfs/2024-25/Automotive Technician/SWAM 1103.pdf"
        ];

        let index = {};

        for (let pdf of pdfList) {
            index[pdf] = await extractTextFromPDF(pdf);
        }

        localStorage.setItem("pdfIndex", JSON.stringify(index));
        console.log("PDFs Indexed:", index);
    }

    // Run Indexing on First Load
    indexPDFs(); // Always update the index

    // Search PDF Contents
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
                        if (course) { // Only add non-empty course names
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
    
                // Toggle Program List
                programNode.querySelector(".collapsible").addEventListener("click", function () {
                    let icon = this.innerHTML.startsWith("📁") ? "📂" : "📁";
                    this.innerHTML = `${icon} ${program}`;
                    programList.style.display = programList.style.display === "none" ? "block" : "none";
                });
    
                programNode.appendChild(programList);
                yearList.appendChild(programNode);
            });
    
            // Toggle Year List
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