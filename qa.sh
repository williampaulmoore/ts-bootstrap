#!/bin/bash

unit=""
integration=""
qa_dir='./qa'

usage() {
    echo "Usage: $0 [-u|--unit -i|--integration]"
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        -u|--unit)
            unit="t"
            shift 1
            ;;
        -i|--integration)
            integration="t"
            shift 1
            ;;
        *)
            echo "Invalid option: $1" >&2
            usage
            exit 1
            ;;
    esac
done

if [ "$unit" != "t" ] && [ "$integration" != "t" ]; then
    echo "Invalid options: Need to specifiy either uint or integration tests"
    usage
    exit 1
fi

if [ -d $qa_dir ]; then
    rm -rf $qa_dir 
fi

mkdir $qa_dir
[ "$unit" == "t" ] &&  QA_TESTRUN_DIR=$qa_dir pnpm run test --coverage --testPathPattern=./src
[ "$integration" == "t" ] && QA_TESTRUN_DIR=$qa_dir pnpm run test --coverage --testPathPattern=./integration/

