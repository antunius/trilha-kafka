export default function KafkaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-track="kafka">{children}</div>;
}
