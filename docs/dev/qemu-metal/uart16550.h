/*
 * riscv-pk Project uart16550.h file
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

#ifndef _RISCV_16550_H
#define _RISCV_16550_H

#include <stdint.h>

// this variable is set by the linker script
extern volatile uint8_t* uart16550;

void uart16550_putchar(uint8_t ch);
int uart16550_getchar();
void uart16550_init();
void uart16550_puts(char* s);
#endif
