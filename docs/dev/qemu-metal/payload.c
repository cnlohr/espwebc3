/* 
 * Sam Ellicott
 * 30 December 2020
 * Test payload for testing emulator support.
 */

#include "uart16550.h"

int main(void) {
  uart16550_init();
  uart16550_puts("Hello World\n");
  return 0;
}
