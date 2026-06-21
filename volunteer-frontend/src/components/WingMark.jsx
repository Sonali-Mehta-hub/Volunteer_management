export default function WingMark({ size = 22, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 48 30" width={size} height={(size * 30) / 48} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 26C9 18 14 8 22 2C24 10 22 18 16 22C22 20 28 14 30 6C34 12 33 20 27 25C34 23 41 16 46 8C44 18 36 27 26 28C18 29 8 27 2 26Z"
        fill={color}
      />
    </svg>
  );
}
