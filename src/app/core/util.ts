export const splitIntoTerms = (value: string) => {
  const result = [];
  if (value === undefined || value === null) {
    return result;
  }

  const quotedTerms = [];
  const valueWithoutQuotedTerms = value.replace(/"([^"]*)"/g, (match, quotedWord) => {
    quotedTerms.push(quotedWord);
    return '';
  });

  return valueWithoutQuotedTerms.split(/\s+/)
    .concat(quotedTerms)
    .map((word) => word.replace(/[^\w .]/g, '').trim()) // Allow word characters, spaces, and periods
    .filter((word) => !!word);
};
