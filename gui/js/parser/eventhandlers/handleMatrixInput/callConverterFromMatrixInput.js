function callConverterFromMatrixInput(matrixString, isAdmg) {
  let jsonData;

  if (isAdmg) {
    jsonData = admgMatrixToJsonConversion(parsePagContent(matrixString));
  } else {
    jsonData = pagMatrixToJsonConversion(parsePagContent(matrixString));
  }

  const dot = jsonToDotConversion(jsonData);

  return { jsonData, dot };
}
