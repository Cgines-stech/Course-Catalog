/* JS */
document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewer = document.getElementById("pdfViewer");

    const catalogData = {
        "Advanced Emergency Medical Technician": ["TEEM 1202", "TEEM 1904"],
        "Automation Technology": ["TEAM 1010","TEAM 1020","TEAM 1030","TEAM 1040","TEAM 1050","TEAM 1060","TEAM 1070","TEAM 1080","TEAM 1510","TEAM 1640","TEAM 2005","TEAM 2210"],
        "Automotive Technology": ["TEAU 1050", "TEAU 1055", "TEAU 1140", "TEAU 1240", "TEAU 1340", "TEAU 1400", "TEAU 1500", "TEAU 1600", "TEAU 1740", "TEAU 1800", "TEAU 2640", "TEAU 2840", "TEAU 2910", "TEAU 2911", "TEAU 2912", "TEAU 2913", "TEAU 2914", "TEAU 2915"],
        "Commercial Driver's License Class A": ["TECD 1100"],
        "Culinary Arts": ["TECA 1000", "TECA 1010", "TECA 1020", "TECA 1100", "TECA 1110", "TECA 1200", "TECA 1210", "TECA 1220", "TECA 1240", "TECA 1400", "TECA 1500", "TECA 1600", "TECA 1630", "TECA 1800", "TECA 1830", "TECA 1920"],
        "Electrical Apprenticeship": ["TEEL 1110", "TEEL 1120", "TEEL 1210", "TEEL 1220", "TEEL 1310", "TEEL 1320", "TEEL 1410", "TEEL 1420"],
        "Emergency Medical Technician": ["TEEM 1011"],
        "Firefighter": ["TEFF 1100", "TEFF 1200"],
        "Information Technology": ["TEIT 1050", "TEIT 1100", "TEIT 1170", "TEIT 1200", "TEIT 1210", "TEIT 1300", "TEIT 1800", "TEIT 1810", "TEIT 2171", "TEIT 2200", "TEIT 2920"],
        "Master Esthetician": ["TEES 1010", "TEES 1020", "TEES 1030", "TEES 2010", "TEES 2020", "TEES 2030", "TEES 2991", "TEES 2992", "TEES 2993", "TEES 2994", "TEES 2995"],
        "Medical Assistant": ["TEMA 1010", "TEMA 1020", "TEMA 1030", "TEMA 1040", "TEMA 1060", "TEMA 1065", "TEMA 1080", "TEMA 1230", "TEMA 1241", "TEMA 1250", "TEMA 1900", "TEMA 1910"],
        "Medical Office Receptionist": ["TEMA 1000", "TEMA 1020", "TEMA 1030", "TEMA 1040", "TEMA 1080"],
        "Nursing Assistant": ["TENA 1110", "TENA 1900"],
        "Paramedic": ["EMSP 1110", "EMSP 1111", "EMSP 1112", "EMSP 1121", "EMSP 1130", "EMSP 1501", "EMSP 1511", "EMSP 1521", "EMSP 1531", "EMSP 2120", "EMSP 2130"],
        "Pharmacy Technician": ["TEPT 1010", "TEPT 1100", "TEPT 1110", "TEPT 1220", "TEPT 1522", "TEPT 1610", "TEPT 1900"],
        "Phlebotomy": ["TEPH 1010", "TEPH 1020"],
        "Plumbing Apprenticeship": ["TEPL 1110", "TEPL 1120", "TEPL 1210", "TEPL 1220", "TEPL 1310", "TEPL 1320", "TEPL 1410", "TEPL 1420"],
        "Practical Nursing": ["PN 1011", "PN 1021", "PN 1031", "PN 1038", "PN 1040X", "PN 1051", "PN 1063", "PN 1073", "PN 1084", "PN 1086X", "PN 1090"],
        "Software Development": ["TESD 1050", "TESD 1100", "TESD 1180", "TESD 1400", "TESD 1420", "TESD 1430", "TESD 1500", "TESD 1600", "TESD 1610", "TESD 1620", "TESD 1700", "TESD 1800", "TESD 2860"],
        "Surgical Technology": ["TESU 1010", "TESU 1020", "TESU 1030", "TESU 1040", "TESU 1050", "TESU 1060", "TESU 1070", "TESU 1221", "TESU 2900", "TESU 2910"],
        "Welding Technology": ["TEWT 1000","TEWT 1004","TEWT 1010","TEWT 1045","TEWT 1111","TEWT 1112","TEWT 1133","TEWT 1211","TEWT 1212","TEWT 1311","TEWT 1312","TEWT 1411","TEWT 1450","TEWT 1620"]
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
            "pdfs/Advanced Emergency Medical Technician/TEEM 1202.pdf",
            "pdfs/Advanced Emergency Medical Technician/TEEM 1904.pdf",

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

            "pdfs/Automotive Technology/TEAU 1050.pdf",
            "pdfs/Automotive Technology/TEAU 1055.pdf",
            "pdfs/Automotive Technology/TEAU 1140.pdf",
            "pdfs/Automotive Technology/TEAU 1240.pdf",
            "pdfs/Automotive Technology/TEAU 1340.pdf",
            "pdfs/Automotive Technology/TEAU 1400.pdf",
            "pdfs/Automotive Technology/TEAU 1500.pdf",
            "pdfs/Automotive Technology/TEAU 1600.pdf",
            "pdfs/Automotive Technology/TEAU 1740.pdf",
            "pdfs/Automotive Technology/TEAU 1800.pdf",
            "pdfs/Automotive Technology/TEAU 2640.pdf",
            "pdfs/Automotive Technology/TEAU 2840.pdf",
            "pdfs/Automotive Technology/TEAU 2910.pdf",
            "pdfs/Automotive Technology/TEAU 2911.pdf",
            "pdfs/Automotive Technology/TEAU 2912.pdf",
            "pdfs/Automotive Technology/TEAU 2913.pdf",
            "pdfs/Automotive Technology/TEAU 2914.pdf",
            "pdfs/Automotive Technology/TEAU 2915.pdf",

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
            "pdfs/Culinary Arts/TECA 1920.pdf",

            "pdfs/Electrical Apprenticeship/TEEL 1110.pdf",
            "pdfs/Electrical Apprenticeship/TEEL 1120.pdf",
            "pdfs/Electrical Apprenticeship/TEEL 1210.pdf",
            "pdfs/Electrical Apprenticeship/TEEL 1220.pdf",
            "pdfs/Electrical Apprenticeship/TEEL 1310.pdf",
            "pdfs/Electrical Apprenticeship/TEEL 1320.pdf",
            "pdfs/Electrical Apprenticeship/TEEL 1410.pdf",
            "pdfs/Electrical Apprenticeship/TEEL 1420.pdf",

            "pdfs/Emergency Medical Technician/TEEM 1011.pdf",

            "pdfs/Firefighter/TEFF 1100.pdf",
            "pdfs/Firefighter/TEFF 1200.pdf",

            "pdfs/Information Technology/TEIT 1050.pdf",
            "pdfs/Information Technology/TEIT 1100.pdf",
            "pdfs/Information Technology/TEIT 1170.pdf",
            "pdfs/Information Technology/TEIT 1200.pdf",
            "pdfs/Information Technology/TEIT 1210.pdf",
            "pdfs/Information Technology/TEIT 1300.pdf",
            "pdfs/Information Technology/TEIT 1800.pdf",
            "pdfs/Information Technology/TEIT 1810.pdf",
            "pdfs/Information Technology/TEIT 2171.pdf",
            "pdfs/Information Technology/TEIT 2200.pdf",
            "pdfs/Information Technology/TEIT 2920.pdf",

            "pdfs/Master Esthetician/TEES 1010.pdf",
            "pdfs/Master Esthetician/TEES 1020.pdf",
            "pdfs/Master Esthetician/TEES 1030.pdf",
            "pdfs/Master Esthetician/TEES 2010.pdf",
            "pdfs/Master Esthetician/TEES 2020.pdf",
            "pdfs/Master Esthetician/TEES 2030.pdf",
            "pdfs/Master Esthetician/TEES 2991.pdf",
            "pdfs/Master Esthetician/TEES 2992.pdf",
            "pdfs/Master Esthetician/TEES 2993.pdf",
            "pdfs/Master Esthetician/TEES 2994.pdf",
            "pdfs/Master Esthetician/TEES 2995.pdf",

            "pdfs/Medical Assistant/TEMA 1010.pdf",
            "pdfs/Medical Assistant/TEMA 1020.pdf",
            "pdfs/Medical Assistant/TEMA 1030.pdf",
            "pdfs/Medical Assistant/TEMA 1040.pdf",
            "pdfs/Medical Assistant/TEMA 1050.pdf",
            "pdfs/Medical Assistant/TEMA 1060.pdf",
            "pdfs/Medical Assistant/TEMA 1065.pdf",
            "pdfs/Medical Assistant/TEMA 1080.pdf",
            "pdfs/Medical Assistant/TEMA 1230.pdf",
            "pdfs/Medical Assistant/TEMA 1241.pdf",
            "pdfs/Medical Assistant/TEMA 1250.pdf",
            "pdfs/Medical Assistant/TEMA 1900.pdf",
            "pdfs/Medical Assistant/TEMA 1910.pdf",

            "pdfs/Medical Office Receptionist/TEMA 1000.pdf",
            "pdfs/Medical Office Receptionist/TEMA 1020.pdf",
            "pdfs/Medical Office Receptionist/TEMA 1030.pdf",
            "pdfs/Medical Office Receptionist/TEMA 1040.pdf",
            "pdfs/Medical Office Receptionist/TEMA 1080.pdf",

            "pdfs/Nursing Assistant/TENA 1110.pdf",
            "pdfs/Nursing Assistant/TENA 1900.pdf",

            "pdfs/Paramedic/EMSP 1110.pdf",
            "pdfs/Paramedic/EMSP 1111.pdf",
            "pdfs/Paramedic/EMSP 1112.pdf",
            "pdfs/Paramedic/EMSP 1121.pdf",
            "pdfs/Paramedic/EMSP 1130.pdf",
            "pdfs/Paramedic/EMSP 1501.pdf",
            "pdfs/Paramedic/EMSP 1511.pdf",
            "pdfs/Paramedic/EMSP 1521.pdf",
            "pdfs/Paramedic/EMSP 1531.pdf",
            "pdfs/Paramedic/EMSP 2120.pdf",
            "pdfs/Paramedic/EMSP 2130.pdf",

            "pdfs/Pharmacy Technician/TEPT 1010.pdf",
            "pdfs/Pharmacy Technician/TEPT 1100.pdf",
            "pdfs/Pharmacy Technician/TEPT 1110.pdf",
            "pdfs/Pharmacy Technician/TEPT 1220.pdf",
            "pdfs/Pharmacy Technician/TEPT 1522.pdf",
            "pdfs/Pharmacy Technician/TEPT 1610.pdf",
            "pdfs/Pharmacy Technician/TEPT 1900.pdf",

            "pdfs/Phlebotomy/TEPH 1010.pdf",
            "pdfs/Phlebotomy/TEPH 1020.pdf",

            "pdfs/Plumbing Apprenticeship/TEPL 1110.pdf",
            "pdfs/Plumbing Apprenticeship/TEPL 1120.pdf",
            "pdfs/Plumbing Apprenticeship/TEPL 1210.pdf",
            "pdfs/Plumbing Apprenticeship/TEPL 1220.pdf",
            "pdfs/Plumbing Apprenticeship/TEPL 1310.pdf",
            "pdfs/Plumbing Apprenticeship/TEPL 1320.pdf",
            "pdfs/Plumbing Apprenticeship/TEPL 1410.pdf",
            "pdfs/Plumbing Apprenticeship/TEPL 1420.pdf",

            "pdfs/Practical Nursing/PN 1011.pdf",
            "pdfs/Practical Nursing/PN 1021.pdf",
            "pdfs/Practical Nursing/PN 1031.pdf",
            "pdfs/Practical Nursing/PN 1038.pdf",
            "pdfs/Practical Nursing/PN 1040X.pdf",
            "pdfs/Practical Nursing/PN 1051.pdf",
            "pdfs/Practical Nursing/PN 1063.pdf",
            "pdfs/Practical Nursing/PN 1073.pdf",
            "pdfs/Practical Nursing/PN 1084.pdf",
            "pdfs/Practical Nursing/PN 1086X.pdf",
            "pdfs/Practical Nursing/PN 1090.pdf",

            "pdfs/Software Development/TESD 1050.pdf",
            "pdfs/Software Development/TESD 1100.pdf",
            "pdfs/Software Development/TESD 1180.pdf",
            "pdfs/Software Development/TESD 1400.pdf",
            "pdfs/Software Development/TESD 1420.pdf",
            "pdfs/Software Development/TESD 1430.pdf",
            "pdfs/Software Development/TESD 1500.pdf",
            "pdfs/Software Development/TESD 1600.pdf",
            "pdfs/Software Development/TESD 1610.pdf",
            "pdfs/Software Development/TESD 1620.pdf",
            "pdfs/Software Development/TESD 1700.pdf",
            "pdfs/Software Development/TESD 1800.pdf",
            "pdfs/Software Development/TESD 2860.pdf",

            "pdfs/Surgical Technology/TESU 1010.pdf",
            "pdfs/Surgical Technology/TESU 1020.pdf",
            "pdfs/Surgical Technology/TESU 1030.pdf",
            "pdfs/Surgical Technology/TESU 1040.pdf",
            "pdfs/Surgical Technology/TESU 1050.pdf",
            "pdfs/Surgical Technology/TESU 1060.pdf",
            "pdfs/Surgical Technology/TESU 1070.pdf",
            "pdfs/Surgical Technology/TESU 1221.pdf",
            "pdfs/Surgical Technology/TESU 2900.pdf",
            "pdfs/Surgical Technology/TESU 2910.pdf",

            "pdfs/Welding Technology/TEWT 1000.pdf",
            "pdfs/Welding Technology/TEWT 1004.pdf",
            "pdfs/Welding Technology/TEWT 1010.pdf",
            "pdfs/Welding Technology/TEWT 1045.pdf",
            "pdfs/Welding Technology/TEWT 1111.pdf",
            "pdfs/Welding Technology/TEWT 1112.pdf",
            "pdfs/Welding Technology/TEWT 1133.pdf",
            "pdfs/Welding Technology/TEWT 1211.pdf",
            "pdfs/Welding Technology/TEWT 1212.pdf",
            "pdfs/Welding Technology/TEWT 1311.pdf",
            "pdfs/Welding Technology/TEWT 1411.pdf",
            "pdfs/Welding Technology/TEWT 1450.pdf",
            "pdfs/Welding Technology/TEWT 1620.pdf"
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
