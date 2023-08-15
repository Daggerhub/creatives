class Creative {
    constructor(title, subTitle, bgColor) {
        this.title = title;
        this.subTitle = subTitle;
        this.bgColor = bgColor;
    }

    createElement() {
        const creativeElement = document.createElement("div");
        creativeElement.classList.add("creative");
        creativeElement.style.backgroundColor = this.bgColor;
        creativeElement.innerHTML = `
            <h2>${this.title}</h2>
            ${this.subTitle ? `<p>${this.subTitle}</p>` : ""}
        `;
        return creativeElement;
    }
}

const openDrawerBtn = document.getElementById("openDrawerBtn");
const drawer = document.getElementById("drawer");
const addCreativeForm = document.getElementById("addCreativeForm");
const bgColorFieldset = document.getElementById("bgColor");
const creativeList = document.getElementById("creativeList");
const progressBarContainer = document.getElementById("progressBarContainer");
const progressBar = document.getElementById("progressBar");
const submitbtn = document.getElementById("submitbtn")
const closeBtn = document.getElementById("closeBtn")
const progressBarLable = document.getElementById("progressBarLable")
const colorFilterSelect = document.getElementById("colorFilter");
const titleFilterInput = document.getElementById("titleFilter");
const removeFiltersBtn = document.getElementById("removeFilters");
const creatives = [];

function renderCreatives(creativesArray) {
    creativeList.innerHTML = "";
    creativesArray.forEach((creative, index) => {
        const creativeElement = document.createElement("div");
        creativeElement.classList.add("creative");
        creativeElement.style.backgroundColor = creative.bgColor;
        creativeElement.innerHTML = `
            <h2>${creative.title}</h2>
            <p>${creative.subTitle}</p>
        `;
        creativeList.appendChild(creativeElement);
    });
}

function populateColorOptions(selectElements) {
fetch("https://random-flat-colors.vercel.app/api/random?count=5")
    .then((response) => response.json())
    .then((data) => {
        if (Array.isArray(data.colors)) {
            selectElements.map((ele) => {
                data.colors.forEach((color) => {
                    const radioInput = document.createElement("input");
                    radioInput.type = "radio";
                    radioInput.name = ele.inputName;
                    radioInput.value = color;
                    radioInput.style.backgroundColor = color;
                    ele.element.appendChild(radioInput);
                })
            });
        } else {
            console.error("Invalid API response format");
        }
    })
    .catch((error) => {
        console.error("Error fetching colors:", error);
    });

}    

function applyFilters() {
    removeFiltersBtn.classList.remove("hidden")
    const titleFilter = titleFilterInput.value.toLowerCase();
    const selectedColorRadio = document.querySelector('input[name="colorFilter"]:checked');
    const colorFilter = selectedColorRadio ? selectedColorRadio.value : "";    
    const filteredCreatives = creatives.filter((creative) => {
        const titleMatches = creative.title.toLowerCase().includes(titleFilter);
        const colorMatches = colorFilter === "" || creative.bgColor === colorFilter;
        return colorMatches && titleMatches;
    });
    renderCreatives(filteredCreatives);
}

function updateAddButtonState() {
    const title = addCreativeForm.elements.title.value;
    const subTitle = addCreativeForm.elements.subTitle.value;
    const selectedBgColor = addCreativeForm.querySelector('input[name="bgColor"]:checked');

    if (title && subTitle && selectedBgColor) {
        submitbtn.disabled = false;
    } else {
        submitbtn.disabled = true;
    }
}

function updateProgressBar() {
    progressBarLable.innerHTML = `${creatives.length}/5`
    const progressPercentage = (creatives.length / 5) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

populateColorOptions([{element: bgColorFieldset, inputName: 'bgColor'}, {element: colorFilter, inputName: 'colorFilter'}]);

titleFilterInput.addEventListener("input", applyFilters);

colorFilterSelect.addEventListener("change", applyFilters);

removeFiltersBtn.addEventListener("click", () => {
    const colorFilter = document.querySelector('input[name="colorFilter"]:checked');
    if(colorFilter) colorFilter.checked = false
    titleFilterInput.value = ""    
    removeFiltersBtn.classList.add("hidden")
    renderCreatives(creatives)
})

openDrawerBtn.addEventListener("click", () => {
    removeFiltersBtn.classList.add("hidden")
    const colorFilter = document.querySelector('input[name="colorFilter"]:checked');
    titleFilterInput.value = ""
    if(colorFilter) colorFilter.checked = false
    if(creatives.length) renderCreatives(creatives)
    openDrawerBtn.disabled = "true"
    drawer.classList.add("open");
});

closeBtn.addEventListener("click", ()=> {
    openDrawerBtn.removeAttribute("disabled")
    drawer.classList.remove("open")
})

addCreativeForm.elements.title.addEventListener("input", updateAddButtonState);

addCreativeForm.elements.subTitle.addEventListener("input", updateAddButtonState);

addCreativeForm.addEventListener("change", updateAddButtonState);

addCreativeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (creatives.length >= 5) {
        alert("You can't add more than 5 creatives.");
        return;
    }

    console.log(event.target)

    const { title, subTitle, bgColor } = event.target.elements;

    console.log(bgColor)

    const selectedBgColor = Array.from(bgColor).find((radio) => radio.checked).value;

    const creative = new Creative(title.value, subTitle.value, selectedBgColor);
    creatives.push(creative);
    const creativeElement = creative.createElement();
    creativeList.appendChild(creativeElement);

    updateProgressBar();
    openDrawerBtn.removeAttribute("disabled")
    drawer.classList.remove("open"); 
    submitbtn.disabled = "true"
    event.target.reset();
});

