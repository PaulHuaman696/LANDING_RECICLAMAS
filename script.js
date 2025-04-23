const downloadBtn = document.getElementById("downloadBtn");
const contactForm = document.getElementById("contactForm");
const thanksMessage = document.getElementById("thanksMessage");

downloadBtn.addEventListener("click", () => {
  contactForm.classList.remove("hidden");
  downloadBtn.style.display = "none";
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  contactForm.classList.add("hidden");
  thanksMessage.classList.remove("hidden");
});
