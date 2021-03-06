## Notes

## GCC Build

 * To test with GCC, we can install `riscv64-unknown-elf-gcc` and execute it ->
```
cnlohr@DESKTOP:~$ riscv64-unknown-elf-gcc test.c -o test -nostdlib -march=rv32imc -mabi=ilp32
/usr/lib/riscv64-unknown-elf/bin/ld: warning: cannot find entry symbol _start; defaulting to 0000000000010054
cnlohr@DESKTOP:~$ riscv64-unknown-elf-objdump -S test

test:     file format elf32-littleriscv


Disassembly of section .text:

00010054 <add2>:
   10054:       1101                    addi    sp,sp,-32
   10056:       ce22                    sw      s0,28(sp)
   10058:       1000                    addi    s0,sp,32
   1005a:       fea42623                sw      a0,-20(s0)
   1005e:       feb42423                sw      a1,-24(s0)
   10062:       fec42703                lw      a4,-20(s0)
   10066:       fe842783                lw      a5,-24(s0)
   1006a:       97ba                    add     a5,a5,a4
   1006c:       853e                    mv      a0,a5
   1006e:       4472                    lw      s0,28(sp)
   10070:       6105                    addi    sp,sp,32
   10072:       8082                    ret
   
   
cnlohr@DESKTOP:~$ riscv64-unknown-elf-gcc test.c -o test -nostdlib -march=rv32imc -mabi=ilp32 -Os
/usr/lib/riscv64-unknown-elf/bin/ld: warning: cannot find entry symbol _start; defaulting to 0000000000010054
cnlohr@DESKTOP:~$ riscv64-unknown-elf-objdump -S test

test:     file format elf32-littleriscv


Disassembly of section .text:

00010054 <mul2>:
   10054:       02b50533                mul     a0,a0,a1
   10058:       8082                    ret
```

### Targeting TCC for WASM.

```
./configure --cc=clang --extra-cflags="-I.. -DWASM -nostdlib --target=wasm32 -flto -Oz -Wl,--lto-O3 -Wl,--no-entry -Wl,--allow-undefined -Wl,--import-memory"

clang -o tcc.o -c tcc.c -DCONFIG_TRIPLET="\"x86_64-linux-gnu\"" -DTCC_TARGET_X86_64        -DONE_SOURCE=0 -I.. -DWASM -nostdlib --target=wasm32 -flto -Oz -Wl,--lto-O3 -Wl,--no-entry -Wl,--allow-undefined -Wl,--import-memory -Wdeclaration-after-statement -fno-strict-aliasing -fheinous-gnu-extensions -Wno-pointer-sign -Wno-sign-compare -Wno-unused-result -Wno-string-plus-int -I. 
clang: warning: -Wl,--lto-O3: 'linker' input unused [-Wunused-command-line-argument]
clang: warning: -Wl,--no-entry: 'linker' input unused [-Wunused-command-line-argument]
clang: warning: -Wl,--allow-undefined: 'linker' input unused [-Wunused-command-line-argument]
clang: warning: -Wl,--import-memory: 'linker' input unused [-Wunused-command-line-argument]
In file included from tcc.c:21:
./tcc.h:29:10: fatal error: 'stdlib.h' file not found
#include <stdlib.h>
         ^~~~~~~~~~
1 error generated.
make: *** [Makefile:229: tcc.o] Error 1

```


### TinyCC Compiler Explorer Support godbolt.org

https://github.com/compiler-explorer/compiler-explorer/issues/246



# Emulator Support
Sam Ellicott 12-28-20

