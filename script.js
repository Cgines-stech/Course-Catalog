document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const yearFilter = document.getElementById("yearFilter");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewerContainer = document.getElementById("pdfViewerContainer"); // Replaces iframe
    const fileTree = document.getElementById("fileTree");

    const catalogData = {
        "2024-25": {
            "Advanced Emergency Medical Technician": ["TEEM 1201", "TEEM 1900"],
            "Automation Technology": ["TEAM 1010"],
            "Automotive Technician": ["SWAM 1103", "SWAM 1521"],
            "Commercial Driver's License Class A": ["TECD 1100"],
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

    // Populate Courses Based on Selected Program
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

    // PDF.js Highlight Feature
    async function renderPDFWithHighlights(pdfUrl, keyword) {
        pdfViewerContainer.innerHTML = ""; // Clear previous PDF

        let pdf = await pdfjsLib.getDocument(pdfUrl).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            let page = await pdf.getPage(i);
            let scale = 1.5;
            let viewport = page.getViewport({ scale });

            let canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            pdfViewerContainer.appendChild(canvas);

            let context = canvas.getContext("2d");

            // Render PDF Page
            let renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;

            // Extract Text and Highlight Matches
            let textContent = await page.getTextContent();
            textContent.items.forEach((textItem) => {
                let text = textItem.str.toLowerCase();
                if (keyword && text.includes(keyword.toLowerCase())) {
                    let [x, y] = textItem.transform.slice(4, 6);
                    let width = textItem.width * scale;
                    let height = textItem.height * scale;

                    // Highlight the text
                    context.fillStyle = "yellow";
                    context.globalAlpha = 0.5;
                    context.fillRect(x, viewport.height - y, width, height);
                    context.globalAlpha = 1.0;
                }
            });
        }
    }

    // Load PDF Based on Selection
    courseFilter.addEventListener("change", function () {
        let selectedYear = yearFilter.value;
        let selectedProgram = programFilter.value;
        let selectedCourse = courseFilter.value;
        let keyword = searchBar.value.trim(); // Get search keyword

        if (selectedYear && selectedProgram && selectedCourse) {
            let pdfPath = `pdfs/${selectedYear}/${selectedProgram}/${encodeURIComponent(selectedCourse)}.pdf`;
            renderPDFWithHighlights(pdfPath, keyword);
        }
    });

    // Search PDF Contents
    searchBar.addEventListener("input", function () {
        let query = searchBar.value.toLowerCase().trim();
        searchResults.innerHTML = "";

        if (query.length < 3) return;

        let pdfList = [
            "pdfs/2024-25/Advanced Emergency Medical Technician/TEEM 1201.pdf",
            "pdfs/2024-25/Advanced Emergency Medical Technician/TEEM 1900.pdf",
            "pdfs/2024-25/Automation Technology/TEAM 1010.pdf",
            "pdfs/2024-25/Automotive Technician/SWAM 1103.pdf",
            "pdfs/2024-25/Automotive Technician/SWAM 1521.pdf",
            "pdfs/2024-25/Commercial Driver's License Class A/TECD 1100.pdf"
        ];

        let results = pdfList.filter(pdf => pdf.toLowerCase().includes(query));

        if (results.length === 0) {
            searchResults.innerHTML = "<li>No matching PDFs found</li>";
            return;
        }

        results.forEach(pdf => {
            let item = document.createElement("li");
            item.textContent = pdf.split("/").pop();
            item.addEventListener("click", () => {
                renderPDFWithHighlights(pdf, query);
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
                        if (course) {
                            let courseNode = document.createElement("li");
                            courseNode.innerHTML = `📄 <span class="pdf-link">${course}</span>`;
                            courseNode.addEventListener("click", () => {
                                let pdfPath = `pdfs/${year}/${program}/${encodeURIComponent(course)}.pdf`;
                                renderPDFWithHighlights(pdfPath, searchBar.value);
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
