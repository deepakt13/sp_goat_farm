const APP_PIN = "1234";

let goats =
    JSON.parse(localStorage.getItem("goats")) || [];

let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

let incomes =
    JSON.parse(localStorage.getItem("incomes")) || [];

let editIndex = -1;

let farmChart = null;

/* LOGIN */

function login() {

    const pin =
        document.getElementById("pinInput").value;

    if (pin === APP_PIN) {

        document.getElementById("loginPage")
            .style.display = "none";

        document.getElementById("mainApp")
            .style.display = "block";

        showPage("dashboardPage");

        updateDashboard();

    } else {

        alert("Wrong PIN");
    }
}

/* PAGE NAVIGATION */

function showPage(pageId) {

    document.getElementById("dashboardPage")
        .style.display = "none";

    document.getElementById("goatPage")
        .style.display = "none";

    document.getElementById("businessPage")
        .style.display = "none";

    document.getElementById("backupPage")
        .style.display = "none";

    document.getElementById(pageId)
        .style.display = "block";

    if (pageId === "dashboardPage") {

        updateDashboard();
    }
}

/* DARK MODE */

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");
}

/* SAVE DATA */

function saveData() {

    localStorage.setItem(
        "goats",
        JSON.stringify(goats)
    );

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    localStorage.setItem(
        "incomes",
        JSON.stringify(incomes)
    );

    updateDashboard();
}

/* DASHBOARD */

function updateDashboard() {

    document.getElementById(
        "dashboardGoats"
    ).innerText = goats.length;

    let totalExpense = 0;

    expenses.forEach(expense => {

        totalExpense += Number(expense.amount);
    });

    let totalIncome = 0;

    incomes.forEach(income => {

        totalIncome += Number(income.amount);
    });

    const profit =
        totalIncome - totalExpense;

    document.getElementById(
        "dashboardIncome"
    ).innerText = `₹${totalIncome}`;

    document.getElementById(
        "dashboardExpense"
    ).innerText = `₹${totalExpense}`;

    document.getElementById(
        "dashboardProfit"
    ).innerText = `₹${profit}`;

    updateChart(
        totalIncome,
        totalExpense,
        profit
    );
    renderDashboardAlerts();
}

function renderDashboardAlerts() {

    const alertsContainer =
        document.getElementById(
            "dashboardAlerts"
        );

    alertsContainer.innerHTML = "";

    const today =
        new Date();

    goats.forEach(goat => {

        /* VACCINATION ALERT */

        if (
            goat.vaccinations &&
            goat.vaccinations.length > 0
        ) {

            const lastVaccine =
                goat.vaccinations[
                    goat.vaccinations.length - 1
                ];

            const vaccineDate =
                new Date(lastVaccine.date);

            const nextVaccine =
                new Date(vaccineDate);

            nextVaccine.setMonth(
                nextVaccine.getMonth() + 6
            );

            const diffDays =
                Math.ceil(
                    (nextVaccine - today)
                    /
                    (1000 * 60 * 60 * 24)
                );

            if (
                diffDays >= 0
                &&
                diffDays <= 30
            ) {

                alertsContainer.innerHTML += `

                    <div style="
                        background:#fef3c7;
                        padding:14px;
                        border-radius:12px;
                        margin-bottom:10px;
                        font-weight:bold;
                    ">

                        🔔 Goat
                        ${goat.tag}

                        vaccine due in
                        ${diffDays} days

                    </div>
                `;
            }
        }

        /* DELIVERY ALERT */

        if (
            goat.breedingRecords &&
            goat.breedingRecords.length > 0
        ) {

            const lastBreeding =
                goat.breedingRecords[
                    goat.breedingRecords.length - 1
                ];

            if (
                lastBreeding.pregnancyStatus
                    .toLowerCase() === "yes"
                &&
                lastBreeding.givenBirth
                    .toLowerCase() === "no"
            ) {

                const deliveryDate =
                    new Date(
                        lastBreeding.deliveryDate
                    );

                const diffDelivery =
                    Math.ceil(
                        (deliveryDate - today)
                        /
                        (1000 * 60 * 60 * 24)
                    );

                if (
                    diffDelivery >= 0
                    &&
                    diffDelivery <= 15
                ) {

                    alertsContainer.innerHTML += `

                        <div style="
                            background:#dcfce7;
                            padding:14px;
                            border-radius:12px;
                            margin-bottom:10px;
                            font-weight:bold;
                        ">

                            🐐 Goat
                            ${goat.tag}

                            delivery expected in
                            ${diffDelivery} days

                        </div>
                    `;
                }
            }
        }
    });
}
/* CHART */

