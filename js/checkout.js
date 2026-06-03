const checkoutButtons = document.querySelectorAll("[data-checkout]");

checkoutButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const originalText = button.textContent;
    const packageCode = button.dataset.package;

    button.disabled = true;
    button.textContent = "Loading...";

    try {
      const response = await fetch("/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          packageCode: packageCode,
          addons: []
        })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
        button.disabled = false;
        button.textContent = originalText;
      }
    } catch (error) {
      alert("Checkout could not start. Please try again.");
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});
