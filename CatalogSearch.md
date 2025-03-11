const container = dv.el("div", "");

// Dropdown options
const years = ["2023", "2024", "2025"];
const programs = ["Business", "Engineering", "Science"];
const courses = {
    "Business": ["Marketing", "Finance"],
    "Engineering": ["Mechanical", "Electrical"],
    "Science": ["Biology", "Chemistry"]
};

// Create dropdowns
const yearDropdown = createDropdown(years, "Select Year");
const programDropdown = createDropdown(programs, "Select Program");
const courseDropdown = createDropdown([], "Select Course");

container.appendChild(yearDropdown);
container.appendChild(programDropdown);
container.appendChild(courseDropdown);

// Update course dropdown when program is selected
programDropdown.addEventListener("change", () => {
    updateDropdown(courseDropdown, courses[programDropdown.value] || []);
});

// Function to create dropdowns
function createDropdown(options, placeholder) {
    const select = document.createElement("select");
    const defaultOption = document.createElement("option");
    defaultOption.textContent = placeholder;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
    return select;
}

function updateDropdown(select, options) {
    select.innerHTML = "";
    options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

// Display selected course content
courseDropdown.addEventListener("change", () => {
    let selectedCourse = courseDropdown.value;
    let selectedProgram = programDropdown.value;
    let selectedYear = yearDropdown.value;
    
    let filePath = `${selectedYear}/${selectedProgram}/${selectedCourse}.md`;
    let fileContent = dv.page(filePath);
    
    dv.el("div", fileContent ? fileContent.content : "No data found.");
});