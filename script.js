document.addEventListener("DOMContentLoaded", function () {
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
            "Automotive Technician": ["SWAM 1103", "SWAM 1521"],
            "Commercial Driver's License Class A": ["TECD 1100"]
        }
    };

    Object.keys(catalogData).forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    yearFilter.addEventListener("change", function () {
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

    programFilter.addEventListener("change", function () {
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

    courseFilter.addEventListener("change", function () {
        let selectedYear = yearFilter.value;
        let selectedProgram = programFilter.value;
        let selectedCourse = courseFilter.value;
        if (selectedYear && selectedProgram && selectedCourse) {
            let pdfPath = `pdfs/${selectedYear}/${selectedProgram}/${encodeURIComponent(selectedCourse)}.pdf`;
            loadPDF(pdfPath, searchBar.value);
        }
    });

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
                loadPDF(pdf, query);
            });
            searchResults.appendChild(item);
        });
    });

    function loadPDF(pdfUrl, keyword) {
        pdfViewer.src = pdfUrl;
        pdfViewer.onload = function () {
            highlightPDFText(pdfUrl, keyword);
        };
    }

    async function highlightPDFText(pdfUrl, keyword) {
        if (!keyword) return;

        let pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            let page = await pdf.getPage(pageNum);
            let textContent = await page.getTextContent();

            textContent.items.forEach(item => {
                if (item.str.toLowerCase().includes(keyword.toLowerCase())) {
                    let textLayer = document.querySelector(".textLayer");
                    let span = document.createElement("span");
                    span.classList.add("highlight");
                    span.style.left = `${item.transform[4]}px`;
                    span.style.top = `${item.transform[5]}px`;
                    span.style.position = "absolute";
                    span.style.backgroundColor = "yellow";
                    span.style.opacity = "0.6";
                    span.textContent = item.str;
                    textLayer.appendChild(span);
                }
            });
        }
    }

    async function indexPDFs() {
        let pdfList = [
            "pdfs/2024-25/Advanced Emergency Medical Technician/TEEM 1201.pdf",
            "pdfs/2024-25/Advanced Emergency Medical Technician/TEEM 1900.pdf",
            "pdfs/2024-25/Automation Technology/TEAM 1010.pdf",
            "pdfs/2024-25/Automotive Technician/SWAM 1103.pdf",
            "pdfs/2024-25/Automotive Technician/SWAM 1521.pdf",
            "pdfs/2024-25/Commercial Driver's License Class A/TECD 1100.pdf"
        ];

        let index = {};
        for (let pdf of pdfList) {
            index[pdf] = await extractTextFromPDF(pdf);
        }

        localStorage.setItem("pdfIndex", JSON.stringify(index));
        console.log("PDFs Indexed:", index);
    }

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

    indexPDFs();

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

                data[year][program].forEach(course => {
                    let courseNode = document.createElement("li");
                    courseNode.innerHTML = `📄 <span class="pdf-link">${course}</span>`;
                    courseNode.addEventListener("click", () => {
                        let pdfPath = `pdfs/${year}/${program}/${encodeURIComponent(course)}.pdf`;
                        loadPDF(pdfPath, searchBar.value);
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
