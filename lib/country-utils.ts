import countriesData from "@/lib/countries.json";

const countryOptions = Object.entries(countriesData).map(([code, name]) => ({
  value: code.toUpperCase(),
  label: name as string,
}));

/** Looks up country name from ISO alpha-2 code. Server + client safe. */
export function getCountryLabel(code: string) {
  return countryOptions.find((c) => c.value === code)?.label ?? code;
}
