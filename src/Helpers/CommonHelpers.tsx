interface CountryData {
  [key: string]: number;
}
const populationMapper: CountryData = {
  Population: Number.MAX_SAFE_INTEGER,
  "<1 Million": 1000000,
  "<5 Million": 5000000,
  "<10 Million": 10000000,
};

export default populationMapper;
