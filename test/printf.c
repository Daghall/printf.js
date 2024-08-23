#include <stdarg.h>
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

void print(char *frmt_str, ...) {
  va_list args;
  va_start(args, frmt_str);

  printf("\x1b[32m%-20s \x1b[0m|\x1b[34m", frmt_str);
  int len = vprintf(frmt_str, args);
  printf("\x1b[0m| (%d)\n", len);
}

int main() {
  printf("\n- DECIMAL ----------\n");
  print("%*d", 5, 42);
  print("%5d", 42);
  print("%.5d", 42);
  print("% .5d", 42);
  print("%+.5d", 42);
  print("%+05d", 4711);

  printf("\n- HEX --------------\n");
  print("%*x", 5, 42);
  print("%5x", 42);
  print("%-5x", 42);
  print("%-.5x", 42);
  print("%.5x", 42);
  print("%05x", 42);
  print("%#05x", 42);

  printf("\n- OCTAL ------------\n");
  print("%*o", 5, 42);
  print("%5o", 42);
  print("%.5o", 42);
  print("%05o", 42);

  printf("\n- STRINGS ----------\n");
  print("%.3s-%5.2s", "hello", "world");
  print("%e %E", M_PI, M_E);
  print("%.3e %.2E", M_PI, M_E);
  print("%+11.2e %+010.2E", M_PI, M_E);
  print("%+11.2e %+010.2E", M_PI, M_E);
  print("%010%");

  printf("\n- FLOATS -----------\n");
  print("%f", 3.0);
  print("%.0f", 3.0);
  print("%#.0f", 3.0);
  print("%g", 3.0);
  print("%#g", 3.0);
  print("%#.0g", 3.0);
  print("%g", M_PI);
  print("%#.0e", 47.11);
  print("%g", 47.11);
  print("%#g", 47.11);
  print("%f", 47.11);
  print("%.3f", 123456.789);
  print("%.3e", 123456.789);
  print("%.3g", 123456.789);
  print("%.6G", 123456.789);

  return 0;
}
