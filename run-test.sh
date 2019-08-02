#!/bin/bash

bash kill-react-scripts.sh
react-scripts start &
react-scripts test --passWithNoTests
