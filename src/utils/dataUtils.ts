import { faker } from '@faker-js/faker';
import { Item } from "../types";

const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"] as const;

export const generateData = (count: number, prefix: string): Item[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });
    const status = faker.helpers.arrayElement(STATUSES);
    const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(faker.finance.amount({ min: 10, max: 1000 })));
    
    // Occasional edge cases
    const isEdgeCase = i % 100 === 0;
    const finalName = isEdgeCase ? `${fullName} ${"Very Long Name ".repeat(5)}` : fullName;

    return {
      id: `${prefix}-${i}`,
      text: `${faker.commerce.productName()}`,
      value: Math.floor(Math.random() * 1000),
      customer: finalName,
      email: email,
      status: status,
      amount: amount
    };
  });
};
