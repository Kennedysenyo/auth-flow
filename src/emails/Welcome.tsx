import {
  Html,
  Heading,
  Preview,
  Body,
  Text,
  Container,
} from "@react-email/components";

export default function WelcomEmail({ name = "Kennedy" }: { name?: string }) {
  return (
    <Html>
      <Heading />
      <Preview>Welcom to Kencoding</Preview>
      <Body>
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "500px",
            border: "2px solid black",
            padding: "4px",
            backgroundColor: "rgb(50,40,150, 0.5)",
          }}
        >
          <Text style={{ color: "red", fontSize: "20px" }}>Hello {name},</Text>
          <Text>You are wolcome to KenCoding. </Text>
          <Text>
            We hope that you start your development jouney with us. Happy
            Coding.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