function updateChart(
    income,
    expense,
    profit
) {

    const ctx =
        document.getElementById("farmChart");

    if (farmChart) {

        farmChart.destroy();
    }

    farmChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Income",
                "Expense",
                "Profit"
            ],

            datasets: [{

                label: "Farm Statistics",

                data: [
                    income,
                    expense,
                    profit
                ],

                borderWidth: 1
            }]
        },

        options: {

            responsive: true
        }
    });
}

/* AGE */

function calculateAge(dob) {

    const birthDate =
        new Date(dob);

    const today =
        new Date();

    let years =
        today.getFullYear() -
        birthDate.getFullYear();

    let months =
        today.getMonth() -
        birthDate.getMonth();

    let days =
        today.getDate() -
        birthDate.getDate();

    if (days < 0) {

        months--;

        const previousMonth =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            );

        days += previousMonth.getDate();
    }

    if (months < 0) {

        years--;

        months += 12;
    }

    return `
        ${years} Years
        ${months} Months
        ${days} Days
    `;
}

/* GOATS */

function renderGoats(filteredGoats = goats) {

    const goatList =
        document.getElementById("goatList");

    const totalGoats =
        document.getElementById("totalGoats");

    goatList.innerHTML = "";

    totalGoats.innerText =
        `Total Goats: ${filteredGoats.length}`;

    filteredGoats.forEach((goat, index) => {

        if (!goat.vaccinations)
            goat.vaccinations = [];

        if (!goat.weights)
            goat.weights = [];

        if (!goat.healthRecords)
            goat.healthRecords = [];

        if (!goat.breedingRecords)
            goat.breedingRecords = [];

        if (!goat.saleRecords)
            goat.saleRecords = [];

        let vaccineHTML = "";

        let weightHTML = "";

        let healthHTML = "";

        let breedingHTML = "";

        let saleHTML = "";

        let reminderHTML = "";

/* REMINDERS */

const today = new Date();

if (goat.vaccinations.length > 0) {

    const lastVaccine =
        goat.vaccinations[
            goat.vaccinations.length - 1
        ];

    const vaccineDate =
        new Date(lastVaccine.date);

    const nextVaccine =
        new Date(vaccineDate);

    nextVaccine.setMonth(
        nextVaccine.getMonth() + 6
    );

    const diffDays =
        Math.ceil(
            (nextVaccine - today)
            /
            (1000 * 60 * 60 * 24)
        );

    if (diffDays <= 30 && diffDays > 0) {

        reminderHTML += `
            <div style="
                background:#fef3c7;
                padding:12px;
                border-radius:12px;
                margin-top:10px;
            ">

                🔔 Vaccination Due
                in ${diffDays} days

            </div>
        `;
    }
}
/* BREEDING REMINDER */

if (goat.breedingRecords.length > 0) {

    const lastBreeding =
        goat.breedingRecords[
            goat.breedingRecords.length - 1
        ];

    if (
        lastBreeding.pregnancyStatus
            .toLowerCase() === "yes"
        &&
        lastBreeding.givenBirth
            .toLowerCase() === "no"
    ) {

        const today =
            new Date();

        const deliveryDate =
            new Date(
                lastBreeding.deliveryDate
            );

        const timeDifference =
            deliveryDate.getTime()
            -
            today.getTime();

        const diffDelivery =
            Math.ceil(
                timeDifference
                /
                (1000 * 60 * 60 * 24)
            );

        if (
            diffDelivery >= 0
            &&
            diffDelivery <= 15
        ) {

            reminderHTML += `
                <div style="
                    background:#dcfce7;
                    padding:12px;
                    border-radius:12px;
                    margin-top:10px;
                    font-weight:bold;
                ">

                    🐐 Delivery Expected
                    in ${diffDelivery} days

                </div>
            `;
        }

        if (diffDelivery < 0) {

            reminderHTML += `
                <div style="
                    background:#fecaca;
                    padding:12px;
                    border-radius:12px;
                    margin-top:10px;
                    font-weight:bold;
                ">

                    ⚠ Delivery Date Passed

                </div>
            `;
        }
    }
}

/* BREEDING */

/* BREEDING */

if (goat.breedingRecords.length > 0) {

    breedingHTML += `
        <h4>
            Breeding Records
        </h4>
    `;

    goat.breedingRecords.forEach(record => {

        breedingHTML += `

            • Mating Date:
            ${record.matingDate}
            <br>

            Pregnancy:
            ${record.pregnancyStatus}
            <br>

            Expected Delivery:
            ${record.deliveryDate}
            <br>

            Given Birth:
            ${record.givenBirth}
            <br>

            Kids:
            ${record.kidsType}
            <br><br>
        `;
    });
}
        /* HEALTH */

        if (goat.healthRecords.length > 0) {

            healthHTML += `
                <h4>Health Records</h4>
            `;

            goat.healthRecords.forEach(record => {

                healthHTML += `
                    • ${record.problem}
                    <br>

                    Medicine:
                    ${record.medicine}
                    <br>

                    Date:
                    ${record.date}
                    <br><br>
                `;
            });
        }


        /* SALE */

        if (goat.saleRecords.length > 0) {

            saleHTML += `
                <h4>Sale Records</h4>
            `;

            goat.saleRecords.forEach(record => {

                const profit =
                    Number(record.salePrice)
                    -
                    Number(record.purchasePrice);

                saleHTML += `
                    Purchase:
                    ₹${record.purchasePrice}
                    <br>

                    Sale:
                    ₹${record.salePrice}
                    <br>

                    Buyer:
                    ${record.buyer}
                    <br>

                    Profit:
                    ₹${profit}
                    <br><br>
                `;
            });
        }

        goatList.innerHTML += `
            <div class="goat-card">

                <strong>Tag:</strong>
                ${goat.tag}
                <br><br>

                <strong>Breed:</strong>
                ${goat.breed}
                <br><br>

                <strong>Gender:</strong>
                ${goat.gender}
                <br><br>

                <strong>DOB:</strong>
                ${goat.dob}
                <br><br>

                <strong>Age:</strong>
                ${calculateAge(goat.dob)}
                <br><br>

                ${goat.image
                    ? `
                        <img
                            src="${goat.image}"
                            class="goat-image"
                        >
                    `
                    : ""
                }

                ${vaccineHTML}
                ${weightHTML}
                ${healthHTML}
                ${breedingHTML}
                ${saleHTML}
                ${reminderHTML}

                <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                    margin-top:12px;
                ">

                    <button onclick="editGoat(${index})">
                        ✏ Edit
                    </button>

                    <button onclick="deleteGoat(${index})">
                        🗑 Delete
                    </button>

                    <button onclick="addVaccination(${index})">
                        💉 Vaccine
                    </button>

                    <button onclick="addWeight(${index})">
                        ⚖ Weight
                    </button>

                    <button onclick="addHealthRecord(${index})">
                        🩺 Health
                    </button>

                    <button onclick="addBreedingRecord(${index})">
                        🐐 Breeding
                    </button>
                    <button onclick="updateBirthRecord(${index})">
                        👶 Birth
                    </button>

                    <button onclick="addSaleRecord(${index})">
                        💰 Sale
                    </button>

                </div>

            </div>
        `;
    });
}

