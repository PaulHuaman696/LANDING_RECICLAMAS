const downloadBtn = document.getElementById("downloadBtn");
const contactForm = document.getElementById("contactForm");
const thanksMessage = document.getElementById("thanksMessage");
const inputs = contactForm.querySelectorAll("input");

downloadBtn.addEventListener("click", () => {
  contactForm.classList.remove("hidden");
  downloadBtn.style.display = "none";
});

async function getAPIHost() {
  const res = await fetch("/api/ip");
  const data = await res.json();
  return `${data.ip}`;
}


contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: inputs[0].value,
    correo: inputs[1].value,
    ciudad: inputs[2].value,
  };

  const ip_host = await getAPIHost();

  try {
    const res = await fetch(`http://${ip_host}:3001/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      contactForm.classList.add("hidden");
      thanksMessage.classList.remove("hidden");
    } else {
      alert("Error al enviar los datos.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Fallo de red o servidor.");
  }
});
