
const form = document.getElementById("check-form");
const claimInput = document.getElementById("claim");
const checkButton = document.getElementById("check-button");

const resultDiv = document.getElementById("result");
const resultClaim = document.getElementById("result-claim");
const resultStatus = document.getElementById("result-status");
const resultExplanation = document.getElementById("result-explanation");
const sourcesList = document.getElementById("sources-list");
const errorMessage = document.getElementById("error-message");

const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");
const newCheckButton = document.getElementById("new-check");

const clearHistoryModal = document.getElementById("clear-history-modal");
const cancelClearHistoryButton = document.getElementById("cancel-clear-history");
const confirmClearHistoryButton = document.getElementById("confirm-clear-history");
const confirmationModal = clearHistoryModal
    ? clearHistoryModal.querySelector(".confirmation-modal")
    : null;

const jevResult = document.getElementById("jev-result");
const jevConfidence = document.getElementById("jev-confidence");

const jevTrueValue = document.getElementById("jev-true-value");
const jevTrueBar = document.getElementById("jev-true-bar");

const jevFalseValue = document.getElementById("jev-false-value");
const jevFalseBar = document.getElementById("jev-false-bar");

const jevUncertainValue = document.getElementById("jev-uncertain-value");
const jevUncertainBar = document.getElementById("jev-uncertain-bar");

const HISTORY_KEY = "truthlensHistory";
const MAX_HISTORY = 20;


// Convert internal status codes into readable English labels.
function formatStatus(status) {
    const labels = {
        SUPPORTED: "Supported",
        REFUTED: "Refuted",
        INSUFFICIENT_EVIDENCE: "Insufficient evidence",
        NOT_VERIFIED: "Not verified"
    };

    return labels[status] ||
        String(status || "Checked").replaceAll("_", " ");
}


// Read the saved verification history.
function getHistory() {
    try {
        const history = JSON.parse(
            localStorage.getItem(HISTORY_KEY) || "[]"
        );

        return Array.isArray(history) ? history : [];
    } catch (error) {
        console.error("Unable to read history:", error);
        return [];
    }
}


// Save a verification with its date and time.
function saveToHistory(data) {
    try {
        let history = getHistory();

        const claim = data.claim || "";

        // Remove an older entry for the same claim.
        history = history.filter(
            item => (item.claim || "").toLowerCase() !==
                claim.toLowerCase()
        );

        history.unshift({
            claim: claim,
            data: data,
            date: new Date().toISOString()
        });

        history = history.slice(0, MAX_HISTORY);

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(history)
        );

        renderHistory();

    } catch (error) {
        console.error("Unable to save history:", error);

        showError(
            "The verification succeeded, but its history could not be saved."
        );
    }
}


