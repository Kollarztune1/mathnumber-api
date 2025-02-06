import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());


const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};


const isPerfect = (num) => {
  let sum = 1;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num && num !== 1;
};


const isArmstrong = (num) => {
  const digits = num.toString().split("").map(Number);
  const power = digits.length;
  return digits.reduce((sum, digit) => sum + Math.pow(digit, power), 0) === num;
};


const digitSum = (num) => num.toString().split("").reduce((sum, digit) => sum + Number(digit), 0);


const getFunFact = async (num) => {
  try {
    const response = await axios.get(`http://numbersapi.com/${num}/math`);
    return response.data;
  } catch (error) {
    return "No fun fact available.";
  }
};


app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;

  
  if (!number || isNaN(number)) {
    return res.status(400).json({ number, error: true });
  }

  const num = parseInt(number, 10);
  const properties = [];

  if (isArmstrong(num)) properties.push("armstrong");
  properties.push(num % 2 === 0 ? "even" : "odd");

  const response = {
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties,
    digit_sum: digitSum(num),
    fun_fact: await getFunFact(num),
  };

  res.json(response);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
