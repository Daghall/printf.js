"use strict";

// %[flags][width][.precision]specifier
module.exports = function printf(...argv) {
  const formatString = argv[0];
  debug({argv});

  const formats = formatString.match(/(%[-+ #0]*(\d*|\*)?(\.?(\d*|\*))?[sdfFcxXoeE%])/g) || []; // TODO: Rewrite regex
  debug({formats});

  const frmt = {
    string: formatString,
    formats,
    variables: Array.prototype.slice.call(argv).slice(1),
  };
  debug({frmt});

  validateNumberOfParameters(formats, frmt);

  while (formats.length > 0) {
    debug(`Formatting "${formats.at(0)}"`);
    formatVariable(frmt);
  }

  return frmt.string;
};

const DEBUG = false;

function validateNumberOfParameters(formats, frmt) {
  const expectedNumberOfVariables = formats.reduce((acc, format) => {
    if (format.at(-1) === "%") { // Escaped percent sign
      return acc;
    }
    return acc + 1 + format.length - format.replace(/\*/g, "").length;
  }, 0);

  if (frmt.variables.length !== expectedNumberOfVariables) {
    throw new Error(`Expected ${expectedNumberOfVariables} variables, got ${frmt.variables.length}`);
  }
}

function formatVariable(frmt) {
  const format = frmt.formats.shift();
  let [, flags, width, precision, specifier] = format.match(/%([-+ #0]*)?(\d*|\*)?\.?(\d*|\*)?([sdfFcxXoeE%])/);

  if (width === "*") {
    width = parseInt(frmt.variables.shift());
  }

  if (precision === "*") {
    precision = parseInt(frmt.variables.shift());
  }

  flags = parseFlags(flags);

  let variable = frmt.variables.shift();
  const negative = typeof variable === "number" ? variable < 0 : null;
  debug({ flags, width, precision, specifier, variable});

  let uppercase = false;

  // Specifier
  switch (specifier) {
    case "%":
      variable = "%";
      break;
    case "s":
      // No-op
      break;
    case "c":
      if (typeof variable === "number") {
        variable = String.fromCharCode(variable);
      }
      break;
    case "d":
    case "i":
      variable = variable.toString();
      break;
    case "F": // C99
      uppercase = true;
      // Falls through
    case "f":
      precision = precision || 6;
      break;
    case "E":
      uppercase = true;
      // Falls through
    case "e":
      precision = precision || 6;
      break;
    case "o":
      variable = (flags.hash ? "0" : "") + variable.toString(8);
      break;
    case "X":
      uppercase = true;
      // Falls through
    case "x":
      variable = (flags.hash ? "0x" : "") + variable.toString(16);
      break;
    case "a": // C99
    case "A": // C99
    case "g":
    case "G":
      // TODO: remove trailing zeroes for g and G
      throw new Error("Not implemented");
    default:
      // TODO: Test this
      throw new Error(`Unknown specifier "${specifier}"`);
  }

  // Precision
  if (precision) {
    if (typeof variable === "number") {
      if (specifier.toLowerCase() === "e") {
        variable = variable.toExponential(precision);
      } else {
        variable = variable.toFixed(precision);
      }
    } else if (["o", "x"].includes(specifier.toLowerCase())) {
      flags.zeroPad = true;
      width = precision;
    } else {
      variable = variable.toString();
      variable = variable.slice(0, precision);
    }
  }

  // The '#' flag used with a, A, e, E, f, F, g or G forces the written output
  // to contain a decimal point even if no more digits follow. By default, if
  // no digits follow, no decimal point is written.
  if (flags.hash && parseInt(precision) === 0) {
    if ([ "a", "e", "f", "g"].includes(specifier.toLowerCase())) {
      variable = variable.replace(/^(\d+)/, "$1.");
    }
  }

  // Width
  if (width !== undefined) {
    const pad = (flags.zeroPad && !flags.leftJustify) ? "0" : " ";
    variable = flags.leftJustify
      ? variable.padEnd(width, pad)
      : variable.padStart(width, pad);
  }

  // Signage
  if (negative !== null && !negative && !["x", "o"].includes(specifier.toLowerCase())) {
    // The '+' flag and the ' ' flag are mutually exclusive
    // and only relevant for decimal integers/floats
    if (flags.plus) {
      variable = variable.replace(/^( *)/, "$1+");
    } else if (flags.space) {
      variable = ` ${variable}`;
    }
  }

  if (uppercase) {
    variable = variable.toString().toUpperCase();
  }

  frmt.string = frmt.string.replace(format, variable);
}

function parseFlags(flags = "") {
  const leftJustify = flags.includes("-");
  return {
    zeroPad: !leftJustify && flags.includes("0"),
    leftJustify,
    space: flags.includes(" "),
    plus: flags.includes("+"),
    hash: flags.includes("#"),
  };
}

function debug(...args) {
  if (DEBUG) {
    console.log(...args); // eslint-disable-line no-console
  }
}
