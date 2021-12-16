export default (props: any) => (
  <input
    {...props}
    style={{
      borderRadius: 4,
      padding: 8,
      border: "none",
      ...props.style,
    }}
  />
);
