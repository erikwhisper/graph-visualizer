function callConverterFromMatrixInput(matrixString, isAdmg) {
  let jsonConverterData;

  if (isAdmg) {
    jsonConverterData = admgMatrixToJsonConversion(parsePagContent(matrixString));
  } else {
    jsonConverterData = pagMatrixToJsonConversion(parsePagContent(matrixString));
  }

  const dot = jsonToDotConversion(jsonConverterData);

  return { jsonData: jsonConverterData, dot };
}
