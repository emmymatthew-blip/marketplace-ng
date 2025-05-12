export function MainNav({ hideAuthNav = false }: { hideAuthNav?: boolean } = {}) {
  return (
    <div className="flex items-center gap-4">
      {!hideAuthNav && (
        <div className="hidden md:block">
          <Search />
        </div>
      )}
      {!hideAuthNav && <UserAccountNav />}
    </div>
  );
} 