/* ADD GOAT */

function addGoat() {

    const tag =
        document.getElementById("tag").value;

    const breed =
        document.getElementById("breed").value;

    const gender =
        document.getElementById("gender").value;

    const dob =
        document.getElementById("dob").value;

    const imageInput =
        document.getElementById("goatImage");

    if (!tag || !breed || !gender || !dob) {

        alert("Please fill all fields");

        return;
    }

    const file =
        imageInput.files[0];

    if (file) {

        const reader =
            new FileReader();

        reader.onload = function(e) {

            saveGoat(
                tag,
                breed,
                gender,
                dob,
                e.target.result
            );
        };

        reader.readAsDataURL(file);

    } else {

        saveGoat(
            tag,
            breed,
            gender,
            dob,
            ""
        );
    }
}

/* SAVE GOAT */

function saveGoat(
    tag,
    breed,
    gender,
    dob,
    image
) {

    const goat = {

        tag,
        breed,
        gender,
        dob,
        image,

        vaccinations: [],
        weights: [],
        healthRecords: [],
        breedingRecords: [],
        saleRecords: []
    };

    if (editIndex === -1) {

        goats.push(goat);

    } else {

        goat.vaccinations =
            goats[editIndex].vaccinations || [];

        goat.weights =
            goats[editIndex].weights || [];

        goat.healthRecords =
            goats[editIndex].healthRecords || [];

        goat.breedingRecords =
            goats[editIndex].breedingRecords || [];

        goat.saleRecords =
            goats[editIndex].saleRecords || [];

        if (!image) {

            goat.image =
                goats[editIndex].image || "";
        }

        goats[editIndex] = goat;

        editIndex = -1;
    }

    saveData();

    renderGoats();

    clearForm();
}

