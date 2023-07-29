#!/usr/bin/env bash

echo "test.sh"

unit=""
integration=""

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

[ "$unit" == "t" ] && echo "unit: $unit"
[ "$integration" == "t" ] && echo "integration: $integration"

