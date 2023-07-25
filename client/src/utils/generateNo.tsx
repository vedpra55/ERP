export default function generateRandom5DigitNumber() {
  // Generate a random number between 0 and 99999 (inclusive)
  const randomNumber = Math.floor(Math.random() * 100000);

  // Convert the random number to a string
  let randomString = randomNumber.toString();

  // If the random number has fewer than 5 digits, pad it with leading zeros
  while (randomString.length < 5) {
    randomString = "0" + randomString;
  }

  return randomString;
}
