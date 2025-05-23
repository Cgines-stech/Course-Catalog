/*navigation.js*/
function buildNavTree() {
  folderListEl.innerHTML = "";
  flatFileList = [];

  const folderMap = {};
  Object.entries(folders).forEach(([fullPath, files]) => {
    const parts = fullPath.split("/");
    const root = parts[0];
    const subpath = parts.slice(1).join("/");

    if (!folderMap[root]) folderMap[root] = [];
    folderMap[root].push({ subpath, files, fullPath });
  });

  Object.entries(folderMap).forEach(([rootFolder, subfolders]) => {
    const rootLi = document.createElement("li");

    const rootHeader = document.createElement("div");
    rootHeader.className = "folder-label";
    rootHeader.textContent = `📂 ${rootFolder}`;
    const rootUl = document.createElement("ul");

    // Collapse Standard2 by default
    if (rootFolder === "Standard2") {
      rootUl.style.display = "none";
    }

    rootHeader.onclick = () => {
      rootUl.style.display = rootUl.style.display === "none" ? "block" : "none";
    };

    subfolders.forEach(({ subpath, files, fullPath }) => {
      // Handle root-level files (no subpath)
      if (!subpath) {
        files.forEach(file => {
          const displayKey = `${fullPath}/${file}`;
          const fullURL = `https://cgines-stech.github.io/Course-Catalog/sitevisit/${fullPath}/${file}`;
          const displayName = file.replace(/\.docx\.pdf$/, '').replace(/\.pdf$/, '');

          flatFileList.push(displayKey);

          const fileLi = document.createElement("li");
          fileLi.className = "file-entry";
          fileLi.id = `nav-${displayKey}`;
          fileLi.innerHTML = `📄 ${displayName} <span class="status-icon" style="margin-left: 6px;"></span>`;
          fileLi.onclick = () => setFile(fullURL, displayKey);

          rootUl.appendChild(fileLi);

          // Refresh status icon for this file
          updateNavStatus(displayKey);
        });

        return; // Skip rest of loop
      }

      // Subfolder logic
      const subLi = document.createElement("li");
      const subUl = document.createElement("ul");
      subUl.style.display = "none";

      const subLabel = document.createElement("div");
      subLabel.className = "folder-label";
      subLabel.textContent = `📁 ${subpath}`;
      subLabel.onclick = () => {
        subUl.style.display = subUl.style.display === "none" ? "block" : "none";
      };
      subLi.appendChild(subLabel);

      files.forEach(file => {
        const displayKey = `${fullPath}/${file}`;
        const fullURL = `https://cgines-stech.github.io/Course-Catalog/sitevisit/${fullPath}/${file}`;
        const displayName = file.replace(/\.docx\.pdf$/, '').replace(/\.pdf$/, '');

        flatFileList.push(displayKey);

        const fileLi = document.createElement("li");
        fileLi.className = "file-entry";
        fileLi.id = `nav-${displayKey}`;
        fileLi.innerHTML = `📄 ${displayName} <span class="status-icon" style="margin-left: 6px;"></span>`;
        fileLi.onclick = () => setFile(fullURL, displayKey);

        subUl.appendChild(fileLi);

        // Refresh status icon for this file
        updateNavStatus(displayKey);
      });

      subLi.appendChild(subUl);
      rootUl.appendChild(subLi);
    });

    rootLi.appendChild(rootHeader);
    rootLi.appendChild(rootUl);
    folderListEl.appendChild(rootLi);
  });

  flatFileList.forEach(fileKey => updateNavStatus(fileKey));
}

function updateNavStatus(fileKey) {
  const el = document.getElementById(`nav-${fileKey}`);
  if (!el) {
    console.warn(`Missing nav element for fileKey: ${fileKey}`);
    return;
  }

  const icon = el.querySelector(".status-icon");
  if (!icon) return;

  const allData = JSON.parse(localStorage.getItem("checklist") || "{}");
  const fileData = allData[fileKey] || {};

  const hasNo = checklistItems.some(item => fileData[item]?.status === "No");
  const hasYes = checklistItems.some(item => fileData[item]?.status === "Yes");
  const hasNA = checklistItems.some(item => fileData[item]?.status === "N/A");

  if (hasNo) {
    icon.textContent = "❌";
  } else if (hasYes || hasNA) {
    icon.textContent = "✔️";
  } else {
    icon.textContent = "";
  }
}
window.buildNavTree = buildNavTree;
window.updateNavStatus = updateNavStatus; // if not already included