/* EDIT */

function editGoat(index) {

    const goat = goats[index];

    document.getElementById("tag")
        .value = goat.tag;

    document.getElementById("breed")
        .value = goat.breed;

    document.getElementById("gender")
        .value = goat.gender;

    document.getElementById("dob")
        .value = goat.dob;

    editIndex = index;
}

/* DELETE */

function deleteGoat(index) {

    goats.splice(index, 1);

    saveData();

    renderGoats();
}

/* VACCINATION */

function addVaccination(index) {

    const vaccineName =
        prompt("Enter Vaccine Name");

    if (!vaccineName) return;

    const vaccineDate =
        prompt("Enter Vaccination Date");

    if (!vaccineDate) return;

    goats[index]
        .vaccinations.push({

            name: vaccineName,
            date: vaccineDate
        });

    saveData();

    renderGoats();
}

/* WEIGHT */

function addWeight(index) {

    const weight =
        prompt("Enter Weight");

    if (!weight) return;

    const date =
        prompt("Enter Date");

    if (!date) return;

    goats[index]
        .weights.push({

            weight,
            date
        });

    saveData();

    renderGoats();
}

/* HEALTH */

function addHealthRecord(index) {

    const problem =
        prompt("Enter Health Problem");

    if (!problem) return;

    const medicine =
        prompt("Enter Medicine");

    if (!medicine) return;

    const date =
        prompt("Enter Date");

    if (!date) return;

    goats[index]
        .healthRecords.push({

            problem,
            medicine,
            date
        });

    saveData();

    renderGoats();
}

/* BREEDING */
function addBreedingRecord(index) {

    if (!goats[index].breedingRecords) {

        goats[index].breedingRecords = [];
    }

    const matingDate =
        prompt(
            "Enter Mating Date (YYYY-MM-DD)"
        );

    if (!matingDate) return;

    const pregnancyStatus =
        prompt(
            "Pregnant? Yes / No"
        );

    if (!pregnancyStatus) return;

    /* AUTO DELIVERY DATE */

    const mating =
        new Date(matingDate);

    const delivery =
        new Date(mating);

    delivery.setDate(
        delivery.getDate() + 150
    );

    const deliveryDate =
        delivery.toISOString()
        .split("T")[0];

    goats[index]
        .breedingRecords.push({

            matingDate,
            pregnancyStatus,
            deliveryDate,

            givenBirth: "No",

            kidsType: "Not Yet"
        });

    saveData();

    renderGoats();

    alert(
        "Breeding Record Added"
    );
}
function updateBirthRecord(index) {

    if (
        !goats[index].breedingRecords
        ||
        goats[index].breedingRecords.length === 0
    ) {

        alert(
            "No Breeding Record Found"
        );

        return;
    }

    const lastRecord =
        goats[index].breedingRecords[
            goats[index]
            .breedingRecords.length - 1
        ];

    const givenBirth =
        prompt(
            "Given Birth? Yes / No"
        );

    if (!givenBirth) return;

    lastRecord.givenBirth =
        givenBirth;

    if (
        givenBirth.toLowerCase() === "yes"
    ) {

        const kidsType =
            prompt(
                "Single / Double / Triplet"
            );

        if (kidsType) {

            lastRecord.kidsType =
                kidsType;
        }
    }

    saveData();

    renderGoats();

    alert(
        "Birth Record Updated"
    );
}

/* CLEAR */

function clearForm() {

    document.getElementById("tag")
        .value = "";

    document.getElementById("breed")
        .value = "";

    document.getElementById("gender")
        .value = "";

    document.getElementById("dob")
        .value = "";

    document.getElementById(
        "goatImage"
    ).value = "";
}

/* EXPENSE */

