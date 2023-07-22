#!/bin/bash

qa_dir='./qa'

if [ -d $qa_dir ]=; then
    rm -rf $qa_dir 
fi

mkdir $qa_dir
QA_TESTRUN_DIR=$qa_dir pnpm run test --coverage

