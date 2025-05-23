/*viewer.js*/
function setFile(pdfPath, keyForChecklist) {
  saveChecklistItem();
  currentFileIndex = flatFileList.indexOf(keyForChecklist);
  currentItem = 0;
  viewerEl.src = pdfPath;
  loadChecklist();
}

function prevFile() {
  if (currentFileIndex > 0) {
    saveChecklistItem();
    currentFileIndex--;
    currentItem = 0;

    const key = flatFileList[currentFileIndex];
    const url = `https://cgines-stech.github.io/Course-Catalog/sitevisit/${key}`;

    setFile(url, key);
  }
}

function nextFile() {
  if (currentFileIndex < flatFileList.length - 1) {
    saveChecklistItem();
    currentFileIndex++;
    currentItem = 0;

    const key = flatFileList[currentFileIndex];
    const url = `https://cgines-stech.github.io/Course-Catalog/sitevisit/${key}`;

    setFile(url, key);
  }
}
