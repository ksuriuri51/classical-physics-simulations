interface ButtonProps {
  label: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function Button({ label, onClick, style }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#1D2951',
        color: '#D4A96A',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {label}
    </button>
  )
}
