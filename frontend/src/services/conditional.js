
export function shouldShowQuestion(rules, answersSoFar) {
  if (!rules) return true;
  const { logic = "AND", conditions = [] } = rules;
  if (!conditions.length) return true;

  const evalCondition = (cond) => {
    const val = answersSoFar?.[cond.questionKey];
    const expected = cond.value;
    switch (cond.operator) {
      case "equals": return val === expected;
      case "notEquals": return val !== expected;
      case "contains":
        if (Array.isArray(val)) return val.includes(expected);
        if (typeof val === "string") return val.includes(expected);
        return false;
      default: return false;
    }
  };

  const results = conditions.map(evalCondition);
  return logic === "OR" ? results.some(Boolean) : results.every(Boolean);
}
