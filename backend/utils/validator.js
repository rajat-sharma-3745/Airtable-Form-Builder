export function validateField(question, value) {
  const { type, options, label } = question;

  if (question.required && (value === undefined || value === "")) {
    return `${label} is required`;
  }

  if (!question.required && (value === undefined || value === "")) {
    return null;
  }

  switch (type) {

    case "singleSelect":
      if (!options || !options.length) return null; 

      if (!options.includes(value)) {
        return `${label} must be one of: ${options.join(", ")}`;
      }
      return null;

    case "multiSelect":
      if (!Array.isArray(value)) {
        return `${label} must be an array`;
      }

      const invalid = value.filter(v => !options.includes(v));
      if (invalid.length > 0) {
        return `${label} has invalid choices: ${invalid.join(", ")}`;
      }

      return null;

    case "shortText":
    case "longText":
      if (typeof value !== "string") {
        return `${label} must be a string`;
      }
      return null;

    case "attachment":  
      if (!Array.isArray(value)) {
        return `${label} must contain uploaded files`;
      }
      return null;

    default:
      return null; 
  }
}

