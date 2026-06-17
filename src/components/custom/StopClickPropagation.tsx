const StopClickPropagation = ({ children }: { children: React.ReactNode }) => (
  <div onClick={(e) => e.stopPropagation()} style={{ display: "contents" }}>
    {children}
  </div>
);

export default StopClickPropagation;
