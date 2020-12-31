# boot.S
# bootloader for SoS
# Stephen Marz
# 8 February 2019
# Edited by Sam Ellicott
# 30 December 2020
# Made compatible with riscv-32 isa
# Now launches C code instead of rust code

.option norvc

.section .data:

.section .text.init
.global _start
_start:
	# Any hardware threads (hart) that are not bootstrapping
	# need to wait for an IPI
	csrr	t0, mhartid
	bnez	t0, 3f
	# SATP should be zero, but let's make sure
	csrw	satp, zero
.option push
.option norelax
	la		gp, _global_pointer
.option pop

  # The BSS section is expected to be zero
	la 		a0, _bss_start
	la		a1, _bss_end
	bgeu	a0, a1, 2f
1:
	sw		zero, (a0)
	addi	a0, a0, 4
	bltu	a0, a1, 1b
2:

# setup the stack
la		sp, _stack_end
call main
#j asm_trap_vector

3:
	wfi
	j	3b

asm_trap_vector:
  # print the string on the system console then end the program
  la a0, trap_str
  call uart16550_puts
  call ecall_shutdown

.local trap_str
trap_str:
  .asciz "Hello from the trap vector!\n"