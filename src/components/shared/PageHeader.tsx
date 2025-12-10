type PageHeaderProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <section className="bg-primary/5 py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-headline font-bold text-primary">{title}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{subtitle}</p>
        {children && <div className="mt-6 flex justify-center">{children}</div>}
      </div>
    </section>
  );
}
