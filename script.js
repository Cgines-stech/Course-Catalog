
/* JS */

document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const programFilter = document.getElementById("programFilter");
    const courseFilter = document.getElementById("courseFilter");
    const pdfViewer = document.getElementById("pdfViewer");
    let currentPDF = "";
    let currentQuery = "";

    const catalogData = {
        "Advanced Emergency Medical Technician": ["TEEM 1201", "TEEM 1900"],
        "Automation Technology": ["TEAM 1010"],
        "Automotive Technician": ["SWAM 1103", "SWAM 1521"],
        "Commercial Driver's License Class A": ["TECD 1100"]
    };

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function loadPDFfromURL() {
        let pdfPath = getQueryParam("pdf");
        if (pdfPath) {
            pdfViewer.src = `pdfs/${decodeURIComponent(pdfPath)}`;
        }
    }

    Object.keys(catalogData).forEach(program => {
        let option = document.createElement("option");
        option.value = program;
        option.textContent = program;
        programFilter.appendChild(option);
    });

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

    courseFilter.addEventListener("change", function () {
        let selectedProgram = programFilter.value;
        let selectedCourse = courseFilter.value;
        if (selectedProgram && selectedCourse) {
            let pdfPath = `${selectedProgram}/${selectedCourse}.pdf`;
            pdfViewer.src = `pdfs/${encodeURIComponent(pdfPath)}`;
            history.pushState({}, "", `?pdf=${encodeURIComponent(pdfPath)}`);
        }
    });

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

    async function indexPDFs() {
        let pdfList = [
            "pdfs/Advanced Emergency Medical Technician/TEEM 1201.pdf",
            "pdfs/Advanced Emergency Medical Technician/TEEM 1900.pdf",
            "pdfs/Automation Technology/TEAM 1010.pdf",
            "pdfs/Automotive Technician/SWAM 1103.pdf",
            "pdfs/Automotive Technician/SWAM 1521.pdf",
            "pdfs/Commercial Driver's License Class A/TECD 1100.pdf"
        ];

        let index = {};
        for (let pdf of pdfList) {
            index[pdf] = await extractTextFromPDF(pdf);
        }
        localStorage.setItem("pdfIndex", JSON.stringify(index));
    }

    indexPDFs();

    searchBar.addEventListener("input", function () {
        let query = searchBar.value.toLowerCase().trim();
        searchResults.innerHTML = "";
        currentQuery = query;

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
                currentPDF = pdf;
                highlightTextInPDF(query);
                history.pushState({}, "", `?pdf=${encodeURIComponent(pdf.replace("pdfs/", ""))}`);
            });
            searchResults.appendChild(item);
        });
    });

    async function highlightTextInPDF(query) {
        if (!query || !currentPDF) return;
    
        const pdfUrl = currentPDF; // Current PDF file's path
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const iframeDoc = pdfViewer.contentDocument || pdfViewer.contentWindow.document;
        
        // Clear any previous text layers in the iframe
        const oldTextLayer = iframeDoc.querySelector(".textLayer");
        if (oldTextLayer) oldTextLayer.remove();
    
        // Loop through each page to find and highlight text
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1 }); // Adjust scale as needed
    
            // Create a canvas to render the page (if not already rendered)
            let canvas = iframeDoc.querySelector(`#canvas-${pageNum}`);
            if (!canvas) {
                canvas = iframeDoc.createElement("canvas");
                canvas.id = `canvas-${pageNum}`;
                iframeDoc.body.appendChild(canvas);
            }
            const context = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            page.render({ canvasContext: context, viewport });
    
            // Create a text layer to overlay on the canvas
            const textContent = await page.getTextContent();
            const textLayerDiv = iframeDoc.createElement("div");
            textLayerDiv.className = "textLayer";
            textLayerDiv.style.position = "absolute";
            textLayerDiv.style.top = `${canvas.offsetTop}px`;
            textLayerDiv.style.left = `${canvas.offsetLeft}px`;
            iframeDoc.body.appendChild(textLayerDiv);
    
            // Add text spans for each piece of text content
            textContent.items.forEach((item) => {
                const span = iframeDoc.createElement("span");
                span.textContent = item.str;
                span.style.position = "absolute";
                const transform = viewport.transform;
                const [x, y] = [item.transform[4], item.transform[5]];
                span.style.left = `${x * transform[0]}px`;
                span.style.top = `${y * transform[3]}px`;
                span.style.fontSize = `${item.height}px`;
                span.style.color = "black";
    
                // Highlight matches with query
                if (span.textContent.toLowerCase().includes(query.toLowerCase())) {
                    span.style.backgroundColor = "yellow";
                }
                textLayerDiv.appendChild(span);
            });
        }
    }

    window.addEventListener("message", function (event) {
        if (event.data.type === "highlight") {
            let query = event.data.query.toLowerCase();
            let spans = document.querySelectorAll(".textLayer span");
            
            spans.forEach(span => {
                if (span.textContent.toLowerCase().includes(query)) {
                    span.style.backgroundColor = "yellow";
                }
            });
        }
    });

    // Added functionality to use `window.find`
    const findButton = document.createElement("button");
    findButton.textContent = "Find in Page";
    document.body.appendChild(findButton);

    findButton.addEventListener("click", function () {
        let query = searchBar.value.trim();
        if (query) {
            window.find(query);
        }
    });

    loadPDFfromURL();
});
