function Spinner({
  size = 24,
  color = "currentColor",
  strokeWidth = 3,
  duration = "1.5s",
  rotateDuration = "2s",
  className = "",
  style = {},
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      stroke={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      {...props}
    >
      <style>{`
        .spinner_V8m1 {
          transform-origin: center;
          animation: spinner_zKoa ${rotateDuration} linear infinite;
        }
        .spinner_V8m1 circle {
          stroke-linecap: round;
          animation: spinner_YpZS ${duration} ease-in-out infinite;
        }
        @keyframes spinner_zKoa {
          100% { transform: rotate(360deg); }
        }
        @keyframes spinner_YpZS {
          0% { stroke-dasharray: 0 150; stroke-dashoffset: 0; }
          47.5% { stroke-dasharray: 42 150; stroke-dashoffset: -16; }
          95%, 100% { stroke-dasharray: 42 150; stroke-dashoffset: -59; }
        }
      `}</style>
      <g className="spinner_V8m1">
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth={strokeWidth} />
      </g>
    </svg>
  );
}

export default Spinner;
