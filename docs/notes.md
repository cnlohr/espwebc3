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


# Appendix A: Reference Documents
* Official Assembly Manual: https://github.com/riscv/riscv-asm-manual/blob/master/riscv-asm.md
* Assembly Manual PDF (IIT): https://shakti.org.in/docs/risc-v-asm-manual.pdf
* Official ISA Documentation: https://github.com/riscv/riscv-isa-manual/releases/download/Ratified-IMAFDQC/riscv-spec-20191213.pdf
* List of riscv instructions: https://risc-v.guru/instructions/
* Information about riscv directives: https://embarc.org/man-pages/as/RISC_002dV_002dDirectives.html
* Detailed steps on porting rust to riscv (mostly assembly): https://osblog.stephenmarz.com/ch1.html