/*
 * riscv-pk Project uart16550.c file
 * Modified 30 December 2020 by Sam Ellicott
 * Removed functions for reading settings from dtb, just hardcode QEMU address
 */

/*
Copyright (c) 2013, The Regents of the University of California (Regents).
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. Neither the name of the Regents nor the
   names of its contributors may be used to endorse or promote products
   derived from this software without specific prior written permission.

IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING
OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF REGENTS HAS
BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE. THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED
HEREUNDER IS PROVIDED "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE
MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
*/

#include "uart16550.h"

volatile uint8_t* uart16550 = (volatile uint8_t*) 0x10000000;
// some devices require a shifted register index
// (e.g. 32 bit registers instead of 8 bit registers)
static const uint32_t uart16550_clock = 1843200;   // a "common" base clock

#define UART_REG_QUEUE     0    // rx/tx fifo data
#define UART_REG_DLL       0    // divisor latch (LSB)
#define UART_REG_IER       1    // interrupt enable register
#define UART_REG_DLM       1    // divisor latch (MSB) 
#define UART_REG_FCR       2    // fifo control register
#define UART_REG_LCR       3    // line control register
#define UART_REG_MCR       4    // modem control register
#define UART_REG_LSR       5    // line status register
#define UART_REG_MSR       6    // modem status register
#define UART_REG_SCR       7    // scratch register
#define UART_REG_STATUS_RX 0x01
#define UART_REG_STATUS_TX 0x20

// We cannot use the word DEFAULT for a parameter that cannot be overridden due to -Werror
#ifndef UART_DEFAULT_BAUD
#define UART_DEFAULT_BAUD  38400
#endif

void uart16550_putchar(uint8_t ch)
{
  while ((uart16550[UART_REG_LSR] & UART_REG_STATUS_TX) == 0);
  uart16550[UART_REG_QUEUE] = ch;
}

int uart16550_getchar()
{
  if (uart16550[UART_REG_LSR] & UART_REG_STATUS_RX)
    return uart16550[UART_REG_QUEUE];
  return -1;
}

void uart16550_init()
{
// Check for divide by zero
  uint32_t divisor = uart16550_clock / (16 * UART_DEFAULT_BAUD);
  // If the divisor is out of range, don't assert, set the rate back to the default
  uart16550[UART_REG_IER] = 0x00;                // Disable all interrupts
  uart16550[UART_REG_LCR] = 0x80;                // Enable DLAB (set baud rate divisor)
  uart16550[UART_REG_DLL] = (uint8_t)divisor;    // Set divisor (lo byte)
  uart16550[UART_REG_DLM] = (uint8_t)(divisor >> 8);     //     (hi byte)
  uart16550[UART_REG_LCR] = 0x03;                // 8 bits, no parity, one stop bit
  uart16550[UART_REG_FCR] = 0xC7;                // Enable FIFO, clear them, with 14-byte threshold
}

void uart16550_puts(char* s) {
  while(*s) uart16550_putchar(*s++);
}