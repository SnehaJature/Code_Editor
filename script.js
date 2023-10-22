let isLocked = false;

function copyCode() {
    const iframeDocument = document.getElementById("output").contentDocument;
    const codeToCopy = iframeDocument.documentElement.outerHTML;

    const textarea = document.createElement("textarea");
    textarea.value = codeToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function saveCode() {
    const codeToSave = document.getElementById("output").contentDocument.documentElement.outerHTML;

    // Create a Blob containing the code
    const blob = new Blob([codeToSave], { type: "text/html" });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.html";
    a.style.display = "none";

    // Append the anchor element to the document and trigger a click event
    document.body.appendChild(a);
    a.click();

    // Clean up by removing the anchor and revoking the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function toggleLock() {
    isLocked = !isLocked;
    const lockButton = document.getElementById("lock-button");

    if (isLocked) {
        lockButton.textContent = "Unlock";
        // Disable code editing by setting the textareas to read-only
        document.getElementById("html-code").readOnly = true;
        document.getElementById("css-code").readOnly = true;
        document.getElementById("javascript-code").readOnly = true;
    } else {
        lockButton.textContent = "Lock";
        // Enable code editing by removing the read-only attribute
        document.getElementById("html-code").readOnly = false;
        document.getElementById("css-code").readOnly = false;
        document.getElementById("javascript-code").readOnly = false;
    }
}


// Function to format code using Prettier

// Function to format code using Prettier
async function formatCode() {
    const htmlCodeTextarea = document.getElementById("html-code");
    const cssCodeTextarea = document.getElementById("css-code");
    const javascriptCodeTextarea = document.getElementById("javascript-code");

    // Get the Prettier configuration options you've set previously
    const prettierOptions = window.prettierOptions;

    // Format HTML code
    const formattedHTML = await prettier.format(htmlCodeTextarea.value, {
        parser: "html",
        ...prettierOptions, // Include Prettier options
    });
    htmlCodeTextarea.value = formattedHTML;

    // Format CSS code
    const formattedCSS = await prettier.format(cssCodeTextarea.value, {
        parser: "css",
        ...prettierOptions, // Include Prettier options
    });
    cssCodeTextarea.value = formattedCSS;

    // Format JavaScript code
    const formattedJS = await prettier.format(javascriptCodeTextarea.value, {
        parser: "babel",
        ...prettierOptions, // Include Prettier options
    });
    javascriptCodeTextarea.value = formattedJS;
}

// The rest of your code

// Event listener to call formatCode when the "Format Code" button is clicked
document.getElementById("format-button").addEventListener("click", formatCode);

// The rest of your code
// Perform code indentation on textareas when the Tab key is pressed
document.getElementById("html-code").addEventListener("keydown", function (e) {
    if (e.key === "Tab" && !isLocked) {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
});

// Similar event listeners for CSS and JavaScript textareas
// ...

function run() {
    let htmlcode = document.getElementById("html-code").value;
    let csscode = document.getElementById("css-code").value;
    let javascriptcode = document.getElementById("javascript-code").value;
    let output = document.getElementById("output");

    output.contentDocument.body.innerHTML = htmlcode + "<style>" + csscode + "</style";

    if (!isLocked) {
        try {
            output.contentWindow.eval(javascriptcode);
        } catch (error) {
            console.error("JavaScript Error: " + error.message);
        }
    }
}
