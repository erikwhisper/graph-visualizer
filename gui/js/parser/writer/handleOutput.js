function handleOutput(type, isAdmg) {

  const jsonString = JSON.stringify(jsonData, null, 2);

  const result = callConverterFromJsonInput(jsonString, isAdmg);

  fileWriter(type, jsonString, result.matrix, result.dot);
}
