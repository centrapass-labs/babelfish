export default (props: any) => (
  <button
    {...props}
    style={{
      background: "#6ae05f",
      border: "none",
      borderRadius: 32,
      padding: 8,

      fontSize: 16,
      fontWeight: "bold",
      width: "fit-content",
      minWidth: 128,
      ...props.style,
    }}
  />
);
