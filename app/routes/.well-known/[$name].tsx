// app/routes/.well-known/[$name].tsx
export const loader = () => {
  return new Response("No content", { status: 204 });
};

export default function WellKnown() {
  return null;
}
