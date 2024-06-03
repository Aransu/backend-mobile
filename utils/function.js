const generateRandomFiveDigitNumberAsString = () => {
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;

  const randomString = randomNumber.toString();


  return randomString
};

const generateRandomPassword = () => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
export { generateRandomFiveDigitNumberAsString, generateRandomPassword, removeDiacritics }