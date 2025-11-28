

export const MOCK_TABLES = [
  { id: "tblJobs", name: "Jobs" },
  { id: "tblApplicants", name: "Applicants" },
  { id: "tblFeedback", name: "Feedback" }
];

export const MOCK_FIELDS = {
  tblJobs: [
    { id: "fld1", name: "role", type: "singleSelect", options: ["Engineer","Designer","PM"] },
    { id: "fld2", name: "location", type: "shortText" },
    { id: "fld3", name: "description", type: "longText" },
    { id: "fld4", name: "skills", type: "multiSelect", options: ["React","Node","Python","SQL"] },
    { id: "fld5", name: "resume", type: "attachment" }
  ],
  tblApplicants: [
    { id: "fldA1", name: "name", type: "shortText" },
    { id: "fldA2", name: "email", type: "shortText" },
    { id: "fldA3", name: "portfolio", type: "longText" }
  ],
  tblFeedback: [
    { id: "fldF1", name: "rating", type: "singleSelect", options: ["1","2","3","4","5"] },
    { id: "fldF2", name: "comments", type: "longText" }
  ]
};

export async function fetchTablesForBase(baseId) {
  
  await new Promise(r => setTimeout(r, 250));
  return MOCK_TABLES;
}

export async function fetchFieldsForTable(tableId) {
  await new Promise(r => setTimeout(r, 250));
  return MOCK_FIELDS[tableId] || [];
}
