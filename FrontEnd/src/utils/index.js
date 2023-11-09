import { ethers } from "ethers"

export const explore_cards = [

  {
    name: "My Contracts",
    bgCustom: "/second_pattern.svg"
  },
  {
    name: "Become An Auditor",
    bgCustom: "/first_pattern.svg"
  },
  {
    name: "Shared Balance",
    bgCustom: "/third_pattern.svg"
  },
]
export const overdraft_cards = [
  {
    name: "Current Limit",
    amount: 65.00,
    color: "#2A0FB1"
  },
  {
    name: "Current Overdraft",
    amount: 0.00,
    color: "#C27810"
  },
  {
    name: "Available Overdraft",
    amount: 65.00,
    color: "#49BE1B"
  },
]

export const glasses = [
  {
    name: "Account Details",
    imagePath: "/mdi_account-details-outline.svg",
    link: "/home/account_info"
  },
  {
    name: "Fund Account",
    imagePath: "/ri_refund-2-line.svg",
    link: "/home/fund"
  },
  {
    name: "Withdraw",
    imagePath: "/ri_funds-box-line.png",
    link: "/home/withdraw"
  },
  {
    name: "Statement",
    imagePath: "/ep_document.svg",
    link: "/statement"
  },
  {
    name: "Lock",
    imagePath: "/iconamoon_lock.svg",
    link: "/lock_account"
  },
]
export const clubs = [
  {
    name: "Holiday in UK",
    imagePath: "/savings/dollar_coins.svg",
    bg_col: "rgba(143, 231, 108, 0.50)",
    members: 102
  },
  {
    name: "Rent",
    imagePath: "/savings/hand_sack.svg",
    bg_col: "rgba(224, 207, 186, 0.50)",

    members: 65
  },
  {
    name: "New Business",
    imagePath: "/savings/wallet_saving.svg",
    bg_col: "rgba(150, 149, 236, 0.50)",

    members: 198
  },
]

export const coins = ["/usdt.svg", "/ethereum.svg", "/bitcoin.svg"]

export const generateQuarterlyDates = () => {
  const newArray = [];
  const startDate = new Date(); // Get the current date
  startDate.setMonth(0); // Set the starting month to January (0-indexed)
  startDate.setDate(1); // Set the starting day to the 1st

  for (let i = 0; i < 8; i++) { // Generate dates for the next 8 quarters (2 years)
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const quarterStartMonth = month - (month % 3);
    const quarterEndMonth = quarterStartMonth + 2;

    const quarterEndDate = new Date(year, quarterEndMonth + 1, 0); // Get the last day of the quarter

    const formattedDate = `31st ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(quarterEndDate)}`;
    newArray.push(formattedDate);
    startDate.setMonth(quarterStartMonth + 3); // Move to the next quarter
  }
  return newArray;
}

export function removeDuplicateObjects(array) {
  const uniqueObjects = [];
  const seenObjects = new Set();

  for (const obj of array) {
    // Serialize the object to a JSON string for easy comparison
    const objString = JSON.stringify(obj);

    if (!seenObjects.has(objString)) {
      seenObjects.add(objString);
      uniqueObjects.push(obj);
    }
  }

  return uniqueObjects;
}

export function returnPercentage(start, end) {
  const percentage = ((start / end) * 100)
  console.log(percentage);
  return percentage
}

export function formatDate(timestamp) {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Add the "th" to the day
  const day = date.getDate();
  const dayWithSuffix = day + (day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th');

  return formattedDate.replace(String(day), dayWithSuffix);
}

export function formatUSDT(val) {
  const formatVal = ethers.utils.formatUnits(val, 6)
  return formatVal;
}

export function getEightPercent(val) {
  const data = (val * 8) / 100
  return data;
}