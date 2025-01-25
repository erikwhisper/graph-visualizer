function callConverterFromDotInput(dotString, isAdmg) {
  const jsonData = dotToJsonConversion(dotString);

  const matrix = isAdmg
    ? jsonToAdmgMatrixConversion(jsonData)
    : jsonToPagMatrixConversion(jsonData);

  return { jsonData, matrix };
}
