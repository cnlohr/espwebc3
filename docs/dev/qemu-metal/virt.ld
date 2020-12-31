/*
 virt.lds
 Linker script for outputting to RISC-V QEMU "virt" machine.
 Stephen Marz
 6 October 2019
 Edited 12 December 2020 by Sam Ellicott
 Removed comments
*/

/*
  riscv is the name of the architecture that the linker understands
  for any RISC-V target (64-bit or 32-bit).

  We will further refine this by using -mabi=lp64 and -march=rv64gc
*/
OUTPUT_ARCH( "riscv" )

/*
We're setting our entry point to a symbol
called _start which is inside of boot.S. This
essentially stores the address of _start as the
"entry point", or where CPU instructions should start
executing.

In the rest of this script, we are going to place _start
right at the beginning of 0x8000_0000 because this is where
the virtual machine and many RISC-V boards will start executing.
*/
ENTRY( _start )

/*
LENGTH = 128M tells the linker that we have 128 megabyte of RAM.
The linker will double check this to make sure everything can fit.
*/
MEMORY
{
  ram  (wxa!ri) : ORIGIN = 0x80000000, LENGTH = 128M
}

PHDRS
{
  text PT_LOAD;
  data PT_LOAD;
  bss PT_LOAD;
}

SECTIONS
{
  /*
    The first part of our RAM layout will be the text section.
	Since our CPU instructions are here, and our memory starts at
	0x8000_0000, we need our entry point to line up here.
  */
  .text : {
    PROVIDE(_text_start = .);
    *(.text.init) *(.text .text.*)
    PROVIDE(_text_end = .);
  } >ram AT>ram :text
   /*
     The global pointer allows the linker to position global variables and constants into
	 independent positions relative to the gp (global pointer) register. The globals start
	 after the text sections and are only relevant to the rodata, data, and bss sections.
   */
   PROVIDE(_global_pointer = .);
  .rodata : {
    PROVIDE(_rodata_start = .);
    *(.rodata .rodata.*)
    PROVIDE(_rodata_end = .);
  } >ram AT>ram :text

  .data : {
    . = ALIGN(4096);
    PROVIDE(_data_start = .);
    *(.sdata .sdata.*) *(.data .data.*)
    PROVIDE(_data_end = .);
  } >ram AT>ram :data

  .bss : {
    PROVIDE(_bss_start = .);
    *(.sbss .sbss.*) *(.bss .bss.*)
    PROVIDE(_bss_end = .);
  } >ram AT>ram :bss

  /*
     The following will be helpful when we allocate the kernel stack (_stack) and
	 determine where the heap begins and ends (_heap_start and _heap_start + _heap_size)/
	 When we do memory allocation, we can use these symbols.
  */
  PROVIDE(_memory_start = ORIGIN(ram));
  /*
     Our kernel stack starts at the end of the bss segment (_bss_end). However, we're allocating
	 0x80000 bytes (524 KiB) to our kernel stack. This should be PLENTY of space. The reason
	 we add the memory is because the stack grows from higher memory to lower memory (bottom to top).
	 Therefore we set the stack at the very bottom of its allocated slot.
	 When we go to allocate from the stack, we'll subtract the number of bytes we need.
  */
  PROVIDE(_stack_start = _bss_end);
  PROVIDE(_stack_end = _stack_start + 0x80000);
  PROVIDE(_memory_end = ORIGIN(ram) + LENGTH(ram));

  /* 
     Finally, our heap starts right after the kernel stack. This heap will be used mainly
	 to dole out memory for user-space applications. However, in some circumstances, it will
	 be used for kernel memory as well.

	 We don't align here because we let the kernel determine how it wants to do this.
  */
  PROVIDE(_heap_start = _stack_end);
  PROVIDE(_heap_size = _memory_end - _heap_start);
}

