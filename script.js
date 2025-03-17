/* JS */
document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewer = document.getElementById("pdfViewer");

    const catalogData = {
        "Advanced Emergency Medical Technician": ["TEEM 1201", "TEEM 1900"],
        "Automation Technology": ["TEAM 1010","TEAM 1020","TEAM 1030","TEAM 1040","TEAM 1050","TEAM 1060","TEAM 1070","TEAM 1080","TEAM 1510","TEAM 1640","TEAM 2005","TEAM 2250"],
        "Automotive Technician": ["AUTO 1020", "MAST AD01", "MAST GM01", "MAST HY01", "MAST MB01", "MAST TY01", "SWAM 1103", "SWAM 1135", "SWAM 1200", "SWAM 1310", "SWAM 1440", "SWAM 1521", "SWAM 1530", "SWAM 1610", "SWAM 2620", "SWAM 2710", "SWAM 2810", "SWAM 2930", "SWAM 3005"],
        "Commercial Driver's License Class A": ["TECD 1100"],
        "Culinary Arts": ["TECA 1000", "TECA 1010", "TECA 1020", "TECA 1100", "TECA 1110", "TECA 1200", "TECA 1210", "TECA 1220", "TECA 1240", "TECA 1400", "TECA 1500", "TECA 1600", "TECA 1630", "TECA 1800", "TECA 1830", "TECA 1920"]
    };

    // Function to get query parameters from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Load PDF from URL parameter if available
    function loadPDFfromURL() {
        let pdfPath = getQueryParam("pdf");
        if (pdfPath) {
            pdfViewer.src = `pdfs/${decodeURIComponent(pdfPath)}`;
        }
    }

    // Populate Program Dropdown
    Object.keys(catalogData).forEach(program => {
        let option = document.createElement("option");
        option.value = program;
        option.textContent = program;
        programFilter.appendChild(option);
    });

    // Populate Courses Based on Selected Program
    programFilter.addEventListener("change", function () {
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

    // Update the PDF viewer when a course is selected
    courseFilter.addEventListener("change", function () {
        let selectedProgram = programFilter.value;
        let selectedCourse = courseFilter.value;
        if (selectedProgram && selectedCourse) {
            let pdfPath = `${selectedProgram}/${selectedCourse}.pdf`;
            pdfViewer.src = `pdfs/${encodeURIComponent(pdfPath)}`;
            history.pushState({}, "", `?pdf=${encodeURIComponent(pdfPath)}`); // Update URL
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
            "pdfs/Advanced Emergency Medical Technician/TEEM 1201.pdf",
            "pdfs/Advanced Emergency Medical Technician/TEEM 1900.pdf",

            "pdfs/Automation Technology/TEAM 1010.pdf",
            "pdfs/Automation Technology/TEAM 1020.pdf",
            "pdfs/Automation Technology/TEAM 1030.pdf",
            "pdfs/Automation Technology/TEAM 1040.pdf",
            "pdfs/Automation Technology/TEAM 1050.pdf",
            "pdfs/Automation Technology/TEAM 1060.pdf",
            "pdfs/Automation Technology/TEAM 1070.pdf",
            "pdfs/Automation Technology/TEAM 1080.pdf",
            "pdfs/Automation Technology/TEAM 1510.pdf",
            "pdfs/Automation Technology/TEAM 1640.pdf",
            "pdfs/Automation Technology/TEAM 2005.pdf",
            "pdfs/Automation Technology/TEAM 2210.pdf",

            "pdfs/Automotive Technician/AUTO 1020.pdf",
            "pdfs/Automotive Technician/MAST AD01.pdf",
            "pdfs/Automotive Technician/MAST GM01.pdf",
            "pdfs/Automotive Technician/MAST HY01.pdf",
            "pdfs/Automotive Technician/MAST MB01.pdf",
            "pdfs/Automotive Technician/MAST TY01.pdf",
            "pdfs/Automotive Technician/SWAM 1103.pdf",
            "pdfs/Automotive Technician/SWAM 1135.pdf",
            "pdfs/Automotive Technician/SWAM 1200.pdf",
            "pdfs/Automotive Technician/SWAM 1310.pdf",
            "pdfs/Automotive Technician/SWAM 1440.pdf",
            "pdfs/Automotive Technician/SWAM 1521.pdf",
            "pdfs/Automotive Technician/SWAM 1530.pdf",
            "pdfs/Automotive Technician/SWAM 1610.pdf",
            "pdfs/Automotive Technician/SWAM 2620.pdf",
            "pdfs/Automotive Technician/SWAM 2710.pdf",
            "pdfs/Automotive Technician/SWAM 2810.pdf",
            "pdfs/Automotive Technician/SWAM 2930.pdf",
            "pdfs/Automotive Technician/SWAM 3005.pdf",

            "pdfs/Commercial Driver's License Class A/TECD 1100.pdf",

            "pdfs/Culinary Arts/TECA 1000.pdf",
            "pdfs/Culinary Arts/TECA 1010.pdf",
            "pdfs/Culinary Arts/TECA 1020.pdf",
            "pdfs/Culinary Arts/TECA 1100.pdf",
            "pdfs/Culinary Arts/TECA 1110.pdf",
            "pdfs/Culinary Arts/TECA 1200.pdf",
            "pdfs/Culinary Arts/TECA 1210.pdf",
            "pdfs/Culinary Arts/TECA 1220.pdf",
            "pdfs/Culinary Arts/TECA 1240.pdf",
            "pdfs/Culinary Arts/TECA 1400.pdf",
            "pdfs/Culinary Arts/TECA 1500.pdf",
            "pdfs/Culinary Arts/TECA 1600.pdf",
            "pdfs/Culinary Arts/TECA 1630.pdf",
            "pdfs/Culinary Arts/TECA 1800.pdf",
            "pdfs/Culinary Arts/TECA 1830.pdf",
            "pdfs/Culinary Arts/TECA 1920.pdf"
        ];

        let index = {};

        for (let pdf of pdfList) {
            index[pdf] = await extractTextFromPDF(pdf);
        }

        localStorage.setItem("pdfIndex", JSON.stringify(index));
    }

    indexPDFs(); 

    // Search PDFs
    searchBar.addEventListener("input", function () {
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
                history.pushState({}, "", `?pdf=${encodeURIComponent(pdf.replace("pdfs/", ""))}`); // Update URL on selection
            });
            searchResults.appendChild(item);
        });
    });

    // Load PDF if URL parameter exists
    loadPDFfromURL();
});
