type Props = {
  onDiscard: () => void
}

export default function EditButtonGroup({ onDiscard }: Props) {
  return (
    <>
      <button
        type="button"
        onClick={onDiscard}
        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded"
      >
        Discard
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Save
      </button>
    </>
  )
}
