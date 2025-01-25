function callConverterFromJsonInput(jsonString, isAdmg) {
  const jsonData = JSON.parse(jsonString);

  const matrix = isAdmg
    ? jsonToAdmgMatrixConversion(jsonData)
    : jsonToPagMatrixConversion(jsonData);

  const dot = jsonToDotConversion(jsonData);

  return { matrix, dot };
}
