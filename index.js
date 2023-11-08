(async () => {
  let employeeList = document.querySelector(".employee__names--list");
  let employeeInfo = document.querySelector(".employee__single--info");
  let response = await fetch("./data.json");
  let employeeData = await response.json();
  let selectedEmployee = employeeData[0];
  let selectedEmployeeId = employeeData[0].id;

  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employeeData.forEach((employee) => {
      const spanElement = document.createElement("span");
      spanElement.classList.add("employee__names--item");
      if (parseInt(selectedEmployeeId, 10) === employee.id) {
        spanElement.classList.add("selected");
        selectedEmployee = employee;
      }
      spanElement.setAttribute("id", employee.id);
      spanElement.innerHTML = `${employee.firstName} ${employee.lastName} <i class="employeeDelete">❌</i>`;
      employeeList.append(spanElement);
    });
  };
  renderEmployees();
  const renderSingleEmployees = () => {
    employeeInfo.innerHTML = `
    <img src="${selectedEmployee.imageUrl}" />
    <span class="employees__single--heading">
    ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
    </span>
    <span>${selectedEmployee.address}</span>
    <span>${selectedEmployee.email}</span>
    <span>Mobile - ${selectedEmployee.contactNumber}</span>
    <span>DOB - ${selectedEmployee.dob}</span>
    `;
  };
  renderSingleEmployees();
  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployees();
      renderSingleEmployees();
    }
    if (e.target.tagName === "I") {
      const data = employeeData.filter(
        (employee) => String(employee.id) !== e.target.parentNode.id
      );
      employeeData = data
      renderEmployees()
    }
  });
})();
