const form = document.getElementById("contactForm");
const status = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

if (!form || !status || !submitBtn) {
  console.error("Form elements not found");
  throw new Error("Form setup failed");
}

let isSubmitting = false;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) return;
  isSubmitting = true;

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  status.textContent = "Sending your message...";
  status.className = "loading";

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  try {
    const res = await fetch("https://canvas-api-9y7i.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.error || "Server error");

    status.textContent = "Thank You! Message sent successfully!";
    status.className = "success";
    form.reset();
    submitBtn.disabled = true;

    setTimeout(() => {
      status.textContent = "";
      status.className = "";
    }, 5000);

  } catch (err) {
    console.error(err);
    status.textContent = err.message || "Network error. Please try again.";
    status.className = "error";
  } finally {
    isSubmitting = false;
    submitBtn.textContent = "Send Message ⇛";
  }
});

form.addEventListener("input", () => {
  submitBtn.disabled = !form.checkValidity();
});
