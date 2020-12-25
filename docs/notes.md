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

00010054 <add2>:
   10054:       02b50533                mul     a0,a0,a1
   10058:       8082                    ret
```


Next: Emulator.
