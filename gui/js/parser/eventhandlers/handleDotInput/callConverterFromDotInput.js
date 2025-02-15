function callConverterFromDotInput(dotString, isAdmg) {
  const jsonConverterData = dotToJsonConversion(dotString);

  const matrix = isAdmg
    ? jsonToAdmgMatrixConversion(jsonConverterData)
    : jsonToPagMatrixConversion(jsonConverterData);

  return { jsonData: jsonConverterData, matrix };
}
