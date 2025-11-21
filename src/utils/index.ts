import type { AcctListItem } from "../api/acctList";

export const formatNumberWithCommas = (value: string | undefined) => {
  if (value === undefined) {
    return;
  }

  const number = parseFloat(value);

  if (isNaN(number)) return "-";

  if (value.includes(",")) return value;

  const formattedNumber = parseFloat(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedNumber;
};

export const formatAcctNumber = (num: string) => {
  return num
    .replace(/\s+/g, "") // remove existing spaces
    .replace(/(\d{4})(?=\d)/g, "$1 ");
};

export const debounceSearch = (fn: (value: string) => void) => {
  let timeoutId: number;

  return (value: string) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(value), 500);
  };
};

export const filterAccounts = (
  list: AcctListItem[],
  searchTerm: string
): AcctListItem[] => {
  if (searchTerm.length === 0) return list;

  const term = searchTerm.toLowerCase();
  return list.filter((account) =>
    account.acctName.toLowerCase().includes(term)
  );
};
