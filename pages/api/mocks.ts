import faker from "faker";

export const mockAPI = {
    TicketedEvent: () => ({
        name: () => faker.random.arrayElement(["Bay Dreams", "Rhythm and Vines", "Australian Open", "Formula 1"]),
        venue: () => faker.address.streetName(),
        description :() => faker.random.arrayElement(["Event of the summer", "Enjoy yourself at the event", "Special guests and friends"]),

    }),
    TicketType : () => ({
        name: () => faker.random.arrayElement(["Pre-sales", "Box-office", "General sales"]),
    }),
    Address: () => ({}),
    ID: () => faker.datatype.uuid(),
    Int: () => faker.datatype.number({ min :1, max: 200 }),
    String: () => faker.datatype.string(),
    Boolean : () => faker.datatype.boolean()
};