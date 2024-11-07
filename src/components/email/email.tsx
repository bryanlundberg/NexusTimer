import * as React from "react";
import {
  Html,
  Button,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Section,
} from "@react-email/components";

export default function Email({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to NexusTimer! Your account has been successfully created.
      </Preview>
      <Body>
        <Container>
          <Text>Hi {name},</Text>
          <Text>
            We&lsquo;re excited to have you on board as part of our growing
            community of speedcubing enthusiasts. Experience the ultimate
            cross-platform application designed specifically for cubers like
            you.
          </Text>

          <Section>
            <Text style={{ fontWeight: "bold", fontSize: "1.3em" }}>
              Whats next?
            </Text>
          </Section>

          <Text>
            1. <span style={{ fontWeight: "bold" }}>Create collections</span>:{" "}
            We encourage tracking statistics by individual cubes without
            affecting overall category metrics.
          </Text>
          <Text>
            2. <span style={{ fontWeight: "bold" }}>Import your times</span>{" "}
            from csTimer, CubeDesk, TwistyTimer.
          </Text>
          <Text>
            3. <span style={{ fontWeight: "bold" }}>Customize you timer</span>{" "}
            by selecting from a variety of features and colors.
          </Text>
          <Section>
            <Button href="https://nexustimer.com">Get cubing</Button>
          </Section>
          <Section>
            <Text>
              Happy cubing,
              <br />
              The NexusTimer Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