function renderExpenses() {

    const expenseList =
        document.getElementById(
            "expenseList"
        );

    const totalExpense =
        document.getElementById(
            "totalExpense"
        );

    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach(
        (expense, index) => {

        total += Number(expense.amount);

        expenseList.innerHTML += `
            <div class="expense-card">

                <strong>
                    ${expense.title}
                </strong>

                <br><br>

                ₹${expense.amount}

                <br><br>

                <button
                    onclick="deleteExpense(${index})"
                >
                    Delete
                </button>

            </div>
        `;
    });

    totalExpense.innerText =
        `Total Expense: ₹${total}`;

    renderIncome();
}

function addExpense() {

    const title =
        document.getElementById(
            "expenseTitle"
        ).value;

    const amount =
        document.getElementById(
            "expenseAmount"
        ).value;

    if (!title || !amount) {

        alert(
            "Fill all expense fields"
        );

        return;
    }

    expenses.push({
        title,
        amount
    });

    saveData();

    renderExpenses();

    document.getElementById(
        "expenseTitle"
    ).value = "";

    document.getElementById(
        "expenseAmount"
    ).value = "";
}

function deleteExpense(index) {

    expenses.splice(index, 1);

    saveData();

    renderExpenses();
}

/* INCOME */

function renderIncome() {

    const incomeList =
        document.getElementById(
            "incomeList"
        );

    const totalIncome =
        document.getElementById(
            "totalIncome"
        );

    const netProfit =
        document.getElementById(
            "netProfit"
        );

    incomeList.innerHTML = "";

    let total = 0;

    incomes.forEach(
        (income, index) => {

        total += Number(
            income.amount
        );

        incomeList.innerHTML += `
            <div class="income-card">

                <strong>
                    ${income.title}
                </strong>

                <br><br>

                ₹${income.amount}

                <br><br>

                <button
                    onclick="deleteIncome(${index})"
                >
                    Delete
                </button>

            </div>
        `;
    });

    totalIncome.innerText =
        `Total Income: ₹${total}`;

    let expenseTotal = 0;

    expenses.forEach(expense => {

        expenseTotal += Number(
            expense.amount
        );
    });

    const profit =
        total - expenseTotal;

    netProfit.innerText =
        `Net Profit: ₹${profit}`;
}

function addIncome() {

    const title =
        document.getElementById(
            "incomeTitle"
        ).value;

    const amount =
        document.getElementById(
            "incomeAmount"
        ).value;

    if (!title || !amount) {

        alert(
            "Fill all income fields"
        );

        return;
    }

    incomes.push({
        title,
        amount
    });

    saveData();

    renderIncome();

    document.getElementById(
        "incomeTitle"
    ).value = "";

    document.getElementById(
        "incomeAmount"
    ).value = "";
}

function deleteIncome(index) {

    incomes.splice(index, 1);

    saveData();

    renderIncome();
}

/* PDF */

async function downloadPDF() {

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    let y = 20;

    doc.setFontSize(20);

    doc.text(
        "SP Goat Farm Report",
        20,
        y
    );

    y += 20;

    doc.setFontSize(14);

    doc.text(
        `Total Goats: ${goats.length}`,
        20,
        y
    );

    y += 10;

    goats.forEach(
        (goat, index) => {

        doc.text(
            `${index + 1}. ${goat.tag} | ${goat.breed}`,
            20,
            y
        );

        y += 10;

        if (y > 270) {

            doc.addPage();

            y = 20;
        }
    });

    doc.save(
        "SPGoatFarmReport.pdf"
    );
}

/* BACKUP */

function backupData() {

    const data = {

        goats,
        expenses,
        incomes
    };

    const jsonData =
        JSON.stringify(data);

    const blob =
        new Blob(
            [jsonData],
            {
                type:
                "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "SPGoatFarmBackup.json";

    a.click();

    URL.revokeObjectURL(url);
}

/* RESTORE */

function restoreData(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload = function(e) {

        const data =
            JSON.parse(
                e.target.result
            );

        goats =
            data.goats || [];

        expenses =
            data.expenses || [];

        incomes =
            data.incomes || [];

        saveData();

        renderGoats();

        renderExpenses();

        renderIncome();

        alert(
            "Backup Restored!"
        );
    };

    reader.readAsText(file);
}

/* INITIALIZE */

renderGoats();

renderExpenses();

renderIncome();

/* SERVICE WORKER */

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register(
            "service-worker.js"
        )

        .then(() => {

            console.log(
                "Service Worker Registered"
            );
        });
}