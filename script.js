document.addEventListener("DOMContentLoaded", () => {
  const owners = ["None", "Leo", "Jagya", "Saksham", "Adit"];
  const ownerDropdowns = document.querySelectorAll(".owner-dropdown");

  ownerDropdowns.forEach((dropdown) => {
    owners.forEach((owner) => {
      const option = document.createElement("option");
      option.value = owner;
      option.textContent = owner;
      dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", (event) => {
      const selectedOwner = event.target.value;
      const cell = event.target.parentElement;

      updateSummary();
      switch (selectedOwner) {
        case "Jagya":
          cell.style.backgroundColor = "red";
          break;
        case "Leo":
          cell.style.backgroundColor = "blue";
          break;
        case "Saksham":
          cell.style.backgroundColor = "yellow";
          break;
        case "Adit":
          cell.style.backgroundColor = "green";
          break;
        default:
          cell.style.backgroundColor = "";
          break;
      }
    });
  });

  const numberOfHouses = ["0", "1", "2", "3"];
  const numberOfHousesDropdowns = document.querySelectorAll(".houses-dropdown");

  numberOfHousesDropdowns.forEach((dropdown) => {
    numberOfHouses.forEach((numberOfHouses) => {
      const option = document.createElement("option");
      option.value = numberOfHouses;
      option.textContent = numberOfHouses;
      dropdown.appendChild(option);
    });
  });

  const numberOfHotels = ["No", "Yes"];
  const numberOfHotelsDropdowns = document.querySelectorAll(".hotel-dropdown");

  numberOfHotelsDropdowns.forEach((dropdown) => {
    numberOfHotels.forEach((numberOfHotels) => {
      const option = document.createElement("option");
      option.value = numberOfHotels;
      option.textContent = numberOfHotels;
      dropdown.appendChild(option);
    });
  });

  const payment = ["Unpayed", "Payed", "Past Due"];
  const paymentStatus = document.querySelectorAll(".pay-dropdown");

  paymentStatus.forEach((dropdown) => {
    payment.forEach((payment) => {
      const option = document.createElement("option");
      option.value = payment;
      option.textContent = payment;
      dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", (event) => {
      const selectedOwner = event.target.value;
      const cell = event.target.parentElement;

      cell.style.backgroundColor = "";
      cell.classList.remove("blinking");

      switch (selectedOwner) {
        case "Payed":
          cell.style.backgroundColor = "Green";
          break;
        case "Unpayed":
          cell.style.backgroundColor = "Red";
          break;
        case "Past Due":
          cell.classList.add("blinking");
          break;
        default:
          cell.style.backgroundColor = "";
          break;
      }

      updateSummary();
    });
  });

  const createDropdown = (options, className) => {
    const dropdown = document.createElement("select");
    dropdown.className = className;
    options.forEach((optionText) => {
      const option = document.createElement("option");
      option.value = optionText;
      option.textContent = optionText;
      dropdown.appendChild(option);
    });
    return dropdown;
  };

  const createInput = (className, type = "text", value = "") => {
    const input = document.createElement("input");
    input.className = className;
    input.type = type;
    input.value = value;
    return input;
  };

  const addRow = () => {
    const tbody = document.getElementById("applicant-table-body");
    const newRow = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.appendChild(createDropdown(owners, "owner-dropdown"));

    const accountStatusCell = document.createElement("td");
    accountStatusCell.innerHTML = "$";
    accountStatusCell.appendChild(createInput("formSize"));

    const creditScoreCell = document.createElement("td");
    creditScoreCell.appendChild(createInput("formSize"));
    creditScoreCell.innerHTML += "/100";

    const appliedAmountCell = document.createElement("td");
    appliedAmountCell.innerHTML = "$";
    appliedAmountCell.appendChild(createInput("formSize"));

    const givenAmountCell = document.createElement("td");
    givenAmountCell.innerHTML = "$";
    givenAmountCell.appendChild(createInput("formSize"));

    const paymentStatusCell = document.createElement("td");
    paymentStatusCell.appendChild(createDropdown(payment, "pay-dropdown"));

    const roundsGivenCell = document.createElement("td");
    roundsGivenCell.appendChild(createInput("formSize"));

    const roundsTakenCell = document.createElement("td");
    roundsTakenCell.appendChild(createInput("formSize"));

    newRow.appendChild(nameCell);
    newRow.appendChild(accountStatusCell);
    newRow.appendChild(creditScoreCell);
    newRow.appendChild(appliedAmountCell);
    newRow.appendChild(givenAmountCell);
    newRow.appendChild(paymentStatusCell);
    newRow.appendChild(roundsGivenCell);
    newRow.appendChild(roundsTakenCell);

    tbody.appendChild(newRow);

    paymentStatusCell
      .querySelector(".pay-dropdown")
      .addEventListener("change", handlePaymentStatusChange);

    newRow.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("change", updateSummary);
    });

    updateSummary();
  };

  const handlePaymentStatusChange = (event) => {
    const selectedPayment = event.target.value;
    const cell = event.target.parentElement;

    cell.style.backgroundColor = "";

    switch (selectedPayment) {
      case "Payed":
        cell.style.backgroundColor = "green";
        break;
      case "Unpayed":
        cell.style.backgroundColor = "orange";
        break;
      case "Past Due":
        cell.style.backgroundColor = "red";
        break;
      default:
        cell.style.backgroundColor = "";
        break;
    }

    updateSummary();
  };

  const updateSummary = () => {
    const applicantRows = document.querySelectorAll("#applicant-table-body tr");
    const propertyRows = document.querySelectorAll("#property-table tbody tr");
    const summaryData = {};

    owners.forEach((owner) => {
      summaryData[owner] = {
        debt: 0,
        currentAccountStatus: 0,
      };
    });

    applicantRows.forEach((row) => {
      const owner = row.querySelector(".owner-dropdown").value;
      const currentAccountStatus = parseFloat(
        row.querySelectorAll("input")[0].value || 0
      );
      const appliedAmount = parseFloat(
        row.querySelectorAll("input")[2].value || 0
      );
      const givenAmount = parseFloat(
        row.querySelectorAll("input")[3].value || 0
      );

      if (owner) {
        summaryData[owner].currentAccountStatus += currentAccountStatus;
        summaryData[owner].debt += appliedAmount - givenAmount;
      }
    });

    const summaryRow = document.getElementById("summary-row");
    summaryRow.innerHTML = "<td colspan='8'>Account Summary</td>";

    Object.keys(summaryData).forEach((owner) => {
      const ownerSummary = summaryData[owner];
      const ownerCell = document.createElement("td");
      ownerCell.colSpan = 8;
      ownerCell.innerHTML = `<strong>${owner}</strong>: 
        Current Account Status: $${ownerSummary.currentAccountStatus.toFixed(
          2
        )}, 
        Debt: $${ownerSummary.debt.toFixed(2)}`;
      summaryRow.appendChild(ownerCell);
    });
  };

  document.querySelectorAll(".pay-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("change", handlePaymentStatusChange);
  });

  document.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("change", updateSummary);
  });

  document.getElementById("add-row-button").addEventListener("click", addRow);

  updateSummary();
});
