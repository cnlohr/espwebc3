# Sam Ellicott
# 30 December 2020
# implement C callable versions of the system environment calls (ecall)
# These don't seem to be working at the moment (spike, QEMU, TinyEMU)

.global ecall_putc
ecall_putc:
  # save the return address to the stack
  addi  sp, sp, -16
  sw    ra, 12(sp)
  # Function argument is already in a0, which is what we want to pass 
  # to the system call
  li a7, 1 
  ecall
  lw    ra, 12(sp)
  addi  sp, sp, 16
  ret

.global ecall_getc
ecall_getc:
  # save the return address to the stack
  addi  sp, sp, -16
  sw    ra, 12(sp)
  # make the system call
  li a7, 2 
  ecall
  # the return value is already in a0, which is what we want to return
  lw    ra, 12(sp)
  addi  sp, sp, 16
  ret

.global ecall_shutdown
ecall_shutdown:
  # since we are exiting the program, we don't care about saving the ra register
  li a7, 8 
  ecall

.global ecall_puts
ecall_puts:
  # save the return address and s0 to the stack
  addi  sp, sp, -32
  sw    ra, 24(sp)
  sw    s0, 12(sp)
  
  # move the string address to s0
  mv s0, a0
1:
  lbu a0, (s0)
  beqz a0, 2f
  li a7, 1
  ecall
  add s0, s0, 1
  j 1b
2:
  # pop the stack
  lw    ra, 24(sp)
  lw    s0, 12(sp)
  addi  sp, sp, 32 
  ret