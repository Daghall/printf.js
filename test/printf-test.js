"use strict";

const printf = require("../index.js");
const expect = require("chai").expect;

describe("printf", () => {

  context("strings", () => {
    it("characters", () => {
      const result = printf("%c %c", "a", 65);
      expect(result).to.equal("a A");
    });

    it("strings", () => {
      const result = printf("%s, %s!", "hello", "world");
      expect(result).to.equal("hello, world!");
    });

    it("preceding with blanks", () => {
      const result = printf("%10s", "hello");
      expect(result).to.equal("     hello");
    });

    it("trailing blanks", () => {
      const result = printf("%-10sworld", "hello");
      expect(result).to.equal("hello     world");
    });

    it("preceding with zeros", () => {
      const result = printf("%010s", "hello");
      expect(result).to.equal("00000hello");
    });

    it("dynamic width", () => {
      const result = printf("%*s", 5, "hello");
      expect(result).to.equal("hello");
    });

    it("precision (truncate)", () => {
      const result = printf("%.3s-%5.2s", "hello", "world");
      expect(result).to.equal("hel-   wo");
    });

    it("literal percent", () => {
      const result = printf("%d %% %010%", 60);
      expect(result).to.equal("60 % 000000000%");
    });
  });

  context("floats", () => {
    it("default precision", () => {
      const result = printf("%f %f", Math.PI, 1);
      expect(result).to.equal("3.141593 1.000000");
    });

    it("specified precision", () => {
      const result = printf("%.2f %.0f", Math.PI, 47.11);
      expect(result).to.equal("3.14 47");
    });

    it("zero precision and '#' flag", () => {
      // TODO: $#.0g = 3.
      const result = printf("%#.0f %#.0e", Math.PI, 47.11);
      expect(result).to.equal("3. 5.e+1");
    });

    it("dynamic precision", () => {
      const result = printf("%.*f", 2, Math.PI);
      expect(result).to.equal("3.14");
    });

    it("exponential notation", () => {
      const result = printf("%e %E %e %E", Math.PI, Math.E, Math.PI / 100, 0.0004711);
      expect(result).to.equal("3.141593e+0 2.718282E+0 3.141593e-2 4.711000E-4");
    });

    it("exponential notation with precision", () => {
      const result = printf("%.3e %.2E", Math.PI, Math.E);
      expect(result).to.equal("3.142e+0 2.72E+0");
    });

    it("exponential notation with precision, width and flags", () => {
      const result = printf("%+10.2e %010.2E", Math.PI, Math.E);
      expect(result).to.equal("   +3.14e+0 0002.72E+0");
    });

    it("Non-finite numbers", () => {
      const result = printf("%f %F %f %F", Infinity, -Infinity, NaN, -NaN);
      expect(result).to.equal("Infinity -INFINITY NaN NAN");
    });
  });

  context("integers", () => {
    it("decimal", () => {
      const result = printf("%d", 4711);
      expect(result).to.equal("4711");
    });

    it("preceding with blanks", () => {
      const result = printf("%10d", 4711);
      expect(result).to.equal("      4711");
    });

    it("preceding with zeros", () => {
      const result = printf("%010d", 4711);
      expect(result).to.equal("0000004711");
    });

    it("preceding with zeros and sign", () => {
      const result = printf("%+06d", 4711);
      expect(result).to.equal("+004711");
    });

    it("truncate", () => {
      const result = printf("%.2d", 4711);
      expect(result).to.equal("47");
    });

    it("ignores '0' flag if '-' flag is present", () => {
      const result = printf("%-06d", 4711);
      expect(result).to.equal("4711  ");
    });

    it("dynamic width", () => {
      const result = printf("%*d", 5, 10);
      expect(result).to.equal("   10");
    });

    it("left justify", () => {
      const result = printf("%-5d%-5d", 10, 10);
      expect(result).to.equal("10   10   ");
    });
  });

  context("hexadecimals", () => {
    it("lowercase", () => {
      const result = printf("%x", 47);
      expect(result).to.equal("2f");
    });

    it("uppercase", () => {
      const result = printf("%X", 47);
      expect(result).to.equal("2F");
    });

    it("ignores '+' and ' ' flags", () => {
      const result = printf("%+5x|% 5X", 47, 47);
      expect(result).to.equal("   2f|   2F");
    });

    it("hash flag", () => {
      const result = printf("%#x %#X", 47, 47);
      expect(result).to.equal("0x2f 0X2F");
    });

    it("hash flag with width", () => {
      const result = printf("%#6x|%#6X", 47, 47);
      expect(result).to.equal("  0x2f|  0X2F");
    });

    it("preceding zeroes ('0' flag or precision)", () => {
      const result = printf("%06x|%.6X", 47, 47);
      expect(result).to.equal("00002f|00002F");
    });
  });

  context("octals", () => {
    it("plain", () => {
      const result = printf("%o", 47);
      expect(result).to.equal("57");
    });

    it("hash flag", () => {
      const result = printf("%#o", 47);
      expect(result).to.equal("057");
    });

    it("hash flag with width", () => {
      const result = printf("%#6o", 47);
      expect(result).to.equal("   057");
    });

    it("preceding zeroes ('0' flag or precision)", () => {
      const result = printf("%06o|%.6o", 47, 47);
      expect(result).to.equal("000057|000057");
    });

    it("ignores '+' and ' ' flags", () => {
      const result = printf("%+5o|% 5o", 47, 47);
      expect(result).to.equal("   57|   57");
    });
  });

  context("multiple flags", () => {
    it("left justify and preceding zeros", () => {
      // '#' flag is ignored for d and i specifiers
      // ' ' flag is ignored when the '+' flag is present
      const result = printf("%+- #05d", 4711);
      expect(result).to.equal("+4711 ");
    });

    it("right justify and preceding zeros", () => {
      const result = printf("%+ #05d", 4711);
      expect(result).to.equal("+04711");
    });

    it("left justify string with dynamic width and length", () => {
      const result = printf("%-*.*s", 20, 5, "Hello world");
      expect(result).to.equal("Hello               ");
    });

    it("ignores '0' flag if '-' flag is present", () => {
      const result = printf("%-06d|%-06x|%-06o|", 47, 47, 47);
      expect(result).to.equal("47    |2f    |57    |");
    });
  });

  context("error handling", () => {
    it("throws if number of formats and variables don't match", () => {
      expect(() => printf("%d %d", 1)).to.throw("Expected 2 variables, got 1");
    });

    it("throws if dynamic width is missing", () => {
      expect(() => printf("%*d", 1)).to.throw("Expected 2 variables, got 1");
    });

    it("throws if dynamic width and/or precision is missing", () => {
      expect(() => printf("%*.*d", 1)).to.throw("Expected 3 variables, got 1");
      expect(() => printf("%*.*d", 2, 1)).to.throw("Expected 3 variables, got 2");
    });
  });
});

