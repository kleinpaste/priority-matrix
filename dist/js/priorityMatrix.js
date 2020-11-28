const root = document.documentElement;

// Set Active Card
let previousCard;
const setCard = (card) => {
  if (previousCard) previousCard.classList.remove("active");
  card.classList.add("active");
  previousCard = card;
};

// Set Active Label
let previousLabel;
const setLabel = (label) => {
  if (previousLabel) root.style.setProperty(`--label-${previousLabel}`, "none");
  root.style.setProperty(`--label-${label}`, "block");
  previousLabel = label;
};

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

// Utility function that returns an array of sticky notes who’s current displayed label values match the string passed to the function
const returnIdenticalLabels = (label) =>
  stickyNotes.filter((object) => object.displayLabels[previousLabel] === label);

// Set Sticky Notes Positioning
const setPositions = (xDataSet, yDataSet) => {
  const container = document.getElementById("data");
  let positions = "";
  stickyNotes.forEach((stickyNote, index) => {
    const identicalLabels = returnIdenticalLabels(
      stickyNote.displayLabels[previousLabel]
    );
    const xValues = identicalLabels.map((object) => object.data[xDataSet] ?? 0);
    const yValues = identicalLabels.map((object) => object.data[yDataSet] ?? 0);
    const valuesAvg = (array) => {
      const numbersOnly = array.filter((entry) => typeof entry === "number");
      return numbersOnly.reduce((a, b) => a + b, 0) / numbersOnly.length;
    };
    positions =
      positions +
      ` --${index}-x: ${valuesAvg(xValues) * 100}%; --${index}-y: ${
        valuesAvg(yValues) * 100
      }%;`;
  });
  container.setAttribute("style", positions);
};

// Track Sticky Note Outline for Tracking
const toggleActiveSticky = (stickyNote) => {
  const label = stickyNotes[stickyNote.dataset.id].displayLabels[previousLabel];
  const identicalLabels = returnIdenticalLabels(label);

  if (identicalLabels.length > 1) {
    const elementsToToggle = [];
    const hasActive = () =>
      elementsToToggle.some((element) => element.classList.contains("active"));

    identicalLabels.forEach((object) => {
      const id = stickyNotes.indexOf(object);
      const element = document.querySelector(`[data-id="${id}"]`);
      elementsToToggle.push(element);
    });

    if (hasActive()) {
      elementsToToggle.forEach((element) => element.classList.remove("active"));
    } else {
      elementsToToggle.forEach((element) => element.classList.add("active"));
    }
  } else {
    stickyNote.classList.toggle("active");
  }
};

// Manage isStacked tracking layout onLoad and Window onResize
let isStacked;
window.onresize = () => {
  const viewportWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  isStacked = viewportWidth >= 1024 ? false : true;
};
window.onresize();

// Set and Change the Active Data Set
const setVisualization = (card, label, xDataSet, yDataSet) => {
  setCard(card);
  setLabel(label);
  setPositions(xDataSet, yDataSet);
  setAxisesLabels(xDataSet, yDataSet);
  if (isStacked) window.scrollTo(0, 0);
};

// Construct Category CSS Variable(s)
const constructCategoryVariables = () => {
  categories.forEach((object) => {
    root.style.setProperty(
      `--colors-stickyNotes-${object.key}`,
      `${object.color}`
    );
  });
};
// Construct Label CSS Variable(s)
const constructLabelVariables = () => {
  const labels = [];
  // Build labels array for each unique labels key in the stickNotes array
  stickyNotes.forEach((stickyNote) => {
    Object.keys(stickyNote.displayLabels).forEach((key) => {
      if (!labels.includes(key)) labels.push(key);
    });
  });
  // Iterates the labels array to create and assign a CSS variable for each label key
  labels.forEach((label) => {
    root.style.setProperty(`--label-${label}`, " none");
  });
};

const constructVisualizationCards = () => {
  const container = document.getElementById("visualizations");
  const fragment = document.createDocumentFragment();

  visualizations.forEach((object) => {
    // Construct HTML button (card) container
    const button = document.createElement("button");
    button.setAttribute("class", "visualizations__card");
    button.setAttribute(
      "onclick",
      `setVisualization(this, '${object.dataSet.displayLabel}', '${object.dataSet.xDataSet}', '${object.dataSet.yDataSet}')`
    );
    // Append button/card title if there is a title
    if (object.title) {
      const title = document.createElement("h2");
      title.setAttribute("class", "visualizations__cardTitle");
      title.textContent = object.title;
      button.appendChild(title);
    }
    // Append button/card description if there is a description
    if (object.description) {
      const description = document.createElement("p");
      description.setAttribute("class", "visualizations__cardDescription");
      description.textContent = object.description;
      button.appendChild(description);
    }
    // Append button/card segment size if ther is a segment size
    if (object.segmentSize) {
      const segmentSize = document.createElement("p");
      segmentSize.setAttribute("class", "visualizations__cardSegmentSize");
      segmentSize.textContent = `n ${object.segmentSize}`;
      button.appendChild(segmentSize);
    }
    // Append the HTML button (card) element to the fragment
    fragment.appendChild(button);
  });
  // Append the fragment to the element in the DOM
  container.appendChild(fragment);
};
// Construct Category Key Sticky Note Element(s) and Append to DOM
const constructCategoryKey = () => {
  const container = document.getElementById("key");
  const fragment = document.createDocumentFragment();

  categories.forEach((object) => {
    const div = document.createElement("div");
    div.classList.add(
      "matrixGraph__stickyNote",
      "matrixGraph__stickyNote--key"
    );
    div.setAttribute(
      "style",
      `background: var(--colors-stickyNotes-${object.key ?? "default"});`
    );

    const label = document.createElement("p");
    label.textContent = object.displayLabel;
    div.appendChild(label);

    fragment.appendChild(div);
  });
  container.appendChild(fragment);
};
// Construct Sticky Notes
const constructStickyNotes = () => {
  const container = document.getElementById("data");
  // Function to generate a class list for the sticky note
  const returnClassList = (object) => {
    const classes = ["matrixGraph__stickyNote"];
    if (object.isFlagged === true) {
      classes.push("matrixGraph__stickyNote--isFlagged");
    }
    return classes;
  };
  // Fragment to append Sticky Notes to before appending fragment to DOM
  const fragment = document.createDocumentFragment();
  stickyNotes.forEach((stickyNote, index) => {
    const classes = returnClassList(stickyNote);

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

    stickyNote.displayLabels &&
      Object.entries(stickyNote.displayLabels).forEach((entry) => {
        const [key, value] = entry;
        const label = document.createElement("p");
        label.setAttribute("style", `display: var(--label-${key});`);
        label.textContent = value;
        div.appendChild(label);
      });

    fragment.appendChild(div);
  });
  // Appends the fragment of ALL Sticky Notes to the container element in the DOM
  container.appendChild(fragment);
};

// Sets initial state
constructCategoryVariables();
constructLabelVariables();

constructVisualizationCards();
constructCategoryKey();
constructStickyNotes();

setVisualization(
  document.querySelector(".visualizations > button:first-of-type"),
  visualizations[0].dataSet.displayLabel,
  visualizations[0].dataSet.xDataSet,
  visualizations[0].dataSet.yDataSet
);
