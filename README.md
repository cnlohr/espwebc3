# espwebc3

An **PLANNED** in-browser IDE for the ESP32-C3 self-contained on the ESP32-C3, a new microcontroller from Espressif, which boasts a 160 MHz RISC-V processor.  Currently in the first stage of planning - this project may or may not go into production.

We are in request for comment phase. Please discuss here on discord: https://discord.gg/CCeyWyZ or (less ideal) in issues on this project.

## The Idea

Imagine if we had an Arduino-like environment for the ESP32-C3.  But, imagine, for a moment, if it lived entirelly within a webpage that was served up from the ESP32-C3.  A whole IDE, complete with compiler and debugger, which could compile code to run natively on the ESP32-C3, push the code to the device and debug it remotely.  Just imagine if you could have something like Arduino, but you need not install any applications on your PC.  No serial ports to mess with, no bloated and complicated code download procedure.

## The Background

 * The [ESP32-C3](https://www.espressif.com/en/news/ESP32_C3) has an RV32-IMC enabled processor, meaning it's pretty stripped down but has support for the base RV32 ISA + Multiply / Divide + Condensed instructions.
 * The current espressif-sanctioned development environment is built upon their ESP-IDF, which has a lot of functionality for system maintainence, sockets, etc. and threads. 
 * [TinyCC](https://repo.or.cz/w/tinycc.git) supports RV64 targets, but does not currently (as of Dec 18, 2020) suppot RV32 targets.  After examining [riscv-gen.c](https://repo.or.cz/tinycc.git/blob/HEAD:/riscv64-gen.c) It appears it should not be very difficult to make it target RV32 instead of RV64.
 * The RISC-V port of TinyCC is ~240 kB on Intel, and ~140kB compressed.
 * Conveniently, you can serve all modern web browsers gzipped files, and do not need to worry about having a decompressor available when using [gzip content encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
 * [rawdraw wasm](https://github.com/cntools/rawdraw/tree/master/wasm) now demonstrates how to perform a minimal direct-to-html (Though could support separate compiled objects) compilation of C code to WASM, with a few projects coming in under 20kB.
 * (no link, as it's private) but, I have a port for a much simpler and more applicable HTTP server for this project which works in the ESP-IDF.

## The Minimum Viable Product Plan

 * Get an RV32 emulator working so we can examine and work with TinyCC building targets on a regular PC, so we don't need an ESP32-C3
 * Make TinyCC able to target the ESP32-C3.
 * Compile TinyCC to WASM with Clang, and the toolset discussed in rawdraw wasm.
 * Build an IDF project, which includes the HTTP server.
 * Put together a header file, or handfull of header files which contain the bulk of what we would hope people to be able to do with this environment.
   * Additional header files could be included on a per-project basis.
   * Additional source files, like libraries, etc. could be included on a per-project basis.
   * The browser could pull these source files from the internet and include them in the user's project.
   * Make sure the code that is generated for the ESP32-C3 is relocatable.
 * Make a backend system capable of storing gzipped source/header files, though user written code will likely remain uncompressed.
 * Make backend system able to also store and execute binary blobs of executable code.
 * Make a basic webpage capable of:
    * Having a text area for the user to type new code in
    * Press a 'compile' 'upload' 'run' button.
    * Be able to view the IDF's log (so you can write `hello, world` and see the printout)

## The longer-term

 * Be able to view the header files
 * Use TinyCC to reflect the code, for really good context menus.
 * Be able to add breakpoints to code, watch variables, etc.
 * Be able to pull modules to use various devices directly from the internet.
 * Upload code to a server.
 * Store multiple programs/processes on/for the device.
 * Potentially use CNLohr's IP stack for way lower latency back-and-forth comms.
 * Make sure entire system + user applicaiton to fit into bottom 1MB of flash.
 * Have libraries for working with lots of devices.
 * Support other RISC-V devices.
 * Support code hot-loading.
 * Make a minecraft server you can edit while it's running minecraft!

## How you can help

* If someone can mock-up what the GUI could look like notionally.
* If someone could frame up how we can diagram out how the system would fit together.
* If someone can work on getting an emulator setup working for RV32.
* If someone can work on adding a `-m32` feature for TinyCC's riscv-gen.c.
* If someone can work on getting TinyCC compiling for WASM.
