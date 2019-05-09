import React from 'react';

// get html of number in exponential form
export function toExponential(number) {
  number = parseFloat(number).toExponential(1);
  const mantissa = parseFloat(number.split('e')[0]).toFixed(1);
  const exponent = parseInt(number.split('e')[1]);
  return (
    <span>
      {mantissa} &times; 10<sup>{exponent}</sup>
    </span>
  );
}

// get html of number in regular form, rounded to 1 decimal digit
export function toFixed(number) {
  return <span>{parseFloat(number).toFixed(1)}</span>;
}

// map number to css color (rgba or hex) based on specified gradient
export function toGradient(number) {
  // pretty gradient
  let gradient = [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 249, 196, 1)',
    'rgba(255, 236, 179, 1)',
    'rgba(255, 224, 178, 1)',
    'rgba(255, 204, 188, 1)',
    'rgba(248, 187, 208, 1)'
  ];

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
  return color || '#ffffff';
}

// downloads provided data as csv file
// data in format [ [A1, B1] , [A2, B2] ]
export function downloadCsv(data, filename) {
  const fileContent = data.map((cell) => cell.join(',')).join('\n');
  const blob = new Blob([fileContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.href = url;
  link.download = (filename || 'data') + '.csv';
  link.click();
  window.URL.revokeObjectURL(url);
  link.remove();
}

// make OS-friendly filename
export function makeFilenameFriendly(string) {
  // remove leading and trailing whitespace
  string = string.trim();
  // replace special characters with dashes
  string = string.replace(/[^0-9A-Za-z]/gi, '-');
  // shorten if too long
  string = string.substring(0, 15);
  return string;
}

// downloads provided data as svg file
export function downloadSvg(data, filename) {
  const fileContent = new XMLSerializer().serializeToString(data);
  const blob = new Blob([fileContent], { type: 'image/svg+xml' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.href = url;
  link.download = (filename || 'data') + '.svg';
  link.click();
  window.URL.revokeObjectURL(url);
  link.remove();
}

// show debug message on screen
// useful for mobile debugging where no dev console available
export function debug(...args) {
  let div = document.getElementById('_debug');
  if (!div) {
    div = document.createElement('div');
    div.id = '_debug';
    div.style.position = 'fixed';
    div.style.left = 0;
    div.style.top = 0;
    div.style.background = 'rgba(255, 255, 255, 0.75)';
    div.style.fontFamily = 'monospace';
    div.style.fontSize = '10px';
    div.style.color = '#ff00ff';
    div.style.zIndex = 99999;
    document.body.appendChild(div);
  }
  div.innerHTML += args.join(' | ');
  div.innerHTML += '<br>';
}

// sort array in custom order
export function sortCustom(array, order, key) {
  return array.sort((a, b) => {
    if (key) {
      a = a[key];
      b = b[key];
    }

    a = order.indexOf(a);
    b = order.indexOf(b);

    if (a !== -1 && b !== -1)
      return a - b;
    else if (a !== -1)
      return -1;
    else if (b !== -1)
      return 1;
    else
      return b - a;
  });
}

// remove unnecessary preceding 'www.' and etc from url
export function shortenUrl(url) {
  const regexes = ['^http:\/\/', '^https:\/\/', '\/\/www\.'];
  for (const regex of regexes)
    url = url.replace(new RegExp(regex), '');

  return url;
}
