interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
}

export function Slider({ value, onChange, min, max, step }: SliderProps) {
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      style={{
        width: '100%',
        cursor: 'pointer',
        accentColor: '#D4A96A',
      }}
    />
  )
}
