(() => {
    const row2 = document.querySelector(".screen-intro");
    const row8 = document.querySelector(".screen-results");
    const row9 = document.querySelector(".screen-footer");

    const rows = [
        document.querySelector(".screen-option[data-step='3']"),
        document.querySelector(".screen-option[data-step='4']"),
        document.querySelector(".screen-option[data-step='5']"),
        document.querySelector(".screen-option[data-step='6']"),
        document.querySelector(".screen-option[data-step='7']"),
        row8,
        row9,
    ];

    const style = document.createElement("style");
    style.innerHTML = ".hidden { display: none; }";
    document.head.appendChild(style);

    rows.forEach((row) => row && row.classList.add("hidden"));

    let currentRow = 2;

    const options = {
      3: ["Comparative Vertebrate Anatomy—You love starting the day with science!", "Ancient to Gothic Art History—You're ready to be inspired!", "Fundamentals of Flight Operation—Time to take to the skies!", "Cybercrime and Governance—Your Law & Order marathons will come in handy!", "Agricultural Economics—Business planning starts now!"],
      4: ["Studying antibiotic resistance in holy water.", "Weaving the myth of Odysseus into modern poetry.", "Researching ethical hacking to discover vulnerabilities in computer systems.", "Digging into heavy metal resistance in glacial and riverine wetland soils.", "Studying passenger booking behavior in competitive airline markets."],
      5: ["Oat milk matcha latte", "Boba tea", "Surprise me with something seasonal", "Iced cold brew", "Fruit smoothie"],
      6: ["Assisting the hockey team.", "Conducting research with the American Cancer Society.", "Protecting biodiversity with the Iowa Department of Natural Resources.", "Making the news at the local broadcasting network.", "Serving your community at the local judicial district court."],
      7: ["The Photography Club: You're planning a chic gallery exhibition.", "The co-ed interamural volleyball team. Victory is yours!", "Grill Masters: You make an amazing prime rib sandwich.", "The Agricultural Honor Society: You never stop networking!", "The Garden Club: You're taking the garden to the table."],
    };

    const currentIndices = { 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    const lockedChoices = [];

    function getOptionRow(rowNum) {
        return document.querySelector(`.screen-option[data-step="${rowNum}"]`);
    }

    function getListElement(rowNum) {
        const row = getOptionRow(rowNum);
        return row ? row.querySelector(".option-text") : null;
    }

    function updateDisplayedOption(rowNum) {
        const listElement = getListElement(rowNum);
        if (!listElement) return;
        const currentIndex = currentIndices[rowNum];
        listElement.textContent = options[rowNum][currentIndex];
    }

    function cycleOption(rowNum) {
        currentIndices[rowNum] = (currentIndices[rowNum] + 1) % options[rowNum].length;
        updateDisplayedOption(rowNum);
    }

    function lockInChoice(rowNum) {
        lockedChoices.push(options[rowNum][currentIndices[rowNum]]);
        goToNextRow();
    }

    function setupButton(button, onClickHandler) {
        const buttonContent = button.querySelector(".btn-content");
        if (!buttonContent) return;

        buttonContent.setAttribute("tabindex", "0");
        buttonContent.setAttribute("role", "button");

        let lastTouchTime = 0;

        const addActive = () => buttonContent.classList.add("active");
        const removeActive = () => setTimeout(() => buttonContent.classList.remove("active"), 100);

        buttonContent.addEventListener("mousedown", addActive);
        buttonContent.addEventListener("mouseup", removeActive);
        buttonContent.addEventListener("mouseleave", removeActive);

        buttonContent.addEventListener(
            "touchstart",
            () => {
                lastTouchTime = Date.now();
                addActive();
            },
            { passive: false }
        );
        buttonContent.addEventListener(
            "touchend",
            (e) => {
                e.preventDefault();
                removeActive();
                onClickHandler(e);
            },
            { passive: false }
        );
        buttonContent.addEventListener("touchcancel", removeActive);

        buttonContent.addEventListener("click", (e) => {
            if (Date.now() - lastTouchTime > 499) {
                onClickHandler(e);
            } else {
                e.preventDefault();
                lastTouchTime = 0;
            }
        });

        buttonContent.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                buttonContent.classList.add("active");
                onClickHandler(e);
                setTimeout(() => buttonContent.classList.remove("active"), 150);
            }
        });
    }

    const notebookImageUrl = "https://beeprod.blob.core.windows.net/asset-uploads/e933e1e0-aa2c-483d-9443-1eec8c39d47e%2F20260113160808_notebook-paper-cropped-bluelines.jpg";
    let imageLoaded = false;

    function loadNotebookBackground() {
        if (imageLoaded) return;
        if (!row8) return;

        const blocks = row8.querySelectorAll(".result-1, .result-2, .result-3, .result-4, .result-5");
        blocks.forEach((block) => {
            block.style.backgroundImage = `url(${notebookImageUrl})`;
        });

        const img = new Image();
        img.src = notebookImageUrl;
        imageLoaded = true;
    }

    function goToNextRow() {
        const current = currentRow === 2
            ? row2
            : document.querySelector(`.screen-option[data-step="${currentRow}"]`);
        currentRow++;
        if (current) current.classList.add("hidden");

        if (currentRow === 8) {
            if (row8) row8.classList.remove("hidden");
            if (row9) row9.classList.remove("hidden");
            loadNotebookBackground();
            displayLockedChoices();
        } else {
            const nextRow = currentRow >= 3 && currentRow <= 7
                ? document.querySelector(`.screen-option[data-step="${currentRow}"]`)
                : null;
            if (nextRow) {
                nextRow.classList.remove("hidden");
                updateDisplayedOption(currentRow);
            }
            if (currentRow === 7) loadNotebookBackground();
        }

        scrollToTop();
    }

    function displayLockedChoices() {
        if (!row8) return;
        const resultClasses = ["result-1", "result-2", "result-3", "result-4", "result-5"];
        lockedChoices.forEach((choice, index) => {
            const el = row8.querySelector(`.${resultClasses[index]}`);
            if (el) el.textContent = choice;
        });
    }

    function scrollToTop() {
        window.scroll({ top: 0, left: 0, behavior: "smooth" });
    }

    row2?.querySelectorAll(".btn-wrap").forEach((button) => {
        setupButton(button, goToNextRow);
    });

    [3, 4, 5, 6, 7].forEach((rowNum) => {
        const row = getOptionRow(rowNum);
        if (!row) return;

        const changeButton = row.querySelector(".btn-change");
        const chooseButton = row.querySelector(".btn-choose");

        if (changeButton) setupButton(changeButton, () => cycleOption(rowNum));
        if (chooseButton) setupButton(chooseButton, () => lockInChoice(rowNum));
    });
})();
