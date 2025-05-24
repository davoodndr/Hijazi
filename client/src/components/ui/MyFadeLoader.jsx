
const cssUnit = {
  cm: true,
  mm: true,
  in: true,
  px: true,
  pt: true,
  pc: true,
  em: true,
  ex: true,
  ch: true,
  rem: true,
  vw: true,
  vh: true,
  vmin: true,
  vmax: true,
  "%": true,
};

function parseLengthAndUnit(size) {
  if (typeof size === "number") {
    return {
      value: size,
      unit: "px",
    };
  }

  let value;
  const valueMatch = size.match(/^[0-9.]*/);
  const valueString = valueMatch ? valueMatch[0] : "";

  if (valueString.includes(".")) {
    value = parseFloat(valueString);
  } else {
    value = parseInt(valueString, 10);
  }

  const unitMatch = size.match(/[^0-9]*$/);
  const unit = unitMatch ? unitMatch[0] : "";

  if (cssUnit[unit]) {
    return { value, unit };
  }

  console.warn(`React Spinners: ${size} is not a valid CSS value. Defaulting to ${value}px.`);

  return {
    value,
    unit: "px",
  };
}

function cssValue(value) {
  const lengthWithUnit = parseLengthAndUnit(value);
  return `${lengthWithUnit.value}${lengthWithUnit.unit}`;
}

const createAnimation = (loaderName, frames, suffix) => {
  const animationName = `react-spinners-${loaderName}-${suffix}`;

  if (typeof window == "undefined" || !window.document) {
    return animationName;
  }

  const styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  const styleSheet = styleEl.sheet;

  const keyFrames = `
    @keyframes ${animationName} {
      ${frames}
    }
  `;

  if (styleSheet) {
    styleSheet.insertRule(keyFrames, 0);
  }

  return animationName;
};

const fade = createAnimation("FadeLoader", "50% {opacity: 0.3} 100% {opacity: 1}", "fade");

export default function FadeLoader({
  loading = true,
  color = "#000000",
  speedMultiplier = 1,
  cssOverride = {},
  height = 15,
  width = 5,
  radius = 2,
  margin = 2,
  size = 40,
  ...props
}) {
  const { value: marginValue } = parseLengthAndUnit(margin);

  const radiusValue = size / 2;
  const quarter = radiusValue / 2 + radiusValue / 5.5;

  const wrapper = {
    display: "inherit",
    position: "relative",
    fontSize: "0",
    top: radiusValue,
    left: radiusValue,
    width: `${radiusValue * 3}px`,
    height: `${radiusValue * 3}px`,
    ...cssOverride,
  };

  const style = (i) => ({
    position: "absolute",
    width: cssValue(width),
    height: cssValue(height),
    margin: cssValue(marginValue),
    backgroundColor: color,
    borderRadius: cssValue(radius),
    animationFillMode: "both",
    animation: `${fade} ${1.2 / speedMultiplier}s ${i * 0.12}s infinite ease-in-out`,
  });

  const positions = [
    { top: radiusValue, left: 0 },
    { top: quarter, left: quarter, transform: "rotate(-45deg)" },
    { top: 0, left: radiusValue, transform: "rotate(90deg)" },
    { top: -quarter, left: quarter, transform: "rotate(45deg)" },
    { top: -radiusValue, left: 0 },
    { top: -quarter, left: -quarter, transform: "rotate(-45deg)" },
    { top: 0, left: -radiusValue, transform: "rotate(90deg)" },
    { top: quarter, left: -quarter, transform: "rotate(45deg)" },
  ];

  if (!loading) return null;

  return (
    <span style={wrapper} {...props}>
      {positions.map((pos, i) => (
        <span key={i} style={{ ...style(i + 1), ...pos }} />
      ))}
    </span>
  );
}
