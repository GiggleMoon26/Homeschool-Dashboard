'use client';

export default function DeleteChildButton({
  childName,
  deleteAction,
}: {
  childName: string;
  deleteAction: () => void;
}) {
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (!confirm(`Delete ${childName}'s profile permanently? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button className="rounded-lg bg-red-900 hover:bg-red-800 text-red-200 py-2 px-4 text-sm">
        Delete {childName}&apos;s profile
      </button>
    </form>
  );
}
