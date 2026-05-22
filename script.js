const APP_PIN = "1234";

let goats =
    JSON.parse(localStorage.getItem("goats")) || [];
let currentFilteredGoats = goats;
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
/* VACCINATION ALERT */

if (
    goat.vaccinations &&
    goat.vaccinations.length > 0
) {

    const lastVaccine =
        goat.vaccinations[
            goat.vaccinations.length - 1
        ];

    if (lastVaccine.date) {

        const today =
            new Date();

        const vaccineDate =
            new Date(lastVaccine.date);

        /* NEXT VACCINE AFTER 6 MONTHS */

        const nextVaccine =
            new Date(vaccineDate);

        nextVaccine.setDate(
            nextVaccine.getDate() + 180
        );

        const timeDifference =
            nextVaccine.getTime()
            -
            today.getTime();

        const diffDays =
            Math.ceil(
                timeDifference
                /
                (1000 * 60 * 60 * 24)
            );

        console.log(
            goat.tag,
            "Vaccine Days:",
            diffDays
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

        /* OVERDUE */

        if (diffDays < 0) {

            alertsContainer.innerHTML += `

                <div style="
                    background:#fecaca;
                    padding:14px;
                    border-radius:12px;
                    margin-bottom:10px;
                    font-weight:bold;
                ">

                    ⚠ Goat
                    ${goat.tag}

                    vaccine overdue

                </div>
            `;
        }
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

    filteredGoats.forEach((goat) => {

        const originalIndex =
            goats.indexOf(goat);

        /* ARRAYS */

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

        /* REMINDERS */

        let reminderHTML = "";

        const today = new Date();

        /* =========================
           VACCINE REMINDER
        ========================= */

        if (
            goat.vaccinations.length > 0
        ) {

            const lastVaccine =
                goat.vaccinations[
                    goat.vaccinations.length - 1
                ];

            if (lastVaccine.date) {

                const vaccineDate =
                    new Date(lastVaccine.date);

                const nextVaccine =
                    new Date(vaccineDate);

                nextVaccine.setDate(
                    nextVaccine.getDate() + 180
                );

                const diffDays =
                    Math.ceil(

                        (
                            nextVaccine.getTime()
                            -
                            today.getTime()
                        )

                        /

                        (1000 * 60 * 60 * 24)
                    );

                /* DUE */

                if (
                    diffDays >= 0
                    &&
                    diffDays <= 30
                ) {

                    reminderHTML += `

                        <div style="
                            background:#fef3c7;
                            color:#92400e;
                            padding:12px;
                            border-radius:14px;
                            margin-top:12px;
                            font-weight:bold;
                        ">

                            🔔 Vaccine due in
                            ${diffDays} days

                        </div>
                    `;
                }

                /* OVERDUE */

                if (diffDays < 0) {

                    reminderHTML += `

                        <div style="
                            background:#fecaca;
                            color:#991b1b;
                            padding:12px;
                            border-radius:14px;
                            margin-top:12px;
                            font-weight:bold;
                        ">

                            ⚠ Vaccine overdue

                        </div>
                    `;
                }
            }
        }

        /* =========================
           DELIVERY REMINDER
        ========================= */

        if (
            goat.breedingRecords.length > 0
        ) {

            const lastBreeding =
                goat.breedingRecords[
                    goat.breedingRecords.length - 1
                ];

            if (
                lastBreeding.pregnancyStatus
                &&
                lastBreeding.pregnancyStatus
                    .toLowerCase() === "yes"
                &&
                lastBreeding.givenBirth
                    .toLowerCase() === "no"
            ) {

                const deliveryDate =
                    new Date(
                        lastBreeding.expectedDelivery
                    );

                const diffDelivery =
                    Math.ceil(

                        (
                            deliveryDate.getTime()
                            -
                            today.getTime()
                        )

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
                            color:#166534;
                            padding:12px;
                            border-radius:14px;
                            margin-top:12px;
                            font-weight:bold;
                        ">

                            🐐 Delivery expected in
                            ${diffDelivery} days

                        </div>
                    `;
                }
            }
        }

        /* =========================
           GOAT CARD
        ========================= */

        goatList.innerHTML += `

            <div class="goat-card">

                <!-- HEADER -->

                <div class="goat-header">

                    <div>

                        <h2 class="goat-tag">

                            🐐 ${goat.tag}

                        </h2>

                        <span class="goat-badge">

                            ${goat.gender}

                        </span>

                    </div>

                    <div class="goat-age">

                        ${calculateAge(goat.dob)}

                    </div>

                </div>

                <!-- IMAGE -->

                ${
                    goat.image

                    ?

                    `
                    <img
                        src="${goat.image}"
                        class="goat-image"
                    >
                    `

                    :

                    ""
                }

                <!-- REMINDERS -->

                ${reminderHTML}

                <!-- INFO GRID -->

                <div class="goat-info-grid">

                    <!-- BREED -->

                    <div class="info-box">

                        <span class="info-label">

                            Breed

                        </span>

                        <span class="info-value">

                            ${goat.breed}

                        </span>

                    </div>

                    <!-- DOB -->

                    <div class="info-box">

                        <span class="info-label">

                            DOB

                        </span>

                        <span class="info-value">

                            ${new Date(goat.dob)
                                .toLocaleDateString(
                                    "en-GB"
                                )
                            }

                        </span>

                    </div>

                    <!-- STATUS -->

                    <div class="info-box">

                        <span class="info-label">

                            Status

                        </span>

                        <span class="info-value">

                            ${goat.status || "Active"}

                        </span>

                    </div>

                    <!-- MOTHER -->

                    ${
                        goat.motherTag

                        ?

                        `
                        <div class="info-box">

                            <span class="info-label">

                                Mother

                            </span>

                            <span
                                class="info-value clickable-parent"
                                onclick="openChildGoat('${goat.motherTag}')"
                            >

                                🐐 ${goat.motherTag}

                            </span>

                        </div>
                        `

                        :

                        ""
                    }

                    <!-- FATHER -->

                    ${
                        goat.fatherTag

                        ?

                        `
                        <div class="info-box">

                            <span class="info-label">

                                Father

                            </span>

                            <span
                                class="info-value clickable-parent"
                                onclick="openChildGoat('${goat.fatherTag}')"
                            >

                                🐐 ${goat.fatherTag}

                            </span>

                        </div>
                        `

                        :

                        ""
                    }

                    <!-- CHILDREN -->

                    ${
                        goat.breedingRecords &&
                        goat.breedingRecords.some(
                            record =>
                            record.childTags &&
                            record.childTags.length > 0
                        )

                        ?

                        `
                        <div class="info-box child-info-box">

                            <span class="info-label">

                                Children

                            </span>

                            <div class="children-flow">

                                ${
                                    goat.breedingRecords
                                    .map(record => {

                                        if (
                                            record.childTags &&
                                            record.childTags.length > 0
                                        ) {

                                            return record.childTags
                                            .map(tag => `

                                                <div
                                                    class="child-node"
                                                    onclick="openChildGoat('${tag}')"
                                                >

                                                    🐐 ${tag}

                                                </div>

                                            `)
                                            .join(`
                                                <span class="flow-line">
                                                    ➜
                                                </span>
                                            `);
                                        }

                                        return "";

                                    }).join("")
                                }

                            </div>

                        </div>
                        `

                        :

                        ""
                    }

                </div>

                <!-- VACCINATIONS -->

                <div class="record-section">

                    <h3>
                        💉 Vaccinations
                    </h3>

                    ${
                        goat.vaccinations.length > 0

                        ?

                        goat.vaccinations.map(v => `

                            <div class="record-card">

                                <strong>

                                    ${v.name}

                                </strong>

                                <span>

                                    ${v.date}

                                </span>

                            </div>

                        `).join("")

                        :

                        "<p>No vaccination records</p>"
                    }

                </div>

                <!-- WEIGHT -->

                <div class="record-section">

                    <h3>
                        ⚖ Weight Records
                    </h3>

                    ${
                        goat.weights.length > 0

                        ?

                        goat.weights.map(w => `

                            <div class="record-card">

                                <strong>

                                    ${w.weight} KG

                                </strong>

                                <span>

                                    ${w.date}

                                </span>

                            </div>

                        `).join("")

                        :

                        "<p>No weight records</p>"
                    }

                </div>

                <!-- HEALTH -->

                <div class="record-section">

                    <h3>
                        🏥 Health Records
                    </h3>

                    ${
                        goat.healthRecords.length > 0

                        ?

                        goat.healthRecords.map(h => `

                            <div class="record-card">

                                <strong>

                                    ${h.problem}

                                </strong>

                                <span>

                                    ${h.medicine}

                                </span>

                                <small>

                                    ${h.date || "N/A"}

                                </small>

                            </div>

                        `).join("")

                        :

                        "<p>No health records</p>"
                    }

                </div>

                <!-- BREEDING -->

                <div class="record-section">

                    <h3>
                        🍼 Breeding Records
                    </h3>

                    ${
                        goat.breedingRecords.length > 0

                        ?

                        goat.breedingRecords.map(b => `

                            <div class="record-card">

                                <strong>

                                    Mating:
                                    ${b.matingDate}

                                </strong>

                                <span>

                                    Father:
                                    ${b.fatherTag || "N/A"}

                                </span>

                                <span>

                                    Pregnancy:
                                    ${b.pregnancyStatus}

                                </span>

                                <span>

                                    Delivery:
                                    ${b.expectedDelivery}

                                </span>

                                <span>

                                    Birth:
                                    ${b.givenBirth}

                                </span>

                                <span>

                                    Kids:
                                    ${b.kidsType}

                                </span>

                                <small>

                                    Children:
                                    ${
                                        b.childTags &&
                                        b.childTags.length > 0

                                        ?

                                        b.childTags.join(", ")

                                        :

                                        "N/A"
                                    }

                                </small>

                            </div>

                        `).join("")

                        :

                        "<p>No breeding records</p>"
                    }

                </div>

                <!-- SALES -->

                <div class="record-section">

                    <h3>
                        💰 Sale Records
                    </h3>

                    ${
                        goat.saleRecords.length > 0

                        ?

                        goat.saleRecords.map(s => {

                            const profit =
                                Number(s.salePrice)
                                -
                                Number(s.purchasePrice);

                            return `

                                <div class="record-card">

                                    <strong>

                                        Sale:
                                        ₹${s.salePrice}

                                    </strong>

                                    <span>

                                        Purchase:
                                        ₹${s.purchasePrice}

                                    </span>

                                    <span>

                                        Profit:
                                        ₹${profit}

                                    </span>

                                    <span>

                                        Buyer:
                                        ${s.buyerName || s.buyer}

                                    </span>

                                    <small>

                                        ${s.saleDate || "N/A"}

                                    </small>

                                </div>
                            `;
                        }).join("")

                        :

                        "<p>No sale records</p>"
                    }

                </div>

                <!-- ACTION BUTTONS -->

                <div class="action-buttons">

                    <button onclick="editGoat(${originalIndex})">
                        ✏ Edit
                    </button>

                    <button onclick="deleteGoat(${originalIndex})">
                        🗑 Delete
                    </button>

                    <button onclick="addVaccination(${originalIndex})">
                        💉 Vaccine
                    </button>

                    <button onclick="addWeight(${originalIndex})">
                        ⚖ Weight
                    </button>

                    <button onclick="addHealthRecord(${originalIndex})">
                        🩺 Health
                    </button>

                    <button onclick="addBreedingRecord(${originalIndex})">
                        🐐 Breeding
                    </button>

                    <button onclick="updateBirthRecord(${originalIndex})">
                        👶 Birth
                    </button>

                    <button onclick="addSaleRecord(${originalIndex})">
                        💰 Sale
                    </button>
                    <button onclick="openFamilyTree('${goat.tag}')">

    🌳 Family Tree

</button>

                </div>

            </div>
        `;
    });
}

function openChildGoat(tag) {

    /* FIND GOAT */

    const goat =
        goats.find(

            g =>

            g.tag.toLowerCase()
            ===
            tag.toLowerCase()
        );

    /* NOT FOUND */

    if (!goat) {

        alert(
            "Child goat not found"
        );

        return;
    }

    /* OPEN GOAT PAGE */

    showPage("goatPage");

    /* SEARCH */

    document.getElementById(
        "searchBox"
    ).value = tag;

    /* RENDER */

    renderGoats();

    /* SCROLL TO GOAT */

    setTimeout(() => {

        const goatCards =
            document.querySelectorAll(
                ".goat-card"
            );

        goatCards.forEach(card => {

            if (
                card.innerText
                .toLowerCase()
                .includes(
                    tag.toLowerCase()
                )
            ) {

                card.scrollIntoView({

                    behavior: "smooth",

                    block: "center"
                });

                /* HIGHLIGHT */

                card.style.boxShadow =
                    "0 0 0 4px #22c55e";

                setTimeout(() => {

                    card.style.boxShadow =
                        "";

                }, 2000);
            }
        });

    }, 300);
}
/* =========================
   OPEN FAMILY TREE
========================= */

function openFamilyTree(tag) {

    /* FIND GOAT */

    const goat =
        goats.find(

            g =>

            g.tag.toLowerCase()
            ===
            tag.toLowerCase()
        );

    if (!goat) {

        alert(
            "Goat not found"
        );

        return;
    }

    /* CONTAINER */

    const container =
        document.getElementById(
            "familyTreeContainer"
        );

    /* CHILDREN */

    const children =
        goats.filter(

            g =>

            g.motherTag === goat.tag
            ||
            g.fatherTag === goat.tag
        );

    /* RENDER */

    container.innerHTML = `

        <div class="tree-wrapper">

            <!-- FATHER -->

            ${
                goat.fatherTag

                ?

                `
                <div
    class="tree-node parent-node"
    onclick="openFamilyTree('${goat.fatherTag}')"
>

                    🐐 Father

                    <strong>

                        ${goat.fatherTag}

                    </strong>

                </div>
                `

                :

                ""
            }

            <!-- MOTHER -->

            ${
                goat.motherTag

                ?

                `
                <div
    class="tree-node parent-node"
    onclick="openFamilyTree('${goat.motherTag}')"
>
                    🐐 Mother

                    <strong>

                        ${goat.motherTag}

                    </strong>

                </div>
                `

                :

                ""
            }

            <!-- CURRENT GOAT -->

            <div class="tree-node current-node">

                🐐 ${goat.tag}

            </div>

            <!-- CHILDREN -->

            <div class="children-tree">

                ${
                    children.length > 0

                    ?

                    children.map(child => `

                        <div
    class="tree-node child-tree-node"
    onclick="openFamilyTree('${child.tag}')"
>

                            🐐 ${child.tag}

                        </div>

                    `).join("")

                    :

                    "<p>No children found</p>"
                }

            </div>

        </div>
    `;

    /* OPEN MODAL */

    document.getElementById(
        "familyTreeModal"
    ).style.display = "flex";
}

/* =========================
   CLOSE FAMILY TREE
========================= */

function closeFamilyTree() {

    document.getElementById(
        "familyTreeModal"
    ).style.display = "none";
}


/* ADD GOAT */
function addGoat() {

    const tag =
        document.getElementById(
            "tag"
        ).value;

    /* BREED */

    let breed =
        document.getElementById(
            "breed"
        ).value;

    /* CUSTOM BREED */

    if (breed === "Custom") {

        breed =
            document.getElementById(
                "customBreed"
            ).value;
    }

    const gender =
        document.getElementById(
            "gender"
        ).value;

    const dob =
        document.getElementById(
            "dob"
        ).value;

    const imageInput =
        document.getElementById(
            "goatImage"
        );

    /* VALIDATION */

    if (
        !tag
        ||
        !breed
        ||
        !gender
        ||
        !dob
    ) {

        alert(
            "Please fill all fields"
        );

        return;
    }

    const file =
        imageInput.files[0];

    /* IMAGE */

    if (file) {

        const reader =
            new FileReader();

        reader.onload =
            function(e) {

                saveGoat(

                    tag,

                    breed,

                    gender,

                    dob,

                    e.target.result
                );
            };

        reader.readAsDataURL(file);

    }

    else {

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
let currentVaccineIndex = -1;

function addVaccination(index) {

    currentVaccineIndex = index;

    document.getElementById(
        "vaccineModal"
    ).style.display = "flex";
}

function saveVaccination() {

    const vaccineName =
        document.getElementById(
            "vaccineName"
        ).value;

    const vaccineDate =
        document.getElementById(
            "vaccineDate"
        ).value;

    if (!vaccineName || !vaccineDate) {

        alert("Fill all fields");

        return;
    }

    if (
        !goats[currentVaccineIndex]
        .vaccinations
    ) {

        goats[currentVaccineIndex]
            .vaccinations = [];
    }

    goats[currentVaccineIndex]
        .vaccinations.push({

            name: vaccineName,
            date: vaccineDate
        });

    saveData();

    renderGoats();

    renderDashboardAlerts();

    closeVaccineModal();

    alert(
        "Vaccination Added"
    );
}

function closeVaccineModal() {

    document.getElementById(
        "vaccineModal"
    ).style.display = "none";

    document.getElementById(
        "vaccineName"
    ).value = "";

    document.getElementById(
        "vaccineDate"
    ).value = "";
}
/* WEIGHT */
let currentWeightIndex = -1;

function addWeight(index) {

    currentWeightIndex = index;

    document.getElementById(
        "weightModal"
    ).style.display = "flex";
}
function saveWeight() {

    const weight =
        document.getElementById(
            "weightValue"
        ).value;

    const date =
        document.getElementById(
            "weightDate"
        ).value;

    if (!weight || !date) {

        alert(
            "Fill all fields"
        );

        return;
    }

    if (
        !goats[currentWeightIndex]
        .weights
    ) {

        goats[currentWeightIndex]
            .weights = [];
    }

    goats[currentWeightIndex]
        .weights.push({

            weight,
            date
        });

    saveData();

    renderGoats();

    closeWeightModal();

    alert(
        "Weight Added"
    );
}

function closeWeightModal() {

    document.getElementById(
        "weightModal"
    ).style.display = "none";

    document.getElementById(
        "weightValue"
    ).value = "";

    document.getElementById(
        "weightDate"
    ).value = "";
}
/* HEALTH */
/* --------------------------------------------*/
/* HEALTH MODAL */

let currentHealthIndex = -1;

function addHealthRecord(index) {

    currentHealthIndex = index;

    document.getElementById(
        "healthModal"
    ).style.display = "flex";
}

function saveHealthRecord() {

    const problem =
        document.getElementById(
            "healthProblem"
        ).value;

    const medicine =
        document.getElementById(
            "healthMedicine"
        ).value;

    const date =
        document.getElementById(
            "healthDate"
        ).value;

    if (!problem || !medicine || !date) {

        alert(
            "Fill all fields"
        );

        return;
    }

    if (
        !goats[currentHealthIndex]
        .healthRecords
    ) {

        goats[currentHealthIndex]
            .healthRecords = [];
    }

    goats[currentHealthIndex]
        .healthRecords.push({

            problem,
            medicine,
            date
        });

    saveData();

    renderGoats();

    closeHealthModal();

    alert(
        "Health Record Added"
    );
}

function closeHealthModal() {

    document.getElementById(
        "healthModal"
    ).style.display = "none";

    document.getElementById(
        "healthProblem"
    ).value = "";

    document.getElementById(
        "healthMedicine"
    ).value = "";

    document.getElementById(
        "healthDate"
    ).value = "";
}
/* BREEDING */
/* BREEDING MODAL */

let currentBreedingIndex = -1;

function addBreedingRecord(index) {

    currentBreedingIndex = index;

    document.getElementById(
        "breedingModal"
    ).style.display = "flex";
}

function saveBreedingRecord() {

    const matingDate =
        document.getElementById(
            "matingDate"
        ).value;

    const fatherTag =
        document.getElementById(
            "fatherTag"
        ).value.trim();

    const pregnancyStatus =
        document.getElementById(
            "pregnancyStatus"
        ).value;

    /* VALIDATION */

    if (
        !matingDate
        ||
        !pregnancyStatus
        ||
        !fatherTag
    ) {

        alert(
            "Fill all fields"
        );

        return;
    }

    /* AUTO DELIVERY DATE */

    const mating =
        new Date(matingDate);

    const delivery =
        new Date(mating);

    delivery.setDate(
        delivery.getDate() + 150
    );

    const expectedDelivery =
        delivery
        .toISOString()
        .split("T")[0];

    /* CREATE ARRAY */

    if (
        !goats[currentBreedingIndex]
        .breedingRecords
    ) {

        goats[currentBreedingIndex]
            .breedingRecords = [];
    }

    /* SAVE RECORD */

    goats[currentBreedingIndex]
        .breedingRecords.push({

            matingDate:
                matingDate,

            fatherTag:
                fatherTag,

            pregnancyStatus:
                pregnancyStatus,

            expectedDelivery:
                expectedDelivery,

            givenBirth:
                "No",

            kidsType:
                "Not Yet",

            childTags:
                []
        });

    /* SAVE */

    saveData();

    renderGoats();

    closeBreedingModal();

    alert(
        "Breeding Record Added"
    );
}

function closeBreedingModal() {

    document.getElementById(
        "breedingModal"
    ).style.display = "none";

    document.getElementById(
        "matingDate"
    ).value = "";

    document.getElementById(
        "pregnancyStatus"
    ).value = "";
}
/* BIRTH MODAL */

let currentBirthIndex = -1;

function updateBirthRecord(index) {

    currentBirthIndex = index;

    document.getElementById(
        "birthModal"
    ).style.display = "flex";
}
function saveBirthRecord() {

    const givenBirth =
        document.getElementById(
            "givenBirth"
        ).value;

    const kidsType =
        document.getElementById(
            "kidsType"
        ).value;

    /* VALIDATION */

    if (!givenBirth) {

        alert(
            "Select Birth Status"
        );

        return;
    }

    if (
        givenBirth === "Yes"
        &&
        !kidsType
    ) {

        alert(
            "Select Kids Type"
        );

        return;
    }

    /* CHECK BREEDING RECORD */

    if (
        !goats[currentBirthIndex]
        .breedingRecords
        ||
        goats[currentBirthIndex]
        .breedingRecords.length === 0
    ) {

        alert(
            "No Breeding Record Found"
        );

        return;
    }

    /* LAST RECORD */

    const lastRecord =
        goats[currentBirthIndex]
        .breedingRecords[
            goats[currentBirthIndex]
            .breedingRecords.length - 1
        ];

    /* SAVE STATUS */

    lastRecord.givenBirth =
        givenBirth;

    /* IF YES */

    if (givenBirth === "Yes") {

        lastRecord.kidsType =
            kidsType;

        /* GET CHILD INPUTS */

        const childInputs =
            document.querySelectorAll(
                ".childTagInput"
            );

        const childTags = [];

        childInputs.forEach(input => {

            const value =
                input.value.trim();

            if (value) {

                childTags.push(value);
            }
        });

        /* EXPECTED COUNT */

        let expectedCount = 0;

        if (kidsType === "Single") {

            expectedCount = 1;
        }

        else if (
            kidsType === "Double"
        ) {

            expectedCount = 2;
        }

        else if (
            kidsType === "Triplet"
        ) {

            expectedCount = 3;
        }

        /* VALIDATE */

        if (
            childTags.length !==
            expectedCount
        ) {

            alert(
                "Enter All Child Tags"
            );

            return;
        }

        /* SAVE CHILD TAGS */

        lastRecord.childTags =
            childTags;

        /* AUTO LINK CHILDREN */

        childTags.forEach(tag => {

            const childGoat =
                goats.find(

                    goat =>

                    goat.tag.toLowerCase()
                    ===
                    tag.toLowerCase()
                );

            /* IF CHILD EXISTS */

            if (childGoat) {

                /* MOTHER */

                childGoat.motherTag =
                    goats[currentBirthIndex]
                    .tag;

                /* FATHER */

                childGoat.fatherTag =
                    lastRecord.fatherTag;
            }
        });
    }

    else {

        lastRecord.kidsType =
            "Not Yet";

        lastRecord.childTags =
            [];
    }

    /* SAVE */

    saveData();

    renderGoats();

    closeBirthModal();

    alert(
        "Birth Record Updated"
    );
}

function closeBirthModal() {

    document.getElementById(
        "birthModal"
    ).style.display = "none";

    document.getElementById(
        "givenBirth"
    ).value = "";

    document.getElementById(
        "kidsType"
    ).value = "";
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

/* SALE MODAL */

let currentSaleIndex = -1;

function addSaleRecord(index) {

    currentSaleIndex = index;

    document.getElementById(
        "saleModal"
    ).style.display = "flex";
}

function saveSaleRecord() {

    const purchasePrice =
        document.getElementById(
            "purchasePrice"
        ).value;

    const salePrice =
        document.getElementById(
            "salePrice"
        ).value;

    const buyer =
        document.getElementById(
            "buyerName"
        ).value;

    const saleDate =
        document.getElementById(
            "saleDate"
        ).value;

    if (
        !purchasePrice
        ||
        !salePrice
        ||
        !buyer
        ||
        !saleDate
    ) {

        alert(
            "Fill all fields"
        );

        return;
    }

    if (
        !goats[currentSaleIndex]
        .saleRecords
    ) {

        goats[currentSaleIndex]
            .saleRecords = [];
    }

    goats[currentSaleIndex]
        .saleRecords.push({

            purchasePrice,
            salePrice,
            buyer,
            saleDate
        });

    /* AUTO STATUS SOLD */

    goats[currentSaleIndex]
        .status = "Sold";

    saveData();

    renderGoats();

    closeSaleModal();

    alert(
        "Sale Record Added"
    );
}
/* DOWNLOAD FUNCTIONS */


/* DOWNLOAD ALL GOATS PDF */
function downloadAllGoats() {

    if (goats.length === 0) {

        alert("No goats available");

        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    /* DATE */

    const today =
        new Date();

    const day =
        String(today.getDate())
        .padStart(2, "0");

    const month =
        String(today.getMonth() + 1)
        .padStart(2, "0");

    const year =
        today.getFullYear();

    const formattedDate =
        `${day}${month}${year}`;

    let y = 30;

    /* REPORT HEADING */

    doc.setFontSize(20);

    doc.text(
        "All Goats Farm Report",
        20,
        15
    );

    doc.setFontSize(11);

    doc.text(
        `Date: ${day}-${month}-${year}`,
        20,
        22
    );

    goats.forEach((goat, index) => {

        if (y > 260) {

            doc.addPage();

            y = 20;
        }

        doc.setFontSize(14);

        doc.text(
            `Goat ${index + 1}`,
            20,
            y
        );

        y += 8;

        doc.setFontSize(11);

        doc.text(
            `Tag: ${goat.tag}`,
            20,
            y
        );

        y += 6;

        doc.text(
            `Breed: ${goat.breed}`,
            20,
            y
        );

        y += 6;

        doc.text(
            `Gender: ${goat.gender}`,
            20,
            y
        );

        y += 6;

        doc.text(
            `DOB: ${goat.dob}`,
            20,
            y
        );

        y += 6;

        doc.text(
            `Status: ${goat.status || "Active"}`,
            20,
            y
        );

        y += 10;

        /* VACCINATIONS */

        if (
            goat.vaccinations &&
            goat.vaccinations.length > 0
        ) {

            doc.text(
                "Vaccinations:",
                20,
                y
            );

            y += 6;

            goat.vaccinations.forEach(vaccine => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    `• ${vaccine.name} (${vaccine.date})`,
                    25,
                    y
                );

                y += 6;
            });
        }

        /* WEIGHTS */

        if (
            goat.weights &&
            goat.weights.length > 0
        ) {

            doc.text(
                "Weight History:",
                20,
                y
            );

            y += 6;

            goat.weights.forEach(weight => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    `• ${weight.weight} KG (${weight.date})`,
                    25,
                    y
                );

                y += 6;
            });
        }

        /* HEALTH */

        if (
            goat.healthRecords &&
            goat.healthRecords.length > 0
        ) {

            doc.text(
                "Health Records:",
                20,
                y
            );

            y += 6;

            goat.healthRecords.forEach(record => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    `• ${record.problem}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Medicine: ${record.medicine}`,
                    25,
                    y
                );

                y += 6;

                /* FIXED DATE LOGIC */

                doc.text(
                    `Date: ${record.date || "N/A"}`,
                    25,
                    y
                );

                y += 8;
            });
        }

        /* BREEDING */

        if (
            goat.breedingRecords &&
            goat.breedingRecords.length > 0
        ) {

            doc.text(
                "Breeding Records:",
                20,
                y
            );

            y += 6;

            goat.breedingRecords.forEach(record => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    `• Mating: ${record.matingDate}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Pregnancy: ${record.pregnancyStatus}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Delivery: ${record.deliveryDate}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Birth: ${record.givenBirth}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Kids: ${record.kidsType}`,
                    25,
                    y
                );

                y += 8;
            });
        }

        /* SALES */

        if (
            goat.saleRecords &&
            goat.saleRecords.length > 0
        ) {

            doc.text(
                "Sale Records:",
                20,
                y
            );

            y += 6;

            goat.saleRecords.forEach(record => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                const profit =
                    Number(record.salePrice)
                    -
                    Number(record.purchasePrice);

                doc.text(
                    `• Purchase: ₹${record.purchasePrice}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Sale: ₹${record.salePrice}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Profit: ₹${profit}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Buyer: ${record.buyer}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Sale Date: ${record.saleDate || "N/A"}`,
                    25,
                    y
                );

                y += 8;
            });
        }

        doc.line(20, y, 190, y);

        y += 12;
    });

    /* DOWNLOAD FILE */

    doc.save(
        `all_goats_${formattedDate}_report.pdf`
    );
}
/* DOWNLOAD FILTERED GOATS PDF */
function downloadFilteredGoats() {

    if (
        !currentFilteredGoats
        ||
        currentFilteredGoats.length === 0
    ) {

        alert(
            "No searched goats found"
        );

        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    /* DATE */

    const today =
        new Date();

    const day =
        String(today.getDate())
        .padStart(2, "0");

    const month =
        String(today.getMonth() + 1)
        .padStart(2, "0");

    const year =
        today.getFullYear();

    const formattedDate =
        `${day}${month}${year}`;

    /* FIRST GOAT TAG */

    const goatTag =
        currentFilteredGoats[0].tag;

    let y = 30;

    /* REPORT HEADING */

    doc.setFontSize(20);

    doc.text(
        `${goatTag} Report`,
        20,
        15
    );

    doc.setFontSize(11);

    doc.text(
        `Date: ${day}-${month}-${year}`,
        20,
        22
    );

    currentFilteredGoats.forEach((goat, index) => {

        if (y > 260) {

            doc.addPage();

            y = 20;
        }

        doc.setFontSize(14);

        doc.text(
            `Goat ${index + 1}`,
            20,
            y
        );

        y += 8;

        doc.setFontSize(11);

        doc.text(
            `Tag: ${goat.tag}`,
            20,
            y
        );

        y += 6;

        doc.text(
            `Breed: ${goat.breed}`,
            20,
            y
        );

        y += 6;

        doc.text(
            `Gender: ${goat.gender}`,
            20,
            y
        );

        y += 6;

        doc.text(
            `DOB: ${goat.dob}`,
            20,
            y
        );

        y += 6;

        doc.text(
            `Status: ${goat.status || "Active"}`,
            20,
            y
        );

        y += 10;

        /* VACCINATIONS */

        if (
            goat.vaccinations &&
            goat.vaccinations.length > 0
        ) {

            doc.text(
                "Vaccinations:",
                20,
                y
            );

            y += 6;

            goat.vaccinations.forEach(vaccine => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    `• ${vaccine.name} (${vaccine.date})`,
                    25,
                    y
                );

                y += 6;
            });
        }

        /* WEIGHTS */

        if (
            goat.weights &&
            goat.weights.length > 0
        ) {

            doc.text(
                "Weight History:",
                20,
                y
            );

            y += 6;

            goat.weights.forEach(weight => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    `• ${weight.weight} KG (${weight.date})`,
                    25,
                    y
                );

                y += 6;
            });
        }

        /* HEALTH */

        if (
            goat.healthRecords &&
            goat.healthRecords.length > 0
        ) {

            doc.text(
                "Health Records:",
                20,
                y
            );

            y += 6;

            goat.healthRecords.forEach(record => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    `• ${record.problem} | ${record.medicine}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Date: ${record.date}`,
                    25,
                    y
                );

                y += 8;
            });
        }

        /* BREEDING */

        if (
            goat.breedingRecords &&
            goat.breedingRecords.length > 0
        ) {

            doc.text(
                "Breeding Records:",
                20,
                y
            );

            y += 6;

            goat.breedingRecords.forEach(record => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    `• Mating: ${record.matingDate}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Pregnancy: ${record.pregnancyStatus}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Delivery: ${record.deliveryDate}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Birth: ${record.givenBirth}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Kids: ${record.kidsType}`,
                    25,
                    y
                );

                y += 8;
            });
        }

        /* SALES */

        if (
            goat.saleRecords &&
            goat.saleRecords.length > 0
        ) {

            doc.text(
                "Sale Records:",
                20,
                y
            );

            y += 6;

            goat.saleRecords.forEach(record => {

                if (y > 270) {

                    doc.addPage();

                    y = 20;
                }

                const profit =
                    Number(record.salePrice)
                    -
                    Number(record.purchasePrice);

                doc.text(
                    `• Purchase: ₹${record.purchasePrice}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Sale: ₹${record.salePrice}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Profit: ₹${profit}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Buyer: ${record.buyer}`,
                    25,
                    y
                );

                y += 6;

                doc.text(
                    `Sale Date: ${record.saleDate || "N/A"}`,
                    25,
                    y
                );

                y += 8;
            });
        }

        doc.line(20, y, 190, y);

        y += 12;
    });

    /* DOWNLOAD FILE */

    doc.save(
        `${goatTag}_${formattedDate}_report.pdf`
    );
}
/*---------------------------------------------------*/
/* CHILD TAG INPUTS */
function generateChildTagInputs() {

    const kidsType =
        document.getElementById(
            "kidsType"
        ).value;

    const container =
        document.getElementById(
            "childTagsContainer"
        );

    container.innerHTML = "";

    let count = 0;

    if (kidsType === "Single") {

        count = 1;
    }

    else if (kidsType === "Double") {

        count = 2;
    }

    else if (kidsType === "Triplet") {

        count = 3;
    }

    for (
        let i = 1;
        i <= count;
        i++
    ) {

        container.innerHTML += `

            <input
                type="text"
                id="childTag${i}"
                class="childTagInput"
                placeholder="Child Tag ${i}"
            >
        `;
    }
}


/* CUSTOM BREED */

function toggleCustomBreed() {

    const breed =
        document.getElementById(
            "breed"
        ).value;

    const customBreedInput =
        document.getElementById(
            "customBreed"
        );

    if (breed === "Custom") {

        customBreedInput.style.display =
            "block";
    }

    else {

        customBreedInput.style.display =
            "none";
    }
}








function searchGoats() {

    const searchText =
        document.getElementById(
            "searchBox"
        )
        .value
        .toLowerCase();

    const filtered =
        goats.filter(goat =>

            goat.tag
                .toLowerCase()
                .includes(searchText)

            ||

            goat.breed
                .toLowerCase()
                .includes(searchText)
        );
    currentFilteredGoats = filtered;
    renderGoats(filtered);
}

function scrollToSearch() {

    /* OPEN GOAT PAGE */

    showPage("goatPage");

    /* SEARCH BOX */

    const searchBox =
        document.getElementById(
            "searchBox"
        );

    /* SCROLL */

    searchBox.scrollIntoView({

        behavior: "smooth",

        block: "center"
    });

    /* FOCUS */

    setTimeout(() => {

        searchBox.focus();

    }, 500);
}

















function closeSaleModal() {

    document.getElementById(
        "saleModal"
    ).style.display = "none";

    document.getElementById(
        "purchasePrice"
    ).value = "";

    document.getElementById(
        "salePrice"
    ).value = "";

    document.getElementById(
        "buyerName"
    ).value = "";

    document.getElementById(
        "saleDate"
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
/* BACKUP DATA */

function backupData() {

    /* CHECK DATA */

    if (
        goats.length === 0
        &&
        expenses.length === 0
        &&
        incomes.length === 0
    ) {

        alert(
            "No data available for backup"
        );

        return;
    }

    /* DATE */

    const today =
        new Date();

    const day =
        String(today.getDate())
        .padStart(2, "0");

    const month =
        String(today.getMonth() + 1)
        .padStart(2, "0");

    const year =
        today.getFullYear();

    const formattedDate =
        `${day}${month}${year}`;

    /* COMPLETE BACKUP */

    const data = {

        goats:
            goats || [],

        expenses:
            expenses || [],

        incomes:
            incomes || []
    };

    /* JSON FORMAT */

    const jsonData =
        JSON.stringify(
            data,
            null,
            2
        );

    /* FILE */

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
        `SPGoatFarmBackup_${formattedDate}.json`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    alert(
        "Backup Downloaded Successfully"
    );
}

/* RESTORE DATA */

function restoreData(event) {

    const file =
        event.target.files[0];

    if (!file) {

        alert(
            "No backup file selected"
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(e) {

        try {

            const data =
                JSON.parse(
                    e.target.result
                );

            /* VALIDATION */

            if (
                typeof data !== "object"
            ) {

                alert(
                    "Invalid backup file"
                );

                return;
            }

            /* CONFIRM */

            const confirmRestore =
                confirm(

                    "Restoring backup will replace all current data. Continue?"
                );

            if (!confirmRestore) {

                return;
            }

            /* RESTORE */

            goats =
                data.goats || [];

            expenses =
                data.expenses || [];

            incomes =
                data.incomes || [];

            /* FIX MISSING ARRAYS */

            goats.forEach(goat => {

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
            });

            /* SAVE */

            saveData();

            /* REFRESH */

            renderGoats();

            renderExpenses();

            renderIncome();

            updateDashboard();

            renderDashboardAlerts();

            alert(
                "Backup Restored Successfully!"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Invalid or Corrupted Backup File"
            );
        }
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
