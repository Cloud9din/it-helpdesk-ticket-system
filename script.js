const ticketForm = document.getElementById("ticketForm");
const ticketsContainer = document.getElementById("tickets");

let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

function displayTickets() {
  ticketsContainer.innerHTML = "";

  if (tickets.length === 0) {
    ticketsContainer.innerHTML = "<p>No support tickets yet.</p>";
    return;
  }

  tickets.forEach((ticket, index) => {
    const ticketCard = document.createElement("div");
    ticketCard.classList.add("ticket-card");

    ticketCard.innerHTML = `
      <h3>Ticket #${index + 1}</h3>
      <p><strong>User:</strong> ${ticket.name}</p>
      <p><strong>Category:</strong> ${ticket.category}</p>
      <p><strong>Priority:</strong> ${ticket.priority}</p>
      <p><strong>Description:</strong> ${ticket.description}</p>
      <p><strong>Status:</strong> ${ticket.status}</p>

      <button onclick="resolveTicket(${index})">
        Mark as Resolved
      </button>
    `;

    ticketsContainer.appendChild(ticketCard);
  });
}

ticketForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value;

  const newTicket = {
    name,
    category,
    priority,
    description,
    status: "Open"
  };

  tickets.push(newTicket);

  localStorage.setItem("tickets", JSON.stringify(tickets));

  ticketForm.reset();

  displayTickets();
});

function resolveTicket(index) {
  tickets[index].status = "Resolved";

  localStorage.setItem("tickets", JSON.stringify(tickets));

  displayTickets();
}

displayTickets();
