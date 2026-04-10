const form = document.getElementById("appForm");
const list = document.getElementById("appList");

let applications = JSON.parse(localStorage.getItem("apps")) || [];

// Render applications
function renderApps() {
  list.innerHTML = "";
  applications.forEach(app => {
    const row = `
      <tr>
        <td>${app.company}</td>
        <td>${app.role}</td>
        <td>${app.date}</td>
        <td>${app.status}</td>
      </tr>
    `;
    list.innerHTML += row;
  });
}

// Add new application
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newApp = {
    company: document.getElementById("company").value,
    role: document.getElementById("role").value,
    date: document.getElementById("date").value,
    status: document.getElementById("status").value
  };

  applications.push(newApp);
  localStorage.setItem("apps", JSON.stringify(applications));

  form.reset();
  renderApps();
});

// Initial render
renderApps();