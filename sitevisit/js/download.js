/*download.js*/
export function downloadChecklist() {
  const allData = JSON.parse(localStorage.getItem("checklist") || "{}");
  let lines = [];

  Object.entries(folders).forEach(([folderName, files]) => {
    files.forEach(file => {
      const fileKey = `${folderName}/${file}`;
      const items = allData[fileKey] || {};

      let parts = checklistItems.map(item => {
        const entry = items[item] || {};
        if (!entry.status) return "";
        return entry.comment
          ? `${entry.status} (Comment: ${entry.comment})`
          : entry.status;
      });

      const line = `${fileKey}: ${parts.filter(Boolean).join(", ")}`;
      lines.push(line);
    });
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "checklist-backup.txt";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