## Spike Emulator
### Install the Emulator
The first emulator I was able to get to work was the Official RISC-V ISA Emulator
[Spike](https://github.com/riscv/riscv-isa-sim). 
~~(I would like to get this working with QEMU or
TinyEMU in the future.)~~ If you are using Arch Linux, you can install the `spike` package.
Otherwise, building the emulator is pretty straight forward, just follow the directions on the
project github page. 

Note that the `$RISCV` variable in the build instructions refers to the
location where the gcc toolchain was installed. However, I would recommend installing
to somewhere in your home directory where you plan to keep risc-v files. For example,
I am using `~/.local/riscv`. However, this should be added your path.

### Build the proxy kernel
*This is a temporary measure in order to load and run user binaries on the emulator. Ideally,
the startup code will be included in the user compiled binary*

This project contains the berkley bootloader (bbl) which provides basic initialization of the
"hardware" in order to run user code. It also contains the proxy kernel (pk) which provides
the system calls allowing code compiled with newlib to work.

From the [riscv-pk](https://github.com/riscv/riscv-pk) github page follow the build instructions
to compile the project. 

* We want 32-bit binaries (specifically with the m and c extensions) so use
the `--with-arch=rv32imc` flag when compiling.

### Generate some test code
Write a basic C test program. I am using "Hello World" in the file `test.c`.
```C
//listing for test.c
#include <stdio.h>
int main(void) {
  puts("Hello World!");
  return 0;
}
```
Compile:
```
riscv64-unknown-elf-gcc -march=rv32imc -mabi=ilp32 test.c -o test.elf
```
This builds a binary (using the newlib library for stdout)

### Run the code
Run the code with `spike`:
```
spike --isa=RV32IMC pk test.elf
```

You should be greeted by the output:
```
bbl loader
Hello World!
```

## QEMU Emulator
Sam Ellicott 12/31/20

### Usage Instructions
*NOTE: These instructions are for Arch linux*

* Install QEMU for risc-v with the `qemu-arch-extra` package. You will also need
  `riscv64-elf-gdb`
* Run `make` in the [/dev/qemu-metal](dev/qemu-metal) directory this will build
  the elf binary.
* Debug Instructions
  * Start a second terminal window in the same directory.
  * In one terminal, run `make run-gdb`. This will start QEMU in gdb server mode
  * In the second terminal run `make gdb`. This will start gdb (in tui mode),
    connect to QEMU, and run a few commands (commands stored in 
    [gdb-startup-cmds](dev/qemu-metal/gdb_startup_cmds) file)
* To run QEMU without gdb, use `make run`

### Quirks
* The program doesn't exit cleanly, so you always have to kill QEMU: `ctrl+a, x`

## Things left to do with the emulator
* [ ] Compile user code to start with bbl. There is a configuration option for this, but I have
not been able to get it to work.
* [ ] Get binaries to work with TinyEMU and QEMU
  * [ ] TinyEMU
  * [x] QEMU - 30 December 2020
* [ ] Get printing to work without newlib (i.e. without pk)
  * [ ] spike
  * [ ] TinyEMU
  * [x] QEMU - 30 December 2020
* [x] Integrate user binary into bbl, or figure out initialization code.
  * Kind of, QEMU works without the bbl bootloader, just bare asm initilization code
* [ ] Work with the Espressif IDF

# Notes on using Dr. Wolf's [MDK suite](https://github.com/cpq/mdk)
Sam Ellicott: 07/11/21

* Made a launch.mkd file to add the exports required for the development kit
* Arch uses riscv64-elf as its prefix for the riscv compiler for bare metal
* First error encountered is `#include <sdk.h>` not found
  * This was caused by not setting the right `MDK` environment variable
* When using `esputil` I get an error "Error Connecting"
* Test binaries are not running when flashed with the regular `esptool` utility
  * Problem with default flash parameters and boot config stuff
  * Need to set the chip id to 5 (offset 12 in the hex file)
  * Need to set the chip revision number to 2 offset 14 in the hex file
  * Need to set the chip flash mode to DIO 0x021f in offset 2, 3
  * first 16 bytes `e9 02 02 1f 00 04 38 40 ee 00 00 00 05 00 02 00`
  * Current workaround
```
xxd -p -g1 examples/c3ws2812/build/firmware.bin \
| sed '1c e902021f00043840ee0000000500020000000000000000010080c83fe000' \
| xxd -r -p > firmware.bin && \
python -m esptool --port /dev/ttyUSB0 write_flash 0x0000 firmware.bin
```

# TCC port to riscv32

Start by reading the [TCC Developers Documentation](https://bellard.org/tcc/tcc-doc.html#devel)

## Converting between TCC and riscv registers

### Integer Register Mapping
| Integer Register | risv-v register | tcc register |
|:-----------------|:---------------:|:------------:|
|  Return Address  | 1               |     17       |
|   Stack Pointer  | 2               |     18       |
| function arg reg | 10 - 17         | 0 - 7        |

### Floating-point Register Mapping
| Integer Register   | risv-v register | tcc register |
|:-------------------|:---------------:|:------------:|
| floating-point reg | 10 - 17         | 8 - 16       |

# Appendix A: Reference Documents
* Official Assembly Manual: https://github.com/riscv/riscv-asm-manual/blob/master/riscv-asm.md
* Assembly Manual PDF (IIT): https://shakti.org.in/docs/risc-v-asm-manual.pdf
* Official ISA Documentation: https://github.com/riscv/riscv-isa-manual/releases/download/Ratified-IMAFDQC/riscv-spec-20191213.pdf
* List of riscv instructions: https://risc-v.guru/instructions/
* Information about riscv directives: https://embarc.org/man-pages/as/RISC_002dV_002dDirectives.html
* Detailed steps on porting rust to riscv (mostly assembly): https://osblog.stephenmarz.com/ch1.html