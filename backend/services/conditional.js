function evaluateCondition(condition, answers) {
  const userValue = answers[condition.questionKey];

  switch (condition.operator) {
    case "equals":
      return userValue === condition.value;

    case "notEquals":
      return userValue !== condition.value;

    case "contains":
      if (Array.isArray(userValue))
        return userValue.includes(condition.value);
      if (typeof userValue === "string")
        return userValue.includes(condition.value);
      return false;

    default:
      return false;
  }
}

function shouldShowQuestion(rules, answers) {
  if (!rules) return true;

  const { logic, conditions } = rules;

  if (!conditions || conditions.length === 0) return true;

  const results = conditions.map(cond =>
    evaluateCondition(cond, answers)
  );

  if (logic === "AND") return results.every(Boolean);
  if (logic === "OR") return results.some(Boolean);

  return true;
}

export {
  shouldShowQuestion
};
