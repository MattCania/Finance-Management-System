import { AccountSchema } from "fastify";
import { z } from "zod";

export async function calculate_age(birthday: string) {
  const birthdate = new Date(birthday);
  const today = new Date();
  let age: number =
    Number(today.getFullYear()) - Number(birthdate.getFullYear());

  const monthDifference = today.getMonth() - birthdate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthdate.getDate())
  ) {
    age--;
  }
  return age;
}

// export function validate_date(dateString: string) {
//   const date = new Date()
//   if (dateString.length > 9) return false
//   if (Number(dateString.slice(5, dateString.length - 1)) > date.getFullYear()) return false
//   return true
// }

export async function validate_account(account: AccountSchema) {
  const errors = [];

  const accountSchema = z.object({
    email: z.string(),
    password: z.string(),
    firstname: z.string(),
    middlename: z.string(),
    lastname: z.string(),
    birthday: z.string(),
    address: z.string(),
    country: z.string(),
    currency: z.string(),
    balance: z.number(),
    income_amount: z.number(),
    income_period: z.string(),
  });

  const parsed = accountSchema.safeParse(account);

  const age = await calculate_age(account.birthday);

  if (!account.email.includes("@")) errors.push({ email: "Invalid Email" });
  if (account.password.length > 20 || account.password.length < 8)
    errors.push({
      password: "Invalid Password Length! Must be 8 to 20 characters only",
    });
  // if (!validate_date(account.birthday))
  //   errors.push({ birthday: "Invalid Birthday" });
  if (age < 18) errors.push({ age: "Invalid Age" });
  if (
    !["PHP", "USD", "EUR", "JPY", "GBP"].includes(
      account.currency.toUpperCase()
    )
  )
    errors.push({ currency: "Invalid Currency" }); // TODO (Future Global Currency Checkere)
  if (
    !["monthly", "semi-monthly", "quarterly", "semi-annual", "weekly"].includes(
      account.income_period.toLowerCase()
    )
  )
    errors.push({ income_period: "Invalid Income Period" });
  if (isNaN(Number(account.income_amount)) || isNaN(Number(account.balance)))
    errors.push({ income_period: "Invalid Income Period" });
  if (Number(account.income_amount) < 1000 || Number(account.balance) < 1000)
    errors.push({
      income: "Income Amount or Initial Deposit must contain at least 1000",
    });

  return { errors: errors, parsed: parsed.success };
}
