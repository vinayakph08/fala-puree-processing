export const states = [
  {
    label: "Karnataka",
    value: "karnataka",
    code: "KA",
  },
];

export const DistrictsByState: Record<
  string,
  { label: string; value: string; code: string }[]
> = {
  karnataka: [
    {
      label: "Dharwad",
      value: "dharwad",
      code: "DH",
    },
    // {
    //   label: "Gadag",
    //   value: "gadag",
    //   code: "GD",
    // },
    // {
    //   label: "Koppal",
    //   value: "koppal",
    //   code: "KP",
    // },
    // {
    //   label: "Bellary",
    //   value: "bellary",
    //   code: "BL",
    // },
    // {
    //   label: "Davanagere",
    //   value: "davanagere",
    //   code: "DV",
    // },
    // {
    //   label: "Haveri",
    //   value: "haveri",
    //   code: "HV",
    // },
    // {
    //   label: "Bijapur",
    //   value: "bijapur",
    //   code: "BJ",
    // },
  ],
};

export const VillagesByDistrict: Record<
  string,
  { label: string; value: string; code: string }[]
> = {
  dharwad: [
    {
      label: "Gamangatti",
      value: "gamangatti",
      code: "GM",
    },
  ],
  belgaum: [
    {
      label: "Khanapur",
      value: "ghanapur",
      code: "KH",
    },
    {
      label: "Bailhongal",
      value: "bailhongal",
      code: "BH",
    },
  ],
};

export const adminNumber = ["8553912905", "9113230733", "9008004824"];

export const checkIsAdminNumber = (number: string) => {
  return adminNumber.includes(number);
}