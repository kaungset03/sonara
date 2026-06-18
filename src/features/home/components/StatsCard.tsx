type StatsCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
};

const StatsCard = ({ icon, label, value }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="text-primary">{icon}</div>
      <p className="text-sm text-muted-foreground text-center">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
};
export default StatsCard;
