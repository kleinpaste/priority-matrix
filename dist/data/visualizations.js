const visualizations = [
  {
    title: "Business Evaluation",
    description:
      "An internal audit of code and design quality graphed against the business value of features and systems.",
    dataSet: {
      displayLabel: "internal",
      xDataSet: "quality",
      yDataSet: "businessValue",
    },
  },
  {
    title: "Business Evaluation",
    description:
      "System usability testing of key features graphed against the business value of those key features.",
    segmentSize: "741",
    dataSet: {
      displayLabel: "internal",
      xDataSet: "systemUsability",
      yDataSet: "businessValue",
    },
  },
  {
    title: "All User Groups",
    description:
      "Users perceived value of key features graphed against an internal audit of code and design quality for all features and systems.",
    segmentSize: "741",
    dataSet: {
      displayLabel: "internal",
      xDataSet: "quality",
      yDataSet: "personasAvg",
    },
  },
  {
    title: "All User Groups",
    description:
      "Users perceived value of key features graphed against system usability testing of those key features.",
    segmentSize: "741",
    dataSet: {
      displayLabel: "external",
      xDataSet: "systemUsability",
      yDataSet: "personasAvg",
    },
  },
  {
    title: "Persona Group One",
    description:
      "“The DJ” is known for their versatility. They have a desire to share and please others or match the mood of the room. When not sharing they are on the quest to expand their catalog looking for the next big hit.",
    segmentSize: "252",
    dataSet: {
      displayLabel: "external",
      xDataSet: "systemUsability",
      yDataSet: "personaOneValue",
    },
  },
  {
    title: "Persona Group Two",
    description:
      "“The Explore” is easy going when it comes to music. They do have some favorites, but most often just go with the flow and trends of what is playing today.",
    segmentSize: "242",
    dataSet: {
      displayLabel: "external",
      xDataSet: "systemUsability",
      yDataSet: "personaTwoValue",
    },
  },
  {
    title: "Persona Group Three",
    description:
      "“The Established Enthusiast” knows what they like. They have been listening to music for years and established a tight-knit collection of their go to music. ",
    segmentSize: "247",
    dataSet: {
      displayLabel: "external",
      xDataSet: "systemUsability",
      yDataSet: "personaThreeValue",
    },
  },
];
