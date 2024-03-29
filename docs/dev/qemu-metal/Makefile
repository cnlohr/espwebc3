.PHONY: clean run run-gdb gdb

ASM_SRCS = boot.S ecall_funcs.S
C_SRCS   = uart16550.c payload.c 
OUT      := payload.elf

ASMFLAGS = -Og -g
CFLAGS   = -Og -g
#LDFLAGS  = -nostartfiles -nostdlib
LDFLAGS  = -nostdlib

GDB_START = gdb_startup_cmds
GDB_START_MDK = gdb_startup_cmds_mdk

OBJS := $(ASM_SRCS:.S=.o) $(C_SRCS:.c=.o)

QEMU = qemu-system-riscv32
MACH = virt
CPU  = rv32
CPUS = 1
MEM  = 128M

CC   ?= riscv64-elf-gcc -march=rv32imc -mabi=ilp32
CC_gcc   = riscv64-elf-gcc -march=rv32imc -mabi=ilp32
GDB	 = riscv64-elf-gdb 

#-L.. -lbbl -lmachine  -lutil
$(OUT): $(OBJS) virt.ld
	$(CC_gcc) $(CFLAGS) $(LDFLAGS) -T virt.ld $(OBJS) -o payload.elf 
	#$(CC) $(CFLAGS) $(LDFLAGS) $(OBJS) -o payload.elf 

clean:
	rm $(OBJS) $(OUT) 

run: $(OUT) 
	$(QEMU) -machine $(MACH) -cpu $(CPU) -smp $(CPUS) -m $(MEM)  -nographic -serial mon:stdio \
	-bios none -kernel payload.elf 

run-gdb: $(OUT) 
	$(QEMU) -machine $(MACH) -cpu $(CPU) -smp $(CPUS) -m $(MEM)  -nographic -serial mon:stdio \
	-bios none -kernel payload.elf -S -s

gdb: $(OUT)
	$(GDB) -q -tui -x $(GDB_START)

gdb-mdk: $(OUT)
	$(GDB) -q -tui -x $(GDB_START_MDK)

.S.o:
	$(CC) $(ASMFLAGS) -c $< -o $@

.c.o:
	$(CC) $(CFLAGS) -c $< -o $@
