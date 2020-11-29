const root = document.documentElement;
let currentlyActiveCard;
let currentStickyDisplayLabel;
let isLayoutStacked;

// Utility function returns an array of Sticky Note objects who’s CURRENT displayed label value matchs the string passed to the function
const returnIdenticalStickyDisplayLabels = (labelToMatch) => {
  return stickyNotes.filter(
    (object) => object.displayLabels[currentStickyDisplayLabel] === labelToMatch
  );
};

// Sets active Visualization Card by adding and removing .active class
const setActiveCard = (card) => {
  if (currentlyActiveCard) currentlyActiveCard.classList.remove("active");
  card.classList.add("active");
  currentlyActiveCard = card;
};

// Sets Sticky Note displayLabel via updating CSS variable(s)
const setStickyDisplayLabel = (displayLabel) => {
  if (currentStickyDisplayLabel)
    root.style.setProperty(`--label-${currentStickyDisplayLabel}`, "none");
  root.style.setProperty(`--label-${displayLabel}`, "block");
  currentStickyDisplayLabel = displayLabel;
};

// Sets graph axises labels by updating DOM elements textContent
const setAxisesLabels = (xDataSet, yDataSet) => {
  const yMax = document.getElementById("yMax");
  const yMain = document.getElementById("yMain");
  const yMin = document.getElementById("yMin");
  const xMax = document.getElementById("xMax");
  const xMain = document.getElementById("xMain");
  const xMin = document.getElementById("xMin");

  yMax.textContent = axises[yDataSet].max ?? "High";
  yMain.textContent = axises[yDataSet].main ?? "Y Axis";
  yMin.textContent = axises[yDataSet].min ?? "Low";
  xMax.textContent = axises[xDataSet].max ?? "High";
  xMain.textContent = axises[xDataSet].main ?? "X Axis";
  xMin.textContent = axises[xDataSet].min ?? "Low";
};

// Sets all Sticky Note positions via updating CSS variables
const setStickyPositions = (xDataSet, yDataSet) => {
  const container = document.getElementById("data");
  let positions = "";
  stickyNotes.forEach((stickyNote, index) => {
    const identicalLabels = returnIdenticalStickyDisplayLabels(
      stickyNote.displayLabels[currentStickyDisplayLabel]
    );
    const xValues = identicalLabels.map((object) => object.data[xDataSet] ?? 0);
    const yValues = identicalLabels.map((object) => object.data[yDataSet] ?? 0);
    const returnArrayAvgValues = (array) => {
      const numbersOnly = array.filter((entry) => typeof entry === "number");
      return numbersOnly.reduce((a, b) => a + b, 0) / numbersOnly.length;
    };
    positions =
      positions +
      ` --${index}-x: ${returnArrayAvgValues(xValues) * 100}%; --${index}-y: ${
        returnArrayAvgValues(yValues) * 100
      }%;`;
  });
  container.setAttribute("style", positions);
};

// Sets the active dataset
const setVisualization = (card, label, xDataSet, yDataSet) => {
  setActiveCard(card);
  setStickyDisplayLabel(label);
  setAxisesLabels(xDataSet, yDataSet);
  setStickyPositions(xDataSet, yDataSet);
  if (isLayoutStacked) window.scrollTo(0, 0);
};

// Toggles .active class on one or more Sticky Note(s) dependent on if there are other Sticky Notes with CURRENTLY matching displayLabels
const toggleActiveSticky = (stickyNote) => {
  const label =
    stickyNotes[stickyNote.dataset.id].displayLabels[currentStickyDisplayLabel];
  const identicalLabels = returnIdenticalStickyDisplayLabels(label);
  // if there are multiple Sticky Notes with the same CURRENT displayLabel they are all toggled
  if (identicalLabels.length > 1) {
    const elementsToToggle = [];
    const isActive = () => {
      return elementsToToggle.some((element) =>
        element.classList.contains("active")
      );
    };
    // Selects Sticky Note elements in DOM and pushes them to the elementsToToggle array
    identicalLabels.forEach((object) => {
      const id = stickyNotes.indexOf(object);
      const element = document.querySelector(`[data-id="${id}"]`);
      elementsToToggle.push(element);
    });
    // if ANY of the elements in the elementsToToggle array have the class .active, it is removed from all of the elements in the elementsToToggle array
    if (isActive()) {
      elementsToToggle.forEach((element) => element.classList.remove("active"));
    } else {
      // else the class .active is added to all of the elements in the elementsToToggle array
      elementsToToggle.forEach((element) => element.classList.add("active"));
    }
  } else {
    // else if there are NOT multiple Sticky Notes with the same CURRENT displayLabel the .active class is toggled on ONLY the element passed into the function
    stickyNote.classList.toggle("active");
  }
};

// Updates isLayoutStacked variable on Window Resize
window.onresize = () => {
  const viewportWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  isLayoutStacked = viewportWidth >= 1024 ? false : true;
};

// Constructs Category Color CSS variable(s)
const constructCategoryColorVariables = () => {
  categories.forEach((object) => {
    root.style.setProperty(
      `--colors-stickyNotes-${object.key}`,
      `${object.color}`
    );
  });
};

