const Input = (props: any) => (
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

export default Input;