// Display the history in the sidebar.
function renderHistory() {
    if (!historyList) {
        return;
    }

    const history = getHistory();
    historyList.replaceChildren();

    if (history.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.textContent = "No verifications yet.";
        emptyMessage.className = "history-empty";

        historyList.appendChild(emptyMessage);
        return;
    }

    history.forEach(item => {
        const historyItem = document.createElement("button");

        historyItem.type = "button";
        historyItem.className = "history-item";

        // Show the beginning of the claim.
        const claimText = document.createElement("span");

        claimText.className = "history-item-claim";

        const claim = item.claim || "";
        const maxClaimLength = 55;

        claimText.textContent =
            claim.length > maxClaimLength
                ? claim.slice(0, maxClaimLength) + "..."
                : claim;

        // Show the complete claim when hovering over it.
        claimText.title = claim;

        // Display the date and time.
        const meta = document.createElement("span");

        meta.className = "history-item-meta";

        const dateElement = document.createElement("span");

        dateElement.className = "history-item-date";

        if (item.date) {
            const parsedDate = new Date(item.date);

            dateElement.textContent =
                !Number.isNaN(parsedDate.getTime())
                    ? parsedDate.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                    : "Date unavailable";
        } else {
            dateElement.textContent = "Date unavailable";
        }

        // Display the verification status.
        const status = document.createElement("span");

        status.className = "history-item-status";
        status.textContent = formatStatus(item.data?.status);

        meta.append(dateElement, status);
        historyItem.append(claimText, meta);

        // Reopen a previous verification when clicked.
        historyItem.addEventListener("click", () => {
            claimInput.value = item.claim || "";

            if (item.data) {
                displayResult(item.data);
                resultDiv.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

        historyList.appendChild(historyItem);
    });
}


// Display an error message.
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}


// Hide the error message.
function hideError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
}


// Display the main verification result.
function displayResult(data) {
    resultClaim.textContent = data.claim || "";

    resultStatus.textContent = formatStatus(data.status);

    resultExplanation.textContent =
        data.explanation || "No explanation is available.";

    resultDiv.hidden = false;

    displayJevResult(data.jevmodel);
    displaySources(data.sources || []);
}


// Display JevModel's second opinion and probabilities.
function displayJevResult(jev) {
    if (!jevResult) {
        return;
    }

    if (!jev || jev.verdict === "unavailable") {
        jevResult.hidden = true;
        return;
    }

    jevResult.hidden = false;

    if (jevConfidence) {
        const confidence = Number(jev.confidence);

        jevConfidence.textContent =
            Number.isFinite(confidence)
                ? `${Math.round(confidence * 100)}% confidence`
                : "Confidence unavailable";
    }

    const probabilities = jev.probabilities || {};

    updateProbability(
        probabilities.likely_true,
        jevTrueValue,
        jevTrueBar
    );

    updateProbability(
        probabilities.likely_false,
        jevFalseValue,
        jevFalseBar
    );

    updateProbability(
        probabilities.uncertain,
        jevUncertainValue,
        jevUncertainBar
    );
}


// Update a JevModel probability and its visual bar.
function updateProbability(value, valueElement, barElement) {
    if (!valueElement || !barElement) {
        return;
    }

    const probability = Number(value);

    const validProbability = Number.isFinite(probability)
        ? Math.min(1, Math.max(0, probability))
        : 0;

    const percentage = Math.round(validProbability * 100);

    valueElement.textContent = `${percentage}%`;
    barElement.style.width = `${percentage}%`;
}


// Display the evidence sources.
function displaySources(sources) {
    sourcesList.replaceChildren();

    if (!sources.length) {
        const emptyMessage = document.createElement("li");

        emptyMessage.textContent = "No sources were found.";

        sourcesList.appendChild(emptyMessage);
        return;
    }

    sources.forEach(source => {
        const listItem = document.createElement("li");

        const link = document.createElement("a");

        link.href = source.url || "#";
        link.textContent = source.title || "Untitled source";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        listItem.appendChild(link);

        if (source.content) {
            const description = document.createElement("p");

            description.textContent = source.content;

            listItem.appendChild(description);
        }

        sourcesList.appendChild(listItem);
    });
}


// Submit a claim for verification.
form.addEventListener("submit", async event => {
    event.preventDefault();

    const claim = claimInput.value.trim();

    if (!claim) {
        showError("Enter a claim to verify.");
        claimInput.focus();
        return;
    }

    hideError();

    resultDiv.hidden = true;

    checkButton.disabled = true;
    checkButton.textContent = "Checking claim...";

    try {
        const response = await fetch("/api/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                claim: claim
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.explanation ||
                data.error ||
                `Request failed (${response.status}).`
            );
        }

        displayResult(data);

        if (data.status !== "NOT_VERIFIED") {
            saveToHistory(data);
        }

    } catch (error) {
        console.error("Verification error:", error);

        showError(
            "Unable to verify the claim: " + error.message
        );

    } finally {
        checkButton.disabled = false;
        checkButton.textContent = "Verify claim";
    }
});


/* CLEAR HISTORY CONFIRMATION MODAL */

// Open the confirmation modal.
function openClearHistoryModal() {
    if (!clearHistoryModal) {
        return;
    }

    clearHistoryModal.hidden = false;
    clearHistoryModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    confirmationModal?.focus();
}


// Close the modal without deleting anything.
function closeClearHistoryModal() {
    if (!clearHistoryModal) {
        return;
    }

    clearHistoryModal.hidden = true;
    clearHistoryModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    clearHistoryButton?.focus();
}


// Open the modal when Clear is clicked.
if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", openClearHistoryModal);
}


// Cancel: close the modal and keep the history.
if (cancelClearHistoryButton) {
    cancelClearHistoryButton.addEventListener(
        "click",
        closeClearHistoryModal
    );
}


// Confirm: delete the saved history.
if (confirmClearHistoryButton) {
    confirmClearHistoryButton.addEventListener("click", () => {
        try {
            localStorage.removeItem(HISTORY_KEY);
            renderHistory();
            closeClearHistoryModal();
        } catch (error) {
            console.error("Unable to clear history:", error);

            closeClearHistoryModal();
            showError("Unable to clear history.");
        }
    });
}


// Close the modal when clicking outside the dialog.
if (clearHistoryModal) {
    clearHistoryModal.addEventListener("click", event => {
        if (event.target === clearHistoryModal) {
            closeClearHistoryModal();
        }
    });
}


// Close the modal with the Escape key.
document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        clearHistoryModal &&
        !clearHistoryModal.hidden
    ) {
        closeClearHistoryModal();
    }
});


// Start a new verification.
if (newCheckButton) {
    newCheckButton.addEventListener("click", () => {
        claimInput.value = "";
        resultDiv.hidden = true;

        hideError();
        claimInput.focus();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// Load the saved history when the page opens.
renderHistory();