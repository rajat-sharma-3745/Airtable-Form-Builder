export const validateForm = (questions, answers) => {
    if(!Object.keys(answers).length){
        return { ok: false,message:'Please fill the form'}
    }
    for (const q of questions) {
        if (q.required) {
            const value = [answers[q.questionKey]];
            if (
                value === "" ||
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0)
            ) {
                console.log('req')
                return { ok: false, message: `${q.label} is required` };
            }
        }
    }
    return { ok: true };
}