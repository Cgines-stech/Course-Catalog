export function showToast(message) {
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.className = "publish-toast";
  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 4000);
}
