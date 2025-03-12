function callConverterFromJsonInput(jsonString, isAdmg) {
  const jsonConverterData = JSON.parse(jsonString);

  const matrix = isAdmg
    ? jsonToAdmgMatrixConversion(jsonConverterData)
    : jsonToPagMatrixConversion(jsonConverterData);

  const dot = jsonToDotConversion(jsonConverterData);

  return { matrix, dot };
}
