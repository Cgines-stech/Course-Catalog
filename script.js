
/* JS */

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");
const programFilter = document.getElementById("programFilter");
const courseFilter = document.getElementById("courseFilter");
const pdfCanvas = document.getElementById("pdfCanvas");
const ctx = pdfCanvas.getContext("2d");

let currentPDF = null;
let currentPage = null;
let searchTerm = "";

// Sample catalog data (replace with actual data)
const catalogData = {
    "Advanced Emergency Medical Technician": ["TEEM 1201", "TEEM 1900"],
    "Automation Technology": ["TEAM 1010"],
    "Automotive Technician": ["SWAM 1103", "SWAM 1521"],
    "Commercial Driver's License Class A": ["TECD 1100"]
};

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
        let pdfPath = `pdfs/${selectedProgram}/${selectedCourse}.pdf`;
        loadPDF(pdfPath);
        history.pushState({}, "", `?pdf=${encodeURIComponent(pdfPath)}`); // Update URL
    }
});

// Function to load and render PDF
async function loadPDF(pdfUrl) {
    let pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    currentPDF = pdf;
    renderPage(1); // Load the first page by default
}

// Function to render PDF page and apply highlighting
async function renderPage(pageNum) {
    let page = await currentPDF.getPage(pageNum);
    currentPage = page;

    let viewport = page.getViewport({ scale: 1.5 });
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    let renderContext = {
        canvasContext: ctx,
        viewport: viewport,
    };

    await page.render(renderContext).promise;
    highlightText();
}

// Function to extract text and apply highlighting
async function highlightText() {
    if (!searchTerm) return; // If no search term, skip highlighting

    let textContent = await currentPage.getTextContent();
    textContent.items.forEach(item => {
        if (item.str.toLowerCase().includes(searchTerm.toLowerCase())) {
            ctx.fillStyle = "yellow"; // Highlight color
            ctx.globalAlpha = 0.5;
            ctx.fillRect(item.transform[4], item.transform[5] - 10, item.width, 12);
        }
    });

    ctx.globalAlpha = 1; // Reset transparency
}

// Event listener for search input
searchBar.addEventListener("input", function () {
    searchTerm = searchBar.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (searchTerm.length < 3) return;

    let pdfIndex = JSON.parse(localStorage.getItem("pdfIndex"));
    if (!pdfIndex) return;

    let results = Object.keys(pdfIndex).filter(pdf => pdfIndex[pdf].includes(searchTerm));

    if (results.length === 0) {
        searchResults.innerHTML = "<li>No matching PDFs found</li>";
        return;
    }

    results.forEach(pdf => {
        let item = document.createElement("li");
        item.textContent = pdf.split("/").pop();
        item.addEventListener("click", () => {
            loadPDF(pdf);
            history.pushState({}, "", `?pdf=${encodeURIComponent(pdf.replace("pdfs/", ""))}`); // Update URL
        });
        searchResults.appendChild(item);
    });
});

// Load PDF if a URL parameter exists
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

let pdfPath = getQueryParam("pdf");
if (pdfPath) {
    loadPDF(`pdfs/${decodeURIComponent(pdfPath)}`);
}