// Constructs Sticky Note displayLabel CSS variable(s)
const constructStickyDisplayLabelVariables = () => {
  const labels = [];
  // Builds labels array for each unique label key in the stickyNotes array
  stickyNotes.forEach((stickyNote) => {
    Object.keys(stickyNote.displayLabels).forEach((key) => {
      if (!labels.includes(key)) labels.push(key);
    });
  });
  // Iterates the labels array to construct and assign a CSS variable for each label
  labels.forEach((label) => {
    root.style.setProperty(`--label-${label}`, " none");
  });
};

// Constructs the Visualization Card element(s) and appends them to the DOM
const constructVisualizationCards = () => {
  const container = document.getElementById("visualizations");
  const fragment = document.createDocumentFragment();

  visualizations.forEach((object) => {
    // Constructs HTML button element (Card)
    const button = document.createElement("button");
    button.setAttribute("class", "visualizations__card");
    button.setAttribute(
      "onclick",
      `setVisualization(this, '${object.dataSet.displayLabel}', '${object.dataSet.xDataSet}', '${object.dataSet.yDataSet}')`
    );
    // if there is a card title constructs the element and appends it to the button element
    if (object.title) {
      const title = document.createElement("h2");
      title.setAttribute("class", "visualizations__cardTitle");
      title.textContent = object.title;
      button.appendChild(title);
    }
    // if there is a card description constructs the element and appends it to the button element
    if (object.description) {
      const description = document.createElement("p");
      description.setAttribute("class", "visualizations__cardDescription");
      description.textContent = object.description;
      button.appendChild(description);
    }
    // if there is a card segment size constructs the element and appends it to the button element
    if (object.segmentSize) {
      const segmentSize = document.createElement("p");
      segmentSize.setAttribute("class", "visualizations__cardSegmentSize");
      segmentSize.textContent = `n ${object.segmentSize}`;
      button.appendChild(segmentSize);
    }
    // Appends the HTML button element (Card) to the fragment
    fragment.appendChild(button);
  });
  // Appends the fragment to the container element in the DOM
  container.appendChild(fragment);
};

// Constructs the Category Color Key Sticky Note element(s) and appends them to the DOM
const constructCategoryKey = () => {
  const container = document.getElementById("key");
  const fragment = document.createDocumentFragment();

  categories.forEach((object) => {
    // Constructs HTML div element (Sticky Note)
    const div = document.createElement("div");
    div.classList.add(
      "matrixGraph__stickyNote",
      "matrixGraph__stickyNote--key"
    );
    div.setAttribute(
      "style",
      `background: var(--colors-stickyNotes-${object.key ?? "default"});`
    );
    // Constructs the label element and appends it to the div element
    const label = document.createElement("p");
    label.textContent = object.displayLabel;
    div.appendChild(label);
    // Appends the HTML div element (Sticky Note) to the fragment
    fragment.appendChild(div);
  });
  // Appends the fragment to the container element in the DOM
  container.appendChild(fragment);
};

// Constructs the Sticky Note element(s) and appends them to the DOM
const constructStickyNotes = () => {
  const container = document.getElementById("data");
  const fragment = document.createDocumentFragment();

  // Utility function to construct a class list for the Sticky Note
  const returnClassList = (object) => {
    const classes = ["matrixGraph__stickyNote"];
    if (object.isFlagged === true) {
      classes.push("matrixGraph__stickyNote--isFlagged");
    }
    return classes;
  };

  stickyNotes.forEach((stickyNote, index) => {
    const classes = returnClassList(stickyNote);
    // Constructs HTML div element (Sticky Note)
    const div = document.createElement("div");
    div.setAttribute("data-id", index);
    div.classList.add(...classes);
    div.setAttribute(
      "style",
      `left: var(--${index}-x); bottom: var(--${index}-y); background: var(--colors-stickyNotes-${
        stickyNote.category ?? "default"
      });`
    );
    div.setAttribute("onclick", "toggleActiveSticky(this)");
    // if there are ANY displayLabels constructs an element and appends them to the div element
    stickyNote.displayLabels &&
      Object.entries(stickyNote.displayLabels).forEach((entry) => {
        const [key, value] = entry;
        const label = document.createElement("p");
        label.setAttribute("style", `display: var(--label-${key});`);
        label.textContent = value;
        div.appendChild(label);
      });
    // Appends the HTML div element (Sticky Note) to the fragment
    fragment.appendChild(div);
  });
  // Appends the fragment to the  container element in the DOM
  container.appendChild(fragment);
};

// Initial Setup Time!
// Sets the initial state for isLayoutStacked variable
window.onresize();
// Setsup CSS variable(s)
constructCategoryColorVariables();
constructStickyDisplayLabelVariables();
// Constructs and Appends HTML elements to DOM
constructVisualizationCards();
constructCategoryKey();
constructStickyNotes();
// Sets the initial dataset / state
setVisualization(
  document.querySelector(".visualizations > button:first-of-type"),
  visualizations[0].dataSet.displayLabel,
  visualizations[0].dataSet.xDataSet,
  visualizations[0].dataSet.yDataSet
);
