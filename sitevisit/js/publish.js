import { showToast } from "./toast.js";

export function publishChecklist() {
  const userId = document.getElementById("userIdInput")?.value?.trim();
  if (!userId) {
    alert("Please enter your User ID before publishing.");
    return;
  }

  const allData = JSON.parse(localStorage.getItem("checklist") || "{}");
  let lines = [];

  Object.entries(folders).forEach(([folderName, files]) => {
    files.forEach(file => {
      const fileKey = `${folderName}/${file}`;
      const items = allData[fileKey] || {};
      let latestStatus = "";
      let latestComment = "";

      for (let item of checklistItems) {
        if (items[item]?.status) {
          latestStatus = items[item].status;
          latestComment = items[item].comment || "";
        }
      }

      const value = latestStatus
        ? (latestComment ? `${latestStatus} (Comment: ${latestComment})` : latestStatus)
        : "";

      lines.push(`${fileKey}: ${value}`);
    });
  });

  const body = encodeURIComponent(
    `Hi,\n\nHere is my checklist backup.\n\nUser ID: ${userId}\n\n${lines.join("\n")}`
  );

  const mailto = `mailto:cgines@stech.org?subject=Checklist Backup from ${userId}&body=${body}`;
  window.location.href = mailto;

  showToast("📬 Email draft opened in your mail app.");
}
