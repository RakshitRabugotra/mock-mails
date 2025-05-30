#!/bin/bash

# Directory to store responses
mkdir -p responses

# File name with timestamp
FILE="responses/mails_$(date +'%Y-%m-%d_%H-%M-%S').json"

# Make the request and save to file
curl --request GET \
  --url 'https://mock-mails.onrender.com/mails?_page=1&_perPage=10' \
  --silent --show-error --fail \
  -o "$FILE"

echo "Fetched mails saved to $FILE"
