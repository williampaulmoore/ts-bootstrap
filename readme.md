# ashm bootstrapper

Utitlity for bootstrapping common software development projects. 

## Description

It will allow the creation of template code that needs when first setting up a software development project. The aim being the consistent and expedient creating of project of the same type allowing getting into the development of the value as quickly as possible.  For each type there will be the standard opt-in options for things likes compiler options, testing frameworks/qa reports, validation libraries, documentation, project structure etc.

## Installation

This project is a typescript cli project that can be installed via npm link.  Once installed the cli can be invoked by:

```sh
ashm
```

### Contributing

The project is typescript tested via jest.  Each project bootstrapper will be setup in its own  directory under the ./src dir (which is the root for project source).  Test files are expected to be typescript, live in the same directory and have .test as a prefix to the file extension.

e.g. ./scr/ts-cli/index.test.ts

### QA

There is a __qa.sh__ in the root directory that is mainly intended for ci pipeline, it performs a test run that will generate a testrun report and a coverage report. TAP format is uised for the test run report as it is a universal format rathen than tool or language specific.
