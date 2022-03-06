import nats, { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS!");
});

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

  constructor(private client: Stan) {}

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  }
}

export { Publisher };
