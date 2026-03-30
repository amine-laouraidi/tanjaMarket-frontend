// src/app/loading.jsx
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-[3px] border-blue-100 border-t-blue-600 animate-spin" />
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}