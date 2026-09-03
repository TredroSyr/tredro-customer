type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default AuthLayout;
