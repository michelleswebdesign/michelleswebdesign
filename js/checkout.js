const checkoutButtons = document.querySelectorAll("[data-checkout]");

checkoutButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const packageCode = button.dataset.package;

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
    }
  });
});
