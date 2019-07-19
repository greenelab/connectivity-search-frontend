import React from 'react';

// get html of number in exponential form
export function toExponential(number) {
  if (typeof number !== 'number')
    return '-';

  number = parseFloat(number).toExponential(1);
  const mantissa = parseFloat(number.split('e')[0]).toFixed(1);
  const exponent = parseInt(number.split('e')[1]);

  if (isNaN(mantissa) || isNaN(exponent))
    return '-';

  return (
    <span>
      {mantissa} &times; 10<sup>{exponent}</sup>
    </span>
  );
}

// get html of number in regular form, rounded to 1 decimal digit
export function toFixed(number) {
  if (typeof number !== 'number')
    return '-';
  return <span>{parseFloat(number).toFixed(1)}</span>;
}

// split many-digit number by comma (or other, depending on locale)
export function toComma(number) {
  if (typeof number !== 'number')
    return '-';
  return Number(number).toLocaleString();
}

// map number to css color based on specified gradient
export function toGradient(number) {
  if (typeof number !== 'number')
    return 'rgba(255, 255, 255, 0)';

  // pretty gradient
  let gradient = ['rgba(255, 255, 255, 0)', 'rgba(244, 143, 177, 0.5)'];

  // split each gradient color into component rgba values
  gradient = gradient.map((color) => {
    color = color.split(/[^0-9,]/).join('');
    color = {
      r: parseInt(color.split(',')[0]),
      g: parseInt(color.split(',')[1]),
      b: parseInt(color.split(',')[2]),
      a: parseFloat(color.split(',')[3])
    };
    return color;
  });

  // take log of number
  // (equivalent of getting exponent of number in exponential notation)
  number = Math.log10(number);

  // start/end cutoffs for exponent
  const rangeStart = 0;
  const rangeEnd = -8;

  // get percent that number is through range
  let percent = (number - rangeStart) / (rangeEnd - rangeStart);
  percent = Math.min(Math.max(0, percent), 1);

  // map percent to float gradient index
  const gradientIndex = (gradient.length - 1) * percent;
  // get integer indices below/above float index
  const lowerColor = gradient[Math.floor(gradientIndex)];
  const higherColor = gradient[Math.ceil(gradientIndex)];
  // get percent that float index is between nearest integer indices
  const percentBetween = gradientIndex % 1;

  // interpolate color between gradient colors below/above float index
  let color = {
    r: lowerColor.r + (higherColor.r - lowerColor.r) * percentBetween,
    g: lowerColor.g + (higherColor.g - lowerColor.g) * percentBetween,
    b: lowerColor.b + (higherColor.b - lowerColor.b) * percentBetween,
    a: lowerColor.a + (higherColor.a - lowerColor.a) * percentBetween
  };

  // clean rgba values
  color.r = Math.floor(color.r);
  color.g = Math.floor(color.g);
  color.b = Math.floor(color.b);
  color.a = color.a.toFixed(3);

  // convert color in rgba format to css color string
  color =
    'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';

  // return color
  return color || 'rgba(255, 255, 255, 0)';
